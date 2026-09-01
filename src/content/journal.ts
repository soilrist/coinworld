/**
 * 농장 저널 콘텐츠는 담이농장 농장주 가족이 운영하는 개인 블로그
 * (blog.naver.com/runway2000, "담이농장이야기")의 실제 일지를 바탕으로 각색했다.
 * 사진 또한 같은 블로그의 실제 사진이다. 원문을 그대로 옮기지 않고 웹사이트 톤에 맞게
 * 다듬었으며, 출처는 docs/CONTENT.md §12에 기록한다.
 */
export interface JournalSeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "수확" | "밭관리" | "출하소식" | "방송" | "수상" | "공지";
  image?: string;
}

export const journalSeeds: JournalSeed[] = [
  {
    slug: "planting-in-red-clay",
    title: "황토밭에 고구마를 심다",
    excerpt: "곱게 갈아둔 붉은 황토밭에 올해도 고구마 순을 심었습니다.",
    content:
      "이랑을 곱게 갈아둔 밭에 비닐을 씌우고 고구마 순을 하나하나 심었습니다. 무안의 황토는 배수가 좋아 뿌리가 깊게 내리는 만큼, 심는 간격과 깊이를 매년 조금씩 손봐가며 맞춰갑니다. 심고 나면 며칠은 날씨부터 살피게 됩니다 — 너무 가물어도, 너무 젖어도 뿌리내리는 시기에는 예민하기 때문입니다.",
    category: "밭관리",
    image: "/images/journal/soil-rows-planting.jpg",
  },
  {
    slug: "making-natural-fertilizer",
    title: "천연 비료를 직접 만듭니다",
    excerpt: "화학비료 대신 쓸 발효 액비 재료를 손으로 직접 준비했습니다.",
    content:
      "담이농장은 화학비료 대신 자가 제조한 발효 액비를 씁니다. 재료를 섞고 쌓아 발효시키는 과정은 손이 많이 가고 시간도 오래 걸리지만, 땅심을 지키는 데는 이 방법만한 게 없다고 생각합니다. 매해 이맘때면 다음 농사를 준비하며 비료 재료부터 손봅니다.",
    category: "밭관리",
    image: "/images/journal/natural-fertilizer-prep.jpg",
  },
  {
    slug: "sweet-potato-vines-season",
    title: "고구마순도 나누는 계절",
    excerpt: "뜯어낸 고구마순을 나물로 무쳐 먹고, 이웃과도 나누었습니다.",
    content:
      "고구마를 캐기 전, 웃자란 순을 걷어내는 작업을 합니다. 유기농으로 키운 순이라 껍질째 그냥 요리해도 좋아, 일부는 나물로 무쳐 먹고 일부는 이웃에 나누어 드렸습니다. 아까운 마음에 내다 팔아볼까도 싶지만, 혼자 손질하기엔 손이 많이 가는 일이라 우선은 나누는 것으로 만족합니다.",
    category: "수확",
    image: "/images/journal/sweet-potato-vines.jpg",
  },
];
