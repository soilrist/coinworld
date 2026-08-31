import bcrypt from "bcryptjs";
import type { CommerceChannelClient, NaverOrder, NaverProduct, NaverInquiry } from "./types";

export class NaverNotConfiguredError extends Error {
  constructor() {
    super("네이버 커머스API 연동이 설정되지 않았습니다. NAVER_COMMERCE_CLIENT_ID / NAVER_COMMERCE_CLIENT_SECRET 환경변수를 설정해주세요.");
  }
}

const API_BASE = "https://api.commerce.naver.com/external";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

/**
 * 네이버 커머스API(舊 스마트스토어 API) 연동 클라이언트.
 *
 * 인증 방식(공식 문서 기준): client_id + timestamp를 client_secret으로 bcrypt 해시한
 * 서명(client_secret_sign)을 붙여 OAuth2 client_credentials 토큰을 발급받는다.
 * ENV에 자격증명이 없으면 모든 메서드가 NaverNotConfiguredError를 던지며,
 * 빌드/개발 서버 구동 자체는 항상 정상 동작한다(자격증명 미설정이 앱 크래시로 이어지지 않음).
 */
export class NaverCommerceClient implements CommerceChannelClient {
  readonly channelName = "SMARTSTORE";
  private tokenCache: TokenCache | null = null;

  isConfigured(): boolean {
    return Boolean(process.env.NAVER_COMMERCE_CLIENT_ID && process.env.NAVER_COMMERCE_CLIENT_SECRET);
  }

  private async getAccessToken(): Promise<string> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) return this.tokenCache.accessToken;

    const clientId = process.env.NAVER_COMMERCE_CLIENT_ID!;
    const clientSecret = process.env.NAVER_COMMERCE_CLIENT_SECRET!;
    const timestamp = Date.now();
    const sign = await bcrypt.hash(`${clientId}_${timestamp}`, clientSecret);
    const clientSecretSign = Buffer.from(sign).toString("base64");

    const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        timestamp: String(timestamp),
        client_secret_sign: clientSecretSign,
        grant_type: "client_credentials",
        type: "SELF",
      }),
    });
    if (!res.ok) throw new Error(`네이버 커머스API 토큰 발급 실패: ${res.status}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.tokenCache = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 - 5000 };
    return data.access_token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await this.getAccessToken();
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`네이버 커머스API 요청 실패 (${path}): ${res.status}`);
    return res.json() as Promise<T>;
  }

  async getOrders(): Promise<NaverOrder[]> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    return this.request<NaverOrder[]>("/v1/pay-order/seller/product-orders/last-changed-statuses");
  }

  async getOrderDetail(productOrderId: string): Promise<NaverOrder | null> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    return this.request<NaverOrder | null>(`/v1/pay-order/seller/product-orders/${productOrderId}`);
  }

  async confirmDispatch(productOrderId: string): Promise<void> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    await this.request(`/v1/pay-order/seller/product-orders/${productOrderId}/confirm-dispatch`, { method: "POST" });
  }

  async registerTracking(productOrderId: string, carrier: string, trackingNumber: string): Promise<void> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    await this.request(`/v1/pay-order/seller/product-orders/${productOrderId}/dispatch`, {
      method: "POST",
      body: JSON.stringify({ deliveryCompanyCode: carrier, trackingNumber }),
    });
  }

  async getProducts(): Promise<NaverProduct[]> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    return this.request<NaverProduct[]>("/v2/products/search");
  }

  async updatePrice(originProductNo: string, price: number): Promise<void> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    await this.request(`/v2/products/origin-products/${originProductNo}`, {
      method: "PUT",
      body: JSON.stringify({ salePrice: price }),
    });
  }

  async updateStock(originProductNo: string, stock: number): Promise<void> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    await this.request(`/v2/products/origin-products/${originProductNo}`, {
      method: "PUT",
      body: JSON.stringify({ stockQuantity: stock }),
    });
  }

  async getInquiries(): Promise<NaverInquiry[]> {
    if (!this.isConfigured()) throw new NaverNotConfiguredError();
    return this.request<NaverInquiry[]>("/v1/pay-user/inquiries");
  }
}

export const naverCommerceClient = new NaverCommerceClient();
