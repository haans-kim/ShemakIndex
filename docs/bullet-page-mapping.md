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
| 대시보드 **M0 / M1 / M4** `?sec=` → 특정 뷰 점프 | ✅ 동작 (window 노출 방식) |
| 대시보드 **M3** `?sec=` → 특정 모듈 점프 | ⚠️ M3-1만 (페이지 열기). M3-6/BFM/M3-DEV는 잔여 |
| 대시보드 **M2** | 단일 뷰 → 페이지 열기로 충분 |

### 대시보드 점프 해결 방식 (M0/M1/M4)
IIFE에 갇힌 전환 함수를 **함수 정의가 끝난 직후(또는 `DASH_CODE` 정의 직후)에 `window.__setView`로 노출**하고, 핸들러가 그걸 호출:
```js
// 각 대시보드 (DASH_CODE 정의 직후 삽입)
window.__DASH_CODE = DASH_CODE;
window.__setView = function(k){ try{ <전환함수>(k); }catch(e){} };
// M0: setLevel(k) / M1: setLv(k) / M4: show(k) / M3: setModule(k)
```
핸들러(v3)는 `DASH_CODE`가 있으면 **전환함수만(①) 사용**하고 카드 클릭(③)은 건너뛴다 (코드 텍스트가 든 엉뚱한 카드를 클릭하는 간섭 차단).

### M0 잔여
`setLevel`이 지원하는 뷰는 6개(overview/hqs/offices/teams/persons/tasks)뿐. **process/data/simulation(PAN-007/008/009)은 render 분기가 없어** 점프해도 콘텐츠가 안 나옴 → HTML 측 render 지원 필요.

### M3 잔여 (미해결)
M3는 초기화 로직이 여러 겹(setModule 가드 + `state.txModule`↔`state.module` 동기화 + init 강제)이라, `window.__setView` 호출·지연 재설정·`state` 초기화 주입을 모두 시도했으나 **초기화가 계속 M3-1로 덮어씀**. 직접 `window.__setView('M3-6')`를 (로드 완료 후) 호출하면 정상 동작하므로, **init에서 모듈을 강제하는 정확한 지점을 찾아 거기서 `?sec=`를 반영**해야 함. 현재는 M3-1(기본 화면)로 페이지 열기.

> 참고: M0에서 IIFE **끝**에 핸들러를 넣었을 때 콘솔 에러 없이 미실행되는 현상이 있었음 → window 노출 방식으로 우회 해결.

---

## 7. 재생성 / 유지보수

- **`bullet-targets.ts` 재생성**: `Control-Tower_불릿_페이지_매핑.xlsx`를 읽어 `(rowId|colId|bulletIndex) → {file, anchor}` 생성. 정적문서는 HTML 스캔으로 실제 id를, 대시보드는 PAN prefix를 anchor로. (엑셀↔data.ts는 행/열/불릿 순서가 1:1 일치. 단 키 이름은 엑셀 `grade/perf/comp/talent` ↔ data `promotion/performance/compensation/development`.)
- **public HTML 핸들러**: `HTML/`(또는 `~/Downloads/3. 세아용_최종`) 최신본으로 재복사하면 핸들러가 사라지므로 재삽입 필요. **빌드 시 자동 주입 스크립트로 만드는 것을 권장**(현재는 수동 삽입).
- **배포**: 커밋/푸시 → Ubuntu `/opt/ShemakIndex`(root 소유)에서 `sudo git pull origin main && sudo docker compose up -d --build`. 도메인/SSL은 맥미니 Caddy가 처리(Ubuntu엔 nginx/certbot 없음). 도메인 `shemak-index.insightgroup.biz` → `:3100`.

---

## 8. 2026-05-29 세션 수정 이력 (핸들러 정본화 + 매핑 수정)

> 이 섹션은 **다른 세션이 이어받을 때**를 위한 인수인계 기록. 위 5·6장(2026-05-28 시점)의 일부 내용은 아래로 갱신됨.
> 관련 커밋: `c6cbd54`(M4·optic SHAP) · `3a34643`(secjump 정본 9파일) · `78a1377`(agents-3 ?view=).

### 8.1 secjump 진입 핸들러 정본화 — §5 핸들러를 전면 교체

**발견한 근본 버그(중요):** 일부 페이지(특히 `ceo`)는 로드 시 자기 해시(`#/main/overview`)를 설정하는데, 기존 `getSec()`가 **`location.hash`를 `?sec=`보다 먼저** 읽어 엉뚱한 값으로 점프 실패. → ceo 전 섹션이 "맨 위 다른 섹션"만 보이던 증상의 원인. (스크롤 타이밍 문제로 오해하기 쉬움. `window.scrollY`가 끝까지 0이면 스크롤이 아니라 **잘못된 sec를 읽은 것**을 의심할 것.)

**9개 public HTML 전부 동일한 정본 핸들러로 교체.** 핵심 동작:
- `?sec=`를 `location.hash`보다 **우선** 읽음.
- 읽은 직후 `history.replaceState`로 **`?sec=` 제거**(1회성 — 앱 내부 해시 네비게이션과 충돌·재점프 fighting 방지). `hashchange` 리스너 제거.
- `done` 플래그로 1회만 점프.
- 스크롤은 `ResizeObserver`(body 크기 변동=차트 늦은 렌더 시 재정렬) + 250ms×12 안전 인터벌 후 정리. **사용자 스크롤은 안 건드림**(ResizeObserver는 레이아웃 변동에만 반응).
- DASH_CODE 분기(M0/M1/M3/M4 뷰 전환)는 §5와 동일하게 보존.

### 8.2 M4 매핑 swap + PAN-140 슬라이드화 (`pan-m4.html`)
- `DASH_CODE`의 **s3↔s6 PAN 코드가 뒤바뀌어** 있었음 → promotion(PAN-041)·performance(PAN-042)가 서로 페이지로 이동. 정본(엑셀 `대시보드_섹션_인벤토리`)대로 s3=PAN-042, s6=PAN-041로 수정.
- PAN-140("직무등급-보상 input")은 `.x-ext-wrap`(앱 셸 바깥, height:100vh 밖)에 붙은 "준비 중" placeholder라, 점프 시 앱 전체가 화면 밖으로 밀려 깨졌음 → **정식 슬라이드 `s12`로 편입**(nav·DASH_CODE 등록), x-ext placeholder 제거.

### 8.3 optic 점프 안착 (`optic-view.html`)
- OPT-201~210은 `.x-ext-wrap`(content-area 내부스크롤 바깥, window 스크롤). 무거운 차트(2.3MB)가 늦게 렌더돼 단발 스크롤이 빗나가던 것 → 8.1 ResizeObserver 방식으로 해결.
- 마지막 섹션(OPT-210)이 문서 끝이라 top 정렬 불가 → `.x-ext-wrap{padding-bottom:80vh}` + `.x-page{scroll-margin-top:64px}`(sticky 헤더 52px 회피)로 맨 위 정착.
- OPT-201~209는 실제 콘텐츠, **OPT-210(SHAP What-If)만 "준비 중" placeholder**(콘텐츠 미구축, 라우팅은 정상).

### 8.4 agents-3 (hr-member, 실장·팀장·팀원) 역할 뷰 자동 선택 — `?view=`
- **구조 발견:** hr-member 역할 뷰는 `iframe`(`f-dir`/`f-tl`/`f-tm`)에 **base64 HTML을 `srcdoc`로 주입**(`DIRECTOR.leader`/`TEAMS[ti].leader`/`members[mi].b`). 그래서 정적 텍스트 검색에 콘텐츠가 안 잡힘 — **누락 아님, 다 있음.**
- **역할↔화면 매핑(코드 `lastPageIds`가 정본):** dir(실장)=AG-001 · tl(팀장)=AG-003 · tm(팀원)=AG-012. 신규 AG-201/202/203(perf/comp/orgDev)은 x-ext-wrap(역할 무관).
- 기존엔 promotion·development 불릿이 `anchor=null`이라 기본 실장 뷰로만 진입 → 역할 수동 전환 필요했음.
- **수정:** `BulletTarget`에 `view` 필드 추가(promotion=tl, development=tm) → `shemak-index.tsx`가 링크에 `?view=` 생성(`?sec=`와 병행) → hr-member에 `?view=` 읽어 `show(role)` 호출하는 init(`<script data-viewjump>`) 주입. orgOps(AG-001)는 기본 dir이라 변경 불필요.

### 8.5 갱신된 상태표

| 대상 | 점프 상태 (2026-05-29) |
|------|------------------------|
| optic-view (OPT-002/003/005, 201~210) | ✅ 정상 (OPT-210은 콘텐츠 "준비 중") |
| ceo (CEO-201~206) | ✅ 정상 (해시 클로버링 수정으로 해결) |
| hr-function (HRF-201~206) | ✅ 정상 |
| hr-member (AG-001/003/012=역할, AG-201/202/203=x-ext) | ✅ 정상 (`?view=` 연동) |
| M2 (PAN-020) | ✅ 단일 뷰 |
| M4 (PAN-040~047, 140) | ✅ 정상 (swap·슬라이드화 수정) |
| M3 (M3-1/M3-6/BFM/M3-DEV) | ✅ **정상** (`embed=1` 쿼리 보존 수정으로 해결) |
| M0 (작동 셀) | ✅ overview(orgOps)/persons(promotion) |
| M1 (작동 셀) | ✅ 전사/본부/실/팀/개인 |
| **M0/M1 (미구축 화면)** | ⚠️ 점프는 정상, **대상 화면 본체가 없음** (8.6 참고) |

### 8.6 매핑 안 된 화면 = 미구축 (직원 확인 / 신규 구축 필요)

> 2026-05-29 전수 점검(브라우저+grep) 결과, **불릿이 실제 구축된 화면에 도달 못 하는 셀**은 아래 4개 화면뿐. 모두 라우팅 문제가 아니라 **화면 본체 미구축**(원본 mockup에도 DASH_CODE에 번호만 있고 render·뷰 없음). hr-member처럼 iframe에 숨은 콘텐츠도 없음을 grep으로 확인.

| 화면번호 | 화면명(엑셀) | 모듈 | 영향 셀 | 상태 |
|---|---|---|---|---|
| **PAN-007** | process·채용 | M0 | development | ❌ 백지 |
| **PAN-008** | Data | M0 | compensation | ❌ 백지 |
| **PAN-009** | Simulation | M0 | orgOps(2)·orgDev | ❌ 백지 |
| **PAN-019** | 동인 트렌드 | M1 | orgDev | ❌ 백지 |
| PAN-006 | Tasks | M0 | performance | △ 뷰는 뜨나 인물 미선택 시 빈 목록 |

- **확정 미구축 = 4종**(M0 PAN-007/008/009, M1 PAN-019). 원본 `M0_대시보드_mockup_masked.html`·`M1_…`과 대조해도 동일(파일 복사 문제 아님). → 화면 신규 구축, 또는 불릿 `anchor=null`로 진입만, 중 택일 필요.
- **참고(반대 방향, 고아 화면):** 엑셀 인벤토리엔 있으나 불릿이 안 가리키는 화면도 존재 — M4 PAN-043(Grade 산포)·044(Grade×BFM), 실장팀장팀원 AG-002·004~011 등. "매핑 안 됨"과 별개로 검토 대상.

#### M3 해결 기록 (구 §6·8.6 미해결 → 2026-05-29 해결)
- **진짜 원인:** pan-m3.html `<head>` 최상단의 `history.replaceState(null,"","?embed=1")`가 로드 즉시 URL을 `?embed=1`로 덮어써 **`?sec=`를 삭제** → secjump가 빈 값을 읽고 종료 → 모든 점프가 기본 M3-1로. (init override가 아니라 쿼리 클로버링이었음.)
- **수정:** head 재작성을 기존 쿼리 보존(`URLSearchParams`로 `embed=1`만 추가)으로 변경 + `__setView`에 init 대비 재적용(drift 가드, 2.5s) 추가. PAN-030/031/032/033 전부 배지 일치 검증.

### 8.7 향후 세션 주의사항 (gotcha)

- **인덱스(TS) 변경은 Next.js rebuild 필요.** 지금까지의 HTML 수정은 `public/` 정적 파일이라 새로고침/파일복사로 반영됐지만, `shemak-index.tsx`·`bullet-targets.ts` 변경(예: `?view=`)은 **dev에선 `Cmd+Shift+R` 강력 새로고침**, **배포본은 `--build` 재빌드**가 있어야 반영됨. "링크 클릭해도 안 바뀐다"의 99%는 이것.
- **점프 안 됨 디버깅:** `window.scrollY`가 0 그대로면 스크롤 타이밍이 아니라 **secjump가 잘못된 값을 읽은 것**(해시 클로버링 등)을 먼저 의심. `el.scrollIntoView()`를 콘솔에서 수동 호출해 되면 핸들러 입력 문제.
- **hr-member 콘텐츠는 base64 iframe srcdoc** — 정적 grep으로 "커리어/직무등급" 검색하면 0건이지만 실제론 있음. `lastPageIds`로 역할↔AG 매핑 확인.
- **PAN-140류 placeholder:** `.x-ext-wrap`은 height:100vh 앱 셸 바깥이라 슬라이드형 SPA(M4)에선 점프 시 레이아웃이 깨짐 → 정식 슬라이드로 편입해야 함. 스크롤형 페이지(optic/ceo)에선 padding-bottom+scroll-margin-top으로 top 정착.
- **`?sec=`는 점프 후 URL에서 제거됨**(정본 핸들러) — 의도된 동작. `?view=`는 유지(앱 해시와 무관).
- **head의 URL 강제 재작성 주의(M3 사례):** 일부 페이지가 `<head>` 최상단에서 `history.replaceState(...,"?embed=1")`로 URL을 덮어써 `?sec=`를 삭제함. 이러면 모든 점프가 기본 화면으로만 보임. **secjump가 잘못 동작하면 `<head>`의 replaceState/location 재작성부터 grep**할 것. 재작성은 반드시 기존 쿼리를 보존해야 함(`URLSearchParams`로 키만 추가).
- **미구축 화면 판별:** 점프 후 백지면 그 화면번호(PAN-xxx)가 DASH_CODE엔 있어도 render 분기·뷰가 없는 것. 원본 mockup(`~/Downloads/3. 세아용_최종/5. Pan HR/...`)과 grep 대조로 "복사 누락 vs 원래 미구축" 구분. M0 process/data/simulation·M1 trend = 원래 미구축 확정.
- **headless browse(gstack)는 무거운 페이지(2~5MB)에서 불안정** — 뷰포트 스크린샷이 백지로 나오거나 세션 재시작됨. 위치 검증은 `js`로 `getBoundingClientRect().top` 측정이 더 신뢰성 높음.
