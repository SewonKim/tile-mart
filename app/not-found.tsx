import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-muted">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Home className="size-4" />
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
