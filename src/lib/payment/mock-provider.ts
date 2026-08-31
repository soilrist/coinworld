import type { PaymentProvider, PaymentRequest, PaymentResult } from "./types";

/**
 * 결제 실패/거절 흐름까지 흉내내는 목업 결제 모듈.
 * 실 서비스 연동 전 체크아웃 플로우 전체(성공/실패)를 검증하는 용도.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async charge(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (request.amount <= 0) {
      throw new Error("결제 금액이 올바르지 않습니다.");
    }

    return {
      success: true,
      transactionId: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      approvedAt: new Date().toISOString(),
      provider: this.name,
    };
  }
}

export const paymentProvider: PaymentProvider = new MockPaymentProvider();
