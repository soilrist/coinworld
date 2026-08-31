import { z } from "zod";

export const checkoutSchema = z.object({
  recipientName: z.string().trim().min(1, "받는 분 이름을 입력해주세요.").max(50),
  recipientPhone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "휴대폰 번호 형식을 확인해주세요."),
  address: z.string().trim().min(1, "배송 주소를 입력해주세요.").max(200),
  addressDetail: z.string().trim().max(100).optional(),
  deliveryMemo: z.string().trim().max(200).optional(),
  paymentMethod: z.enum(["card", "bank_transfer", "naverpay", "kakaopay"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "장바구니가 비어 있습니다."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const inquirySchema = z.object({
  name: z.string().trim().min(1).max(50),
  phone: z.string().trim().max(20).optional(),
  title: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const phoneOrderLookupSchema = z.object({
  phone: z.string().trim().min(9).max(20),
});
