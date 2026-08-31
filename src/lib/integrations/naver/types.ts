export interface NaverOrder {
  productOrderId: string;
  orderId: string;
  ordererName: string;
  ordererTel: string;
  productName: string;
  quantity: number;
  totalPaymentAmount: number;
  productOrderStatus: string;
  shippingAddress: string;
}

export interface NaverProduct {
  originProductNo: string;
  name: string;
  salePrice: number;
  stockQuantity: number;
}

export interface NaverInquiry {
  inquiryNo: string;
  title: string;
  content: string;
  answered: boolean;
}

/**
 * 네이버 커머스API(스마트스토어) 연동 인터페이스.
 * UnifiedOrder 모델과 매핑되는 채널 어댑터 — 실 연동 시 이 인터페이스를 구현하는
 * NaverCommerceClient(client.ts)의 실제 호출 로직을 활성화한다.
 */
export interface CommerceChannelClient {
  readonly channelName: string;
  isConfigured(): boolean;
  getOrders(params: { from: Date; to: Date; status?: string }): Promise<NaverOrder[]>;
  getOrderDetail(productOrderId: string): Promise<NaverOrder | null>;
  confirmDispatch(productOrderId: string): Promise<void>;
  registerTracking(productOrderId: string, carrier: string, trackingNumber: string): Promise<void>;
  getProducts(): Promise<NaverProduct[]>;
  updatePrice(originProductNo: string, price: number): Promise<void>;
  updateStock(originProductNo: string, stock: number): Promise<void>;
  getInquiries(): Promise<NaverInquiry[]>;
}
