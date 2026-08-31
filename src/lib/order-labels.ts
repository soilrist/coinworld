import type { OrderStatus, PaymentStatus, InquiryStatus, OrderChannel } from "@prisma/client";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "결제대기",
  PAID: "발송대기",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
  RETURNED: "반품",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "결제대기",
  PAID: "결제완료",
  FAILED: "결제실패",
  REFUNDED: "환불완료",
};

export const CHANNEL_LABEL: Record<OrderChannel, string> = {
  WEB: "자체몰",
  SMARTSTORE: "스마트스토어",
  PHONE: "전화주문",
  COUPANG: "쿠팡",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  OPEN: "미답변",
  ANSWERED: "답변완료",
  CLOSED: "종료",
};
