"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/csrf-client";

export default function Setup2faPage() {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/setup-2fa")
      .then((r) => r.json())
      .then((data) => {
        if (data.alreadyEnabled) {
          router.push("/admin");
          return;
        }
        setQrDataUrl(data.qrDataUrl);
        setSecret(data.secret);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await adminFetch("/api/admin/setup-2fa", { method: "POST", body: JSON.stringify({ code }) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "인증에 실패했습니다.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  if (loading) return <div className="flex min-h-dvh items-center justify-center bg-soil-900" />;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-soil-900 px-5 py-16">
      <div className="mx-auto w-full max-w-sm text-center">
        <p className="font-serif text-2xl font-bold text-ivory-50">2단계 인증 설정</p>
        <p className="mt-2 text-sm text-ivory-400">
          최초 로그인 시 2FA 설정이 필요합니다. Google Authenticator 등 인증 앱으로 아래 QR코드를 스캔하세요.
        </p>

        {qrDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="2FA QR 코드" className="mx-auto mt-6 h-48 w-48 rounded-sm bg-ivory-50 p-3" />
        )}
        {secret && (
          <p className="mt-3 break-all rounded-sm bg-ivory-50/10 px-3 py-2 font-mono text-xs text-ivory-300">{secret}</p>
        )}

        <form onSubmit={confirm} className="mt-6 space-y-4">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            placeholder="6자리 코드 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-sm border border-ivory-50/20 bg-soil-800 px-4 py-3 text-center text-2xl tracking-[0.5em] text-ivory-50"
          />
          {error && <p className="text-sm font-medium text-burgundy-300">{error}</p>}
          <button type="submit" className="btn-primary w-full">인증 완료</button>
        </form>
      </div>
    </div>
  );
}
