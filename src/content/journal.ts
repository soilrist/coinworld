export interface JournalSeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "수확" | "밭관리" | "출하소식" | "방송" | "수상" | "공지";
}

export const journalSeeds: JournalSeed[] = [
  {
    slug: "2024-harvest-start",
    title: "2024년, 첫 수확을 시작합니다",
    excerpt: "지난 겨울 준비한 밭에서 올해 첫 고구마를 캐기 시작했습니다.",
    content:
      "지난 겨울 액비를 준비하고 봄부터 순을 심어 키워온 고구마 밭에서 올해 첫 수확을 시작했습니다. 날씨가 도와준 덕분에 밭 상태가 예년보다 좋습니다. 수확한 고구마는 선별과 숙성을 거쳐 순차적으로 출고될 예정입니다.",
    category: "수확",
  },
  {
    slug: "field-management-summer",
    title: "여름 밭 관리 — 해풍과 배수 점검",
    excerpt: "장마 이후 배수로를 다시 점검하고 밭 상태를 살폈습니다.",
    content:
      "장마철에는 배수가 무엇보다 중요합니다. 물이 고이면 고구마가 무르기 쉬워, 장마 전후로 배수로를 반드시 점검합니다. 서해에서 불어오는 바람길도 함께 살펴 밭의 상태를 기록해두었습니다.",
    category: "밭관리",
  },
  {
    slug: "shipping-notice-autumn",
    title: "가을 출하 안내",
    excerpt: "숙성을 마친 고구마부터 순차적으로 출고를 시작합니다.",
    content:
      "수확 후 큐어링(숙성) 과정을 마친 고구마부터 순서대로 출고하고 있습니다. 주문량이 많은 시기에는 출고까지 다소 시간이 걸릴 수 있는 점 양해 부탁드립니다.",
    category: "출하소식",
  },
];
