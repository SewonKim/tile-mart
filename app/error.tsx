"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-red-500">500</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          서버 오류가 발생했습니다
        </h1>
        <p className="mt-3 text-muted">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <RotateCcw className="size-4" />
            다시 시도
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted-light"
          >
            <Home className="size-4" />
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
