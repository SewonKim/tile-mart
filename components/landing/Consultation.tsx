"use client";

import { useState } from "react";
import { Phone, Send, Clock, MapPin, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createConsultation } from "@/lib/actions/consultations";

const spaceTypes = [
  { label: "사무실", value: "office" },
  { label: "학원", value: "academy" },
  { label: "체육시설", value: "fitness" },
  { label: "주거공간", value: "residential" },
  { label: "매장", value: "retail" },
  { label: "카페/음식점", value: "fnb" },
  { label: "기타", value: "other" },
];

export function Consultation() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    spaceType: "",
    area: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await createConsultation({
        name: formData.name,
        phone: formData.phone,
        space_type: formData.spaceType,
        area: formData.area || undefined,
        message: formData.message || undefined,
        source: "website",
      });

      if (res.success) {
        setResult({ success: true, message: "상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다." });
        setFormData({ name: "", phone: "", spaceType: "", area: "", message: "" });
      } else {
        setResult({ success: false, message: res.error || "상담 신청에 실패했습니다. 다시 시도해주세요." });
      }
    } catch {
      setResult({ success: false, message: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-3xl bg-dark-bg lg:grid lg:grid-cols-2">
          {/* 왼쪽: 정보 */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-primary">
              CONTACT US
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              무료 상담신청
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              어떤 공간이든 상관없습니다.
              <br />
              전문가가 직접 현장 방문하여 무료 상담을 도와드립니다.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-white/50">대표전화</p>
                  <p className="text-xl font-bold text-white">0507-1497-0485</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-white/50">영업시간</p>
                  <p className="text-sm font-medium text-white">
                    매일 08:00 - 18:30
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-white/50">본사</p>
                  <p className="text-sm font-medium text-white">
                    경기 고양시 일산서구 경의로 826 전면상가좌측칸
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="size-4" />
                카카오 상담
              </a>
              <a
                href="tel:0507-1497-0485"
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                <Phone className="size-4" />
                전화 상담
              </a>
            </div>
          </div>

          {/* 오른쪽: 폼 */}
          <div className="bg-white p-8 md:p-12 lg:p-16">
            <h3 className="mb-6 text-xl font-bold">상담 신청서</h3>

            {result && (
              <div
                className={cn(
                  "mb-6 flex items-start gap-3 rounded-xl p-4 text-sm",
                  result.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                )}
              >
                {result.success ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                ) : (
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted-light px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted-light px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  공간 유형 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {spaceTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, spaceType: type.value })
                      }
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-all",
                        formData.spaceType === type.value
                          ? "bg-primary text-white"
                          : "bg-muted-light text-muted hover:bg-border hover:text-foreground"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  예상 평수
                </label>
                <input
                  type="text"
                  placeholder="예: 30평"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted-light px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  추가 요청사항
                </label>
                <textarea
                  rows={3}
                  placeholder="원하시는 스타일이나 참고 사항을 적어주세요"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-border bg-muted-light px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>처리 중...</>
                ) : (
                  <>
                    <Send className="size-4" />
                    무료 상담 신청하기
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted">
                상담 신청 후 영업일 기준 24시간 이내 연락드립니다
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
