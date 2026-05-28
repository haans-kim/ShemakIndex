export type CellData = {
  bullets: string[];
  active: boolean;
};

export type RowData = {
  id: string;
  code: string;
  label: string;
  cells: Record<string, CellData>;
};

export type SectionData = {
  id: string;
  label: string;
  rows: RowData[];
};

export type ColumnData = {
  id: string;
  label: string;
  subLabel: string;
};

export const COLUMNS: ColumnData[] = [
  { id: "orgOps", label: "조직운영", subLabel: "조직구조 · 업무재설계" },
  { id: "promotion", label: "직급/승진", subLabel: "직급 · 직무등급 · 승진률 · 승진제도" },
  { id: "performance", label: "성과관리", subLabel: "조직성과 · 개인성과" },
  { id: "compensation", label: "보상", subLabel: "보상전략 · 기본급 · 성과급 · 복리후생" },
  { id: "development", label: "확보/개발", subLabel: "채용 · 온보딩 · 경력개발 · 핵심인재" },
  { id: "orgDev", label: "조직개발", subLabel: "리더십 · 조직문화 · 소통 · 변화관리" },
];

export const SECTIONS: SectionData[] = [
  {
    id: "optic",
    label: "의식 예측 (Optic View)",
    rows: [
      {
        id: "optic",
        code: "패턴/예측/시뮬레이션",
        label: "",
        cells: {
          orgOps: { bullets: ["실·팀별 6대 영역 긍정률 진단", "4몰입유형(고몰입·일반·조용한사직·저몰입) 분포"], active: true },
          promotion: { bullets: ["직급 × 6대 영역 평균 분석", "직급별 부정률 상위 문항 추출"], active: true },
          performance: { bullets: ["평가·성과 영역 긍정률 진단", "35문항 평가 관련 부정률 Top"], active: true },
          compensation: { bullets: ["보상 영역 긍정률 진단", "직급·실별 보상 인식 격차"], active: true },
          development: { bullets: ["확보·개발 영역 긍정률 진단", "교육·커리어 부정률 진단"], active: true },
          orgDev: { bullets: ["조직개발·리더십 영역 진단", "SHAP What-If 시뮬레이터", "주관식·심층인터뷰 인사이트 추출"], active: true },
        },
      },
    ],
  },
  {
    id: "agents",
    label: "HR Agent",
    rows: [
      {
        id: "agents-1",
        code: "경영진",
        label: "CEO/임원",
        cells: {
          orgOps: { bullets: ["본부장 KPI 매트릭스"], active: true },
          promotion: { bullets: ["임원·직책자 등급 모니터링"], active: true },
          performance: { bullets: ["본부별 목표 달성률·이슈"], active: true },
          compensation: { bullets: ["이사회 보상 안건 input"], active: true },
          development: { bullets: ["핵심인재·승계 후보 풀 모니터링"], active: true },
          orgDev: { bullets: ["리더십·조직문화 신호 감지"], active: false },
        },
      },
      {
        id: "agents-2",
        code: "HR팀",
        label: "HR Function",
        cells: {
          orgOps: { bullets: ["직제 변경·조직개편 시뮬"], active: true },
          promotion: { bullets: ["직무등급 운영·페이밴드 매핑"], active: true },
          performance: { bullets: ["평가 결과 분포·이슈 추적"], active: true },
          compensation: { bullets: ["연봉 시뮬·총인건비 예측"], active: false },
          development: { bullets: ["CDP·핵심인재 풀 관리"], active: true },
          orgDev: { bullets: ["조직문화·EOS 액션 운영"], active: true },
        },
      },
      {
        id: "agents-3",
        code: "실장 · 팀장 · 팀원",
        label: "",
        cells: {
          orgOps: { bullets: ["본인·팀원 업무 부하 시각화"], active: true },
          promotion: { bullets: ["본인·팀원 직무등급·승진 가능성"], active: true },
          performance: { bullets: ["팀 성과·MBO 진척 트래킹"], active: false },
          compensation: { bullets: ["직무급 시뮬 (본인 직무 가치 기반)"], active: true },
          development: { bullets: ["본인 커리어 패스·필요 스킬"], active: true },
          orgDev: { bullets: ["팀원 몰입도·소통 진단"], active: true },
        },
      },
    ],
  },
  {
    id: "pan",
    label: "인력규모·조직역량 (Pan HR)",
    rows: [
      {
        id: "m0",
        code: "M0",
        label: "적정인력예측",
        cells: {
          orgOps: { bullets: ["본부·실·팀·개인 적정인력 예측", "인력 시뮬레이션 (시점별·동인별)"], active: true },
          promotion: { bullets: ["등급 피라미드 적정성 진단"], active: true },
          performance: { bullets: ["인당 생산성 모니터링"], active: true },
          compensation: { bullets: ["인건비 시뮬 (정원 × 페이밴드)"], active: true },
          development: { bullets: ["채용 계획·정원 갭 충원 시나리오"], active: true },
          orgDev: { bullets: ["조직 재설계 시 인력 재배치 시뮬"], active: true },
        },
      },
      {
        id: "m1",
        code: "M1",
        label: "거시인력동인",
        cells: {
          orgOps: { bullets: ["거시 인력동인 회귀", "본부·실별 동인 → 인력 영향"], active: true },
          promotion: { bullets: ["직무등급별 동인 변화 영향"], active: true },
          performance: { bullets: ["동인 변화 → 성과 시뮬"], active: true },
          compensation: { bullets: ["동인-인건비 회귀 (예산 시뮬)"], active: true },
          development: { bullets: ["신사업·신직무 채용 수요 예측"], active: true },
          orgDev: { bullets: ["조직 변화 시 동인 시뮬"], active: true },
        },
      },
      {
        id: "m2",
        code: "M2",
        label: "근무적정성",
        cells: {
          orgOps: { bullets: ["팀별 근무 적정성·과부하 R/Y/G", "실측 근무 시간·체류·태그 분석"], active: true },
          promotion: { bullets: ["직급별 근무 부하 분포"], active: true },
          performance: { bullets: ["과부하 vs 성과 상관 진단"], active: true },
          compensation: { bullets: ["초과근무 보상 실측 vs 정책"], active: true },
          development: { bullets: ["과부하 부서 충원 우선순위"], active: true },
          orgDev: { bullets: ["부하 원인 진단 (R&R·소통·리더십)"], active: true },
        },
      },
      {
        id: "m3",
        code: "M3",
        label: "직무 Skill",
        cells: {
          orgOps: { bullets: ["부서별 스킬 보유 매트릭스", "조직별 스킬 갭 진단"], active: true },
          promotion: { bullets: ["직무등급 input (RSM·PSM gap)", "직무별 요구·보유 스킬 평가"], active: true },
          performance: { bullets: ["핵심 스킬 보유자 식별"], active: true },
          compensation: { bullets: ["스킬 기반 직무급 input"], active: true },
          development: { bullets: ["직무순환·재배치 추천 (스킬 fit)", "Skill 개발 시뮬·CDP 매트릭스"], active: true },
          orgDev: { bullets: ["BFM 역량 히트맵", "조직 역량 격차 진단"], active: true },
        },
      },
      {
        id: "m4",
        code: "M4",
        label: "직무업무가치",
        cells: {
          orgOps: { bullets: ["직무·업무 가치 매핑", "자동화·외주 후보 식별 (Support 사분면)"], active: true },
          promotion: { bullets: ["직무 가치 → Grade 1~8 산출", "AI 기반 직무평가 15차원"], active: true },
          performance: { bullets: ["업무 가치 4사분면", "Task 단위 가치 평가"], active: true },
          compensation: { bullets: ["직무등급-보상 input (직무급)"], active: true },
          development: { bullets: ["핵심 직무 식별·인재 풀 우선순위"], active: true },
          orgDev: { bullets: ["직급 × 직무레벨 정합성 진단", "조직 가치 분포·고가치 직무 보호"], active: true },
        },
      },
    ],
  },
];
