export type CellData = {
  title: string;
  description: string;
  active: boolean;
  href?: string;
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
  description: string;
  gradientColor: string;
  accentBorder: string;
  iconBg: string;
  cardBg: string;
  rows: RowData[];
};

export type ColumnData = {
  id: string;
  label: string;
  subLabel: string;
};

export const COLUMNS: ColumnData[] = [
  { id: "orgOps", label: "조직운영", subLabel: "조직구조 · 프로세스" },
  { id: "promotion", label: "직급/승진", subLabel: "직급 · 승급 · 승진" },
  { id: "performance", label: "성과관리", subLabel: "개인기준 · 개인관리" },
  { id: "compensation", label: "보상", subLabel: "기본급 · 성과급 · 복리후생" },
  { id: "development", label: "확보/개발", subLabel: "채용 · 경력개발" },
  { id: "orgDev", label: "조직개발", subLabel: "조직문화 · 조직학습" },
];

export const SECTIONS: SectionData[] = [
  {
    id: "optic",
    label: "Optic",
    description: "의식 예측 -- 조직원 의식 데이터 기반 예측 분석",
    gradientColor: "#8b5cf6",
    accentBorder: "border-l-violet-500",
    iconBg: "from-violet-500 to-purple-600",
    cardBg: "from-violet-50/60 to-white",
    rows: [
      {
        id: "optic",
        code: "Optic",
        label: "의식 예측",
        cells: {
          orgOps: {
            title: "몰입 패턴 분석",
            description: "조직별 몰입도 균열 탐지 및 재설계 영역 도출",
            active: true,
          },
          promotion: {
            title: "승진 이탈 예측",
            description: "승진자 응답 패턴 기반 이탈 리스크 사전 탐지",
            active: true,
          },
          performance: {
            title: "고성과자 이탈 경고",
            description: "이탈 위험 고성과자 식별 및 평가 신뢰도 분석",
            active: true,
          },
          compensation: {
            title: "보상 공정성 인식",
            description: "보상 만족도와 공정성 인식 패턴 분석",
            active: true,
          },
          development: {
            title: "성장 의식 탐색",
            description: "자기계발 투자 의향 및 CDP 교육 우수 추천",
            active: false,
          },
          orgDev: {
            title: "리더십 영향도",
            description: "리더십이 조직문화에 미치는 영향 진단",
            active: true,
          },
        },
      },
    ],
  },
  {
    id: "pan",
    label: "Pan",
    description: "인력 분석 -- M0~M4 모듈 기반 인력 수급 분석 체계",
    gradientColor: "#3b82f6",
    accentBorder: "border-l-blue-500",
    iconBg: "from-blue-500 to-cyan-600",
    cardBg: "from-blue-50/60 to-white",
    rows: [
      {
        id: "m0",
        code: "M0",
        label: "적정 인력 예측",
        cells: {
          orgOps: {
            title: "통합 인력 수급",
            description: "M1~4 분석 결과 통합 및 전사 인력 forecasting",
            active: true,
          },
          promotion: {
            title: "승급 파이프라인",
            description: "Skill 기반 직급·직무등급 연계 역량 배분 예측",
            active: true,
          },
          performance: {
            title: "KPI 시뮬레이션",
            description: "업무 변화별 KPI 기준 성과관리 시뮬레이션",
            active: true,
          },
          compensation: {
            title: "보상 시나리오",
            description: "수급 시나리오별 보상 모델 및 급여 관리",
            active: false,
          },
          development: {
            title: "인재 수급 연계",
            description: "통합 인력수급과 보상·확보 인재 연계 분석",
            active: true,
          },
          orgDev: {
            title: "HR 통합 리포트",
            description: "HR 영역별 Norm 관리 및 진단 리포트",
            active: false,
          },
        },
      },
      {
        id: "m1",
        code: "M1",
        label: "거시 법인",
        cells: {
          orgOps: {
            title: "거시 인력 분석",
            description: "조세별 인력 분석 및 시나리오별 TO 최적화",
            active: true,
          },
          promotion: {
            title: "직급 분포 분석",
            description: "직급분포 및 진급 대상 직무등급 분석",
            active: true,
          },
          performance: {
            title: "업무 부하 보정",
            description: "적정 인원 모델 기반 업무 부하 보정",
            active: true,
          },
          compensation: {
            title: "보상 수준 분석",
            description: "보상 수준 시나리오 시뮬레이션",
            active: true,
          },
          development: {
            title: "인력 배치 분석",
            description: "본부 인력 배치 및 인력 변동 흡수 분석",
            active: true,
          },
          orgDev: {
            title: "본부 인력 재배치",
            description: "본부별 인력 등급 조정 및 재배치 계획",
            active: false,
          },
        },
      },
      {
        id: "m2",
        code: "M2",
        label: "인력 규모 적정성",
        cells: {
          orgOps: {
            title: "실질 근무량 분석",
            description: "조직별 실질근무량 추정 및 업무 부담 분석",
            active: true,
          },
          promotion: {
            title: "적정 인원 산출",
            description: "근무 추정 기반 업무 부담 적정 인원 진단",
            active: true,
          },
          performance: {
            title: "가용 수준 진단",
            description: "업무 부하 보정 및 적정 가용 수준 분석",
            active: true,
          },
          compensation: {
            title: "근무시간 보상 연계",
            description: "실질 근무시간 반영 보상 적절성 분석",
            active: true,
          },
          development: {
            title: "여유/과부족 분석",
            description: "부서별 인력 여유·과부족 및 JD 예측 활용",
            active: true,
          },
          orgDev: {
            title: "조직 재설계 근거",
            description: "조직 진단 기반 재설계 근거 도출",
            active: false,
          },
        },
      },
      {
        id: "m3",
        code: "M3",
        label: "직무 Skill",
        cells: {
          orgOps: {
            title: "Skill 자산 분석",
            description: "조직 개편시 Skill 자산 보유 예측 및 직무 스캔",
            active: true,
          },
          promotion: {
            title: "상위직급 Fit 검증",
            description: "직무 유사도 Fit 사전 검증 및 CDP 연계",
            active: true,
          },
          performance: {
            title: "Skill 기반 KPI",
            description: "직무 필요 Skill과 KPI 등급 연계 분석",
            active: true,
          },
          compensation: {
            title: "Skill 보상 반영",
            description: "KPI 등급 분석 기반 Skill 보상 설계",
            active: false,
          },
          development: {
            title: "Skill 보유 현황",
            description: "Skill 보유 현황 및 인재 CDP·경력 연계",
            active: false,
          },
          orgDev: {
            title: "직무 인증 설계",
            description: "직무 인증 체계 및 미래 역량 설계",
            active: false,
          },
        },
      },
      {
        id: "m4",
        code: "M4",
        label: "직무 법규",
        cells: {
          orgOps: {
            title: "슬림화 후보 분석",
            description: "슬림화 후보 영역 및 자격 요건 재설정",
            active: true,
          },
          promotion: {
            title: "직무등급 자동화",
            description: "직무 등급 자동 결정 및 직급 연계",
            active: true,
          },
          performance: {
            title: "가치/지식 반영",
            description: "가치·지식 기반 평가 재설정 활용",
            active: false,
          },
          compensation: {
            title: "Pay Band 설계",
            description: "직무 등급별 Pay Band 및 보상 반영",
            active: false,
          },
          development: {
            title: "미래 역량 구조",
            description: "고차기 직무 설계 및 미래 역량 도출",
            active: false,
          },
          orgDev: {
            title: "미래 CDP 설계",
            description: "직무 인증·학습 기반 미래 CDP 설계",
            active: false,
          },
        },
      },
    ],
  },
  {
    id: "agents",
    label: "HR Agents",
    description: "역할별 AI 에이전트 -- 직책별 맞춤 분석 및 의사결정 지원",
    gradientColor: "#10b981",
    accentBorder: "border-l-emerald-500",
    iconBg: "from-emerald-500 to-teal-600",
    cardBg: "from-emerald-50/60 to-white",
    rows: [
      {
        id: "agent-exec",
        code: "경영진",
        label: "Executive Agent",
        cells: {
          orgOps: {
            title: "조직 역량 진단",
            description: "전사 프로세스 진단 및 자동순위 분석",
            active: true,
          },
          promotion: {
            title: "임원 승진 후보",
            description: "파이프라인 사전 분석 및 승진 후보 도출",
            active: true,
          },
          performance: {
            title: "전사 KPI 현황",
            description: "전사 KPI 달성 현황 및 조정 필요 인원 분석",
            active: true,
          },
          compensation: {
            title: "경영진 보상 구조",
            description: "보상 수준 비교 및 인건비 시나리오 분석",
            active: false,
          },
          development: {
            title: "Skill 자산 기반",
            description: "핵심 인재 확보 전략 및 리더 Skill 진단",
            active: true,
          },
          orgDev: {
            title: "조직 트랜드 분석",
            description: "조직별 트랜드 분석 및 전체 가치 평가",
            active: true,
          },
        },
      },
      {
        id: "agent-hr",
        code: "HR팀",
        label: "HR Team Agent",
        cells: {
          orgOps: {
            title: "업무 배분 적정성",
            description: "조직별 업무 배분 및 R&R 적정성 분석",
            active: true,
          },
          promotion: {
            title: "직무등급 Norm",
            description: "직무등급 분포 Norm 비교 및 후보 Pool 관리",
            active: true,
          },
          performance: {
            title: "성과 등급 분석",
            description: "전사 KPI 달성 현황 및 성과 등급 분포 분석",
            active: true,
          },
          compensation: {
            title: "Pay Band 비교",
            description: "시장 Pay Band 비교 및 차등 인건비 설계",
            active: false,
          },
          development: {
            title: "Skill Gap 교육",
            description: "Skill Gap 교육 프로그램 및 적정 소요 인력",
            active: true,
          },
          orgDev: {
            title: "리더십 개발",
            description: "리더십 개발 트랜드 및 조직 조합 최적화",
            active: true,
          },
        },
      },
      {
        id: "agent-manager",
        code: "팀장",
        label: "Manager Agent",
        cells: {
          orgOps: {
            title: "팀 조직 관리",
            description: "직근 부하 R&R 조정 및 팀 업무 배분 분석",
            active: true,
          },
          promotion: {
            title: "팀원 승진 관리",
            description: "다직원 승진 진행도 및 1on1 피드백 분석",
            active: true,
          },
          performance: {
            title: "팀 KPI 추적",
            description: "팀 KPI 추적, 1on1 진행 및 종합 평가 지원",
            active: true,
          },
          compensation: {
            title: "Confidential",
            description: "팀장 보상 정보는 비공개 처리",
            active: false,
          },
          development: {
            title: "채용 Skill 매칭",
            description: "채용 요구 Skill 수급 매칭 및 성장 과제",
            active: true,
          },
          orgDev: {
            title: "팀원 역량 진단",
            description: "팀원 역량 진단 및 반복 교육 추천",
            active: false,
          },
        },
      },
      {
        id: "agent-member",
        code: "팀원",
        label: "Member Agent",
        cells: {
          orgOps: {
            title: "직무기술서 검증",
            description: "직무기술서 검증 및 인수 조직 매뉴얼화",
            active: true,
          },
          promotion: {
            title: "본인 승급 관리",
            description: "본인 승급 추천 건 및 Skill 수급 분석",
            active: true,
          },
          performance: {
            title: "개인 KPI 관리",
            description: "본인 KPI 업무 분석 및 실적 데이터 추적",
            active: true,
          },
          compensation: {
            title: "Confidential",
            description: "팀원 보상 정보는 비공개 처리",
            active: false,
          },
          development: {
            title: "Skill Gap 학습",
            description: "본인 Skill Gap 학습 매칭 및 자기계발",
            active: true,
          },
          orgDev: {
            title: "자기 진단",
            description: "360도 건강 진단 및 자기 개선 계획",
            active: false,
          },
        },
      },
      {
        id: "agent-org",
        code: "조직",
        label: "Organization Agent",
        cells: {
          orgOps: {
            title: "조직 재설계",
            description: "시점별 조직 재설계 및 적정 TO 최적화",
            active: true,
          },
          promotion: {
            title: "직급 체제 유연화",
            description: "유연한 직급 체제 변화 시뮬레이션",
            active: true,
          },
          performance: {
            title: "성과 정합성",
            description: "유연한 목표·인센 성과 평가 정합성 검증",
            active: true,
          },
          compensation: {
            title: "조직 보상 분석",
            description: "Pay Band 구간 분석 및 조직 리포트",
            active: false,
          },
          development: {
            title: "미래 인재 Pool",
            description: "전 직원 인재 도출 및 미래 인재 Pool 구축",
            active: false,
          },
          orgDev: {
            title: "학습 문화 설계",
            description: "조직 학습 문화 및 인재관리 선순환",
            active: false,
          },
        },
      },
    ],
  },
];
