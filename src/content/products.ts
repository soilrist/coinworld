/**
 * 상품 시드 데이터. 실제 품종명은 산지 유통채널(맛뜰무안몰 등)에서 확인된 담이농장 실제 취급 품종을 기반으로 한다.
 * 가격/재고는 관리자에서 변경 가능한 초기값이며, DB(prisma seed)로도 동일하게 반영된다.
 */
export interface ProductSeed {
  slug: string;
  name: string;
  variety: string;
  weightLabel: string;
  weightGrams: number;
  price: number;
  compareAt?: number;
  shippingFee: number;
  stock: number;
  description: string;
  shortDescription: string;
}

export const productSeeds: ProductSeed[] = [
  {
    slug: "sweet-potato-3kg",
    name: "담이농장 무안 유기농 고구마 3kg",
    variety: "베니하루카",
    weightLabel: "3kg",
    weightGrams: 3000,
    price: 25900,
    shippingFee: 3500,
    stock: 120,
    shortDescription: "처음 만나보는 분들을 위한 소용량 구성",
    description:
      "무안 황토밭에서 유기농으로 재배한 베니하루카 품종 고구마입니다. 자가 제조 발효 액비만을 사용해 키우고, 수확 후 숙성 과정을 거쳐 당도를 끌어올렸습니다.",
  },
  {
    slug: "sweet-potato-5kg",
    name: "담이농장 무안 유기농 고구마 5kg",
    variety: "베니하루카",
    weightLabel: "5kg",
    weightGrams: 5000,
    price: 38900,
    compareAt: 41900,
    shippingFee: 0,
    stock: 86,
    shortDescription: "가장 많이 찾는 가정용 기본 구성 · 무료배송",
    description:
      "무안 황토밭에서 유기농으로 재배한 베니하루카 품종 고구마입니다. 자가 제조 발효 액비만을 사용해 키우고, 수확 후 숙성 과정을 거쳐 당도를 끌어올렸습니다. 가정에서 가장 선호하는 용량입니다.",
  },
  {
    slug: "sweet-potato-10kg",
    name: "담이농장 무안 유기농 고구마 10kg",
    variety: "베니하루카",
    weightLabel: "10kg",
    weightGrams: 10000,
    price: 68900,
    compareAt: 75000,
    shippingFee: 0,
    stock: 42,
    shortDescription: "선물용·대용량 · 무료배송",
    description:
      "무안 황토밭에서 유기농으로 재배한 베니하루카 품종 고구마 대용량 구성입니다. 선물용으로도 좋도록 포장을 강화했습니다.",
  },
  {
    slug: "honey-pumpkin-sweet-potato-5kg",
    name: "호풍미 호박고구마 5kg",
    variety: "호박고구마",
    weightLabel: "5kg",
    weightGrams: 5000,
    price: 36900,
    shippingFee: 0,
    stock: 54,
    shortDescription: "진한 단호박 향의 호박고구마",
    description:
      "담이농장에서 유기농으로 재배한 호박고구마입니다. 찌거나 구웠을 때 진한 단호박 향과 부드러운 식감이 특징입니다.",
  },
  {
    slug: "petite-sweet-potato-10kg",
    name: "햇밤 꼬마 고구마 10kg",
    variety: "꼬마 고구마 (개별중량 40~80g)",
    weightLabel: "10kg",
    weightGrams: 10000,
    price: 45900,
    shippingFee: 0,
    stock: 30,
    shortDescription: "한 입 크기, 도시락·간식용으로 인기",
    description:
      "개별 중량 40~80g 내외의 작은 크기 고구마입니다. 껍질째 굽거나 도시락 반찬으로 활용하기 좋습니다.",
  },
];
