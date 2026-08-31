import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-soil-700">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-charcoal-500">주소가 잘못되었거나 삭제된 페이지입니다.</p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
