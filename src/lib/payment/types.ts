export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: "card" | "bank_transfer" | "naverpay" | "kakaopay";
  customerName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  approvedAt: string;
  provider: string;
  raw?: unknown;
}

/**
 * 실제 PG(토스페이먼츠/카카오페이/네이버페이 등) 연동 전까지 사용하는 결제 추상화 계층.
 * 실 연동 시 이 인터페이스를 구현하는 새 Provider를 추가하고 lib/payment/index.ts에서 교체하면 된다.
 */
export interface PaymentProvider {
  readonly name: string;
  charge(request: PaymentRequest): Promise<PaymentResult>;
}
