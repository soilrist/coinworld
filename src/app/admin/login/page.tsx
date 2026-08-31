"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "로그인에 실패했습니다.");
      return;
    }
    if (data.requires2FA) {
      setStep("2fa");
    } else {
      router.push(next);
      router.refresh();
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "인증에 실패했습니다.");
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="text-center font-serif text-2xl font-bold text-ivory-50">DAM-E FARM OS</p>
      <p className="mt-1 text-center text-sm text-ivory-400">담이농장 통합 운영 관리자</p>

      <form onSubmit={step === "credentials" ? submitCredentials : submitCode} className="mt-8 space-y-4 rounded-sm border border-ivory-50/15 bg-ivory-50/[0.04] p-7">
        {step === "credentials" ? (
          <>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-ivory-300">이메일</label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-ivory-50/20 bg-soil-900 px-4 py-3 text-[16px] text-ivory-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm text-ivory-300">비밀번호</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-ivory-50/20 bg-soil-900 px-4 py-3 text-[16px] text-ivory-50"
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm text-ivory-300">
              인증 앱(Authenticator)의 6자리 코드
            </label>
            <input
              id="code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-sm border border-ivory-50/20 bg-soil-900 px-4 py-3 text-center text-2xl tracking-[0.5em] text-ivory-50"
            />
          </div>
        )}

        {error && <p className="text-sm font-medium text-burgundy-300">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "처리 중..." : step === "credentials" ? "로그인" : "인증하기"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-soil-900 px-5 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
