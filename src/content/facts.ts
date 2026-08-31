/**
 * 담이농장 사실 콘텐츠 — 단일 소스(Single Source of Truth).
 * 모든 카피는 이 파일을 통해 렌더링한다. 문구 수정 시 docs/CONTENT.md도 함께 갱신할 것.
 * verified: true  = 공개 웹 검색으로 독립 교차 확인된 사실
 * verified: false = 의뢰 브리프 제공 정보이나 공개 검색으로 미확인 (허위 근거는 없음, 원본 자료 확보 후 재확인 권장)
 */

export const brand = {
  name: "담이농장",
  nameEn: "Dami Farm",
  founder: "강여상",
  region: "전라남도 무안",
  address: "전라남도 무안군 현경면 석북길 91-2",
  coreProduct: "무안 고구마",
  tagline: "황토가 키우고, 농부가 지킨 무안의 맛.",
  subTagline: "2012년부터 이어온 유기농 고구마, 강여상 농부의 담이농장",
} as const;

export interface FactStat {
  value: string;
  label: string;
  verified: boolean;
}

export const trustStats: FactStat[] = [
  { value: "2012", label: "유기농 첫 인증", verified: true },
  { value: "18년", label: "2대째 이어온 전업농", verified: true },
  { value: "15100525", label: "유기농산물 인증번호", verified: true },
  { value: "2023", label: "채널A 방송 출연", verified: false },
  { value: "2023", label: "KBS 6시 내고향 방영", verified: false },
];

export const certifications = {
  organic: {
    number: "15100525",
    firstCertifiedDate: "2012-09-26",
    itemLabel: "고구마",
    verified: true,
  },
  lowCarbon: {
    number: "2018-111",
    verified: true,
  },
  // 브리프 제공 수치 — 인증서 실물로 재확인 권장
  areaClaims: {
    totalCertifiedAreaSqm: 101198,
    sweetPotatoAreaSqm: 78978,
    productionPlanKg: 165270,
    verified: false,
  },
};

export const corporate = {
  companyType: "농업회사법인 (유)담이농장",
  establishedDate: "2015-12-16",
  representativeName: "강여상",
  verified: false, // 법인 등기 자료로 재확인 권장
};

export interface BroadcastEntry {
  network: string;
  program: string;
  segment?: string;
  airDate: string;
  region: string;
  description: string;
  verified: boolean;
}

export const broadcasts: BroadcastEntry[] = [
  {
    network: "KBS 1TV",
    program: "6시 내고향",
    segment: "홍보 장사 만만세 - 달콤한 국민 간식, 고구마",
    airDate: "2023-09-12",
    region: "전남 무안",
    description:
      "무안 황토밭에서 유기농 방식으로 고구마를 재배해 온 담이농장의 이야기가 소개되었습니다.",
    verified: false,
  },
  {
    network: "KBS",
    program: "내고향 스페셜",
    segment: "6시 내고향 방영분 재소개",
    airDate: "2023-10-17",
    region: "전남 무안",
    description: "앞서 방영된 담이농장 편이 스페셜 코너로 다시 소개되었습니다.",
    verified: false,
  },
  {
    network: "채널A",
    program: "산지직송 프로젝트, 무작정 커머스",
    segment: "무안 고구마 생산자 강여상",
    airDate: "2021-06-06",
    region: "전남 무안",
    description:
      "무안군 특산물을 조명하는 라이브 커머스 예능에서 무안 고구마 생산자로 소개되었습니다.",
    verified: false,
  },
];

export interface AwardEntry {
  year: string;
  title: string;
  detail: string;
  verified: boolean;
}

export const awards: AwardEntry[] = [
  {
    year: "2023",
    title: "제32회 전국 으뜸 농산물 한마당 품평회",
    detail: "특작류 국립농산물품질관리원장상 (강여상 · 고구마 · 무안)",
    verified: false,
  },
];

export const meisterQuote = {
  organization: "풀무원 올가홀푸드",
  program: "올가 마이스터",
  announcedDate: "2023-12-18",
  quote:
    "전남 무안군에서 2대에 걸친 전업농으로 18년간 자가 제조 발효 액비를 사용하여 고품질의 고구마를 생산해 온 강여상 마이스터",
  product: "유기농 꿀고구마",
  variety: "베니하루카",
  verified: true,
  source:
    "풀무원 뉴스룸, 「풀무원 올가홀푸드, 고품질 유기 농산품 장인 인증 제도 '올가 마이스터' 신규 농가 확대」, 2023-12-18",
};

export const communityContribution = {
  year: "2022",
  month: "12",
  detail: "무안군에 유기농 고구마 약 200박스(약 400만 원 상당) 기탁",
  verified: true,
  source: "경기문화저널, 「담이농장 강여상 대표, 무안군에 고구마 200박스 기탁」",
};

export const terroir = [
  {
    title: "황토",
    body: "무안의 붉은 황토는 배수가 좋고 미네랄이 풍부해 고구마 뿌리가 깊고 건강하게 자랍니다.",
  },
  {
    title: "해풍",
    body: "서해에서 불어오는 바닷바람은 일교차를 만들어 고구마의 당도를 끌어올립니다.",
  },
  {
    title: "일조량",
    body: "여름 내내 충분한 일조량이 광합성을 돕고, 전분이 서서히 당으로 바뀌게 합니다.",
  },
  {
    title: "배수",
    body: "물이 고이지 않는 토질 덕분에 무름병 없이 단단하고 매끈한 고구마가 자랍니다.",
  },
];

export const farmToTable = [
  { step: "01", title: "수확", body: "손으로 직접 캐내 상처 없이 온전한 상태를 지킵니다.", icon: "harvest" as const },
  { step: "02", title: "선별", body: "크기와 상태를 사람 눈으로 한 번 더 확인합니다.", icon: "sort" as const },
  { step: "03", title: "숙성", body: "일정 기간 큐어링을 거쳐 전분이 당으로 바뀌길 기다립니다.", icon: "cure" as const },
  { step: "04", title: "포장", body: "충격을 흡수하는 포장으로 배송 중 손상을 최소화합니다.", icon: "pack" as const },
  { step: "05", title: "산지직송", body: "주문 확인 후 산지에서 바로 출고합니다.", icon: "ship" as const },
];

export const tasteGuide = {
  headline: "포슬함보다 촉촉함, 구웠을 때 더 달아지는 고구마",
  points: [
    { title: "식감", body: "촉촉하고 밀도 있는 육질로, 씹을수록 단맛이 진해집니다." },
    { title: "당도", body: "숙성 과정을 거치며 전분이 당으로 전환되어 자연스러운 단맛이 오릅니다." },
    { title: "보관", body: "신문지에 싸서 서늘하고 통풍이 잘되는 곳에 보관하세요. 냉장 보관은 맛을 떨어뜨릴 수 있습니다." },
    { title: "굽는 법", body: "180도 오븐에서 50~60분, 은박지 없이 저온에서 천천히 구우면 꿀처럼 흘러내리는 단맛을 즐길 수 있습니다." },
    { title: "에어프라이어", body: "180도로 예열 후 30~40분, 중간에 한 번 뒤집어주면 골고루 익습니다." },
  ],
};
