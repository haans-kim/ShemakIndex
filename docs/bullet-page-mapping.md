# 인덱스 불릿 → HTML 페이지 매핑 (네비게이션)

Shemak 기능도(Next.js 인덱스)의 각 **불릿 항목**을 클릭하면 매핑된 산출물 HTML의 해당 상세로 이동하고, **브라우저 뒤로가기**로 인덱스에 복귀하는 기능의 설계·구현 기록.

> 작성: 2026-05-28. 구현 도중의 구조 분석·시행착오를 포함해 향후 개발 참조용으로 남김.

---

## 1. 개요 / 요구사항

- 선택 단위는 **카드가 아니라 카드 안의 불릿 항목**.
- 불릿 클릭 → 매핑된 HTML 페이지로 이동(사이드 메뉴 포함 전체 페이지로 보여도 무방) → 뒤로가기로 인덱스 복귀.
- 매핑·인벤토리는 `Control-Tower_불릿_페이지_매핑.xlsx`에 정의.

---

## 2. 아키텍처

```
[Next.js 인덱스]  src/components/shemak-index.tsx
   └ 불릿 = <a href="/{slug}.html?sec={코드}">   (일반 a 링크 → 뒤로가기 복귀 자동)
        ↓
[정적 HTML]  public/{slug}.html
   └ Next.js standalone이 /{slug}.html 로 정적 서빙 (docker 이미지에 public 포함)
   └ 각 HTML 끝에 진입 핸들러(<script data-secjump>) 삽입 → ?sec= 읽어 해당 상세 오픈
```

- 매핑 데이터: 엑셀 → `src/data/bullet-targets.ts` (생성 스크립트로만 수정).
- 배포: Next.js standalone Dockerfile (node:20-alpine, `npm run build`, 포트 3000). public이 이미지에 포함되어 별도 정적 서버 불필요.

### HTML slug 매핑

| slug | 원본 (`HTML/`) | 타입 |
|------|----------------|------|
| `optic-view` | `1. OpticView.html` | 카드형 (cn-card) |
| `ceo` | `2. CEO_Agent.html` | id 앵커 (난독화 JS) |
| `hr-function` | `3. HR팀_Agent.html` | id 앵커 + 탭 |
| `hr-member` | `4. 실장_팀장_팀원 Agent.html` | id 앵커 (사람 선택 UI) |
| `pan-m0` | `M0_대시보드_mockup_masked.html` | JS 대시보드 (setLevel) |
| `pan-m1` | `M1_대시보드_mockup_masked.html` | JS 대시보드 |
| `pan-m2` | `M2_근무추정시간_대시보드_masked.html` | 단일 뷰 (PAN-020) |
| `pan-m3` | `M3_Skill_대시보드_26_masked.html` | JS 대시보드 (탭) |
| `pan-m4` | `M4_v2_dashboard.html` | JS 대시보드 (updateDashId) |

---

## 3. 코드 체계 (PAN/OPT/CEO/HRF/AG)

- 섹션 코드 형식: `PAN-001-20260522` 처럼 **`{prefix}-{날짜}`**. **뒤 날짜는 최종 수정일**이라 매칭에 사용하지 않고, 앞 prefix(`PAN-001`)만 사용.
- **PAN 넘버링**: 십의 자리가 모듈. M0=`PAN-00x`, M1=`PAN-01x`, M2=`PAN-02x`, M3=`PAN-03x`, M4=`PAN-04x`.
- 코드 매칭은 항상 날짜 접미사를 제거한 prefix 기준.

---

## 4. 산출물 HTML 구조 — 타입별 (진입 방식이 제각각)

핵심 난점: **9개 HTML이 서로 다른 SPA 구조**이고, 대부분 "URL로 특정 뷰/상세 열기"를 처음부터 지원하지 않게 만들어져 있음.

### (A) optic-view — 동적 카드 변환형
- JS가 원본 섹션(`<h3 class="sec-title" id="OPT-xxx">` + 콘텐츠)을 읽어 **카드(`cn-card`)로 변환**하고, **원본 h3(id 포함)는 DOM에서 제거**한다.
  ```js
  sections.forEach(s=>{ s.nodes.forEach(n=>host.appendChild(n));  // 콘텐츠를 host로 이동
    var card=...; card.addEventListener('click',()=>cnOpen(s.title,host,card)); });
  // h3 헤더 제거
  ```
- 결과: `getElementById('OPT-005-...')`는 **null** (앵커 점프 불가). 코드는 카드 텍스트로만 남음.
- **진입법**: 텍스트에 코드가 든 `.cn-card`를 찾아 `click()` → `cnOpen()`이 상세를 연다. (= "한 단계 더 들어가기")
- 신규 섹션(OPT-201~210)만 실제 id 앵커가 살아있음.

### (B) ceo / hr-function / hr-member — id 앵커 생존형
- 카드 변환 없이 `id="CEO-201-..."` 등 **앵커가 DOM에 살아있음** → `scrollIntoView`로 점프.
- ceo는 JS가 난독화(minified)되어 있음. hr-function은 `switchTab`(탭) 보유. hr-member는 사람 선택 UI(`loadMember` 등).

### (C) 대시보드 M0~M4 — JS 동적 + IIFE 캡슐화형
- 섹션 코드가 앵커가 아니라 **`DASH_CODE` 객체(뷰 키 ↔ PAN코드)**로 관리되고, 뷰 전환 함수가 대시보드마다 다름:
  - M0: `setLevel(level)` (`overview/hqs/offices/teams/persons/tasks` 만 render 지원; process/data/simulation 미지원)
  - M4: `updateDashId(id)` + 키 `s1/s3/...`
  - M1: 키 `전사/본부/실/팀...` (setLevel 없음)
  - M3: 탭 `M3-1/M3-6/BFM`(iframe srcdoc)/`M3-DEV`
  - M2: 단일 뷰(PAN-020), 점프 불필요
- **전환 함수·DASH_CODE가 IIFE 스코프에 갇혀** 외부(독립 `<script>`) 핸들러에서 접근 불가. `?embed=1`(사이드바 숨김)만 URL을 읽음.

---

## 5. 진입 핸들러 (`data-secjump`)

각 public HTML 끝(`</body>` 앞)에 독립 `<script>`로 삽입. `?sec=코드`(또는 `#코드`)를 읽어 아래 순서로 시도:

1. **전역 `DASH_CODE` + `setLevel`** → prefix 역매핑으로 뷰 전환 (대시보드용; IIFE면 실패)
2. **살아있는 id 앵커** → `closest('.tab-content')`로 부모 탭 `switchTab` + `scrollIntoView`
3. **텍스트에 코드가 든 클릭가능 요소**(`.cn-card,[onclick],.card,.dcard,button`) → `click()`

- 코드 매칭은 날짜 제거 prefix(`norm()`).
- 카드/뷰가 비동기 렌더되므로 `tryJump(n)`으로 재시도, `load`/`hashchange`에 바인딩.

---

## 6. 현재 상태 (2026-05-28)

| 대상 | 상태 |
|------|------|
| 1단계: 불릿 → HTML 열기 + 뒤로가기 복귀 | ✅ 배포됨 |
| optic-view `?sec=` → 카드 상세 자동 열기 | ✅ 동작 |
| ceo / hr-function / hr-member `?sec=` → id 앵커 점프 | ✅ 동작 |
| 대시보드 M0~M4 `?sec=` → 특정 뷰 점프 | ⚠️ **미완** (IIFE 캡슐화) |

### 대시보드 잔여 작업
전환 함수·`DASH_CODE`가 IIFE에 갇혀 있어, 다음 중 하나가 필요:
- IIFE 내부(함수 정의 직후)에 `window.setLevel = setLevel; window.DASH_CODE = DASH_CODE;` 노출 추가 → 범용 핸들러가 `window.*`로 접근, 또는
- 각 대시보드 초기화 코드에 URL 파싱을 직접 삽입.
- 대시보드마다 전환 함수가 다르므로(M0 setLevel, M4 updateDashId, M1/M3 별도) 개별 대응 필요. M2는 단일 뷰라 페이지 열기로 충분.

> 참고: M0에서 IIFE **끝**에 핸들러를 넣었을 때 콘솔 에러 없이 미실행되는 현상이 있었음(원인 미규명). 함수 정의 직후 삽입 또는 window 노출 방식 권장.

---

## 7. 재생성 / 유지보수

- **`bullet-targets.ts` 재생성**: `Control-Tower_불릿_페이지_매핑.xlsx`를 읽어 `(rowId|colId|bulletIndex) → {file, anchor}` 생성. 정적문서는 HTML 스캔으로 실제 id를, 대시보드는 PAN prefix를 anchor로. (엑셀↔data.ts는 행/열/불릿 순서가 1:1 일치. 단 키 이름은 엑셀 `grade/perf/comp/talent` ↔ data `promotion/performance/compensation/development`.)
- **public HTML 핸들러**: `HTML/`(또는 `~/Downloads/3. 세아용_최종`) 최신본으로 재복사하면 핸들러가 사라지므로 재삽입 필요. **빌드 시 자동 주입 스크립트로 만드는 것을 권장**(현재는 수동 삽입).
- **배포**: 커밋/푸시 → Ubuntu `/opt/ShemakIndex`(root 소유)에서 `sudo git pull origin main && sudo docker compose up -d --build`. 도메인/SSL은 맥미니 Caddy가 처리(Ubuntu엔 nginx/certbot 없음). 도메인 `shemak-index.insightgroup.biz` → `:3100`.
