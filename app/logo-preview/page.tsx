import Image from "next/image";

const logos = [
  {
    concept: "Concept 1 — 타일 그리드",
    description:
      "4칸 타일 패턴을 투명도로 표현. 미니멀하고 깔끔한 그리드 모티프.",
    src: "/images/logos/tilemart-concept1-horizontal.svg",
  },
  {
    concept: "Concept 2 — T 레터마크",
    description:
      "둥근 사각형 안에 T자 + 타일 악센트. 한글 + 영문 병기. 앱 아이콘으로도 활용 가능.",
    src: "/images/logos/tilemart-concept2-horizontal.svg",
  },
  {
    concept: "Concept 3 — 다이아몬드 타일",
    description:
      "45도 회전 타일 3장 겹침 효과. 깊이감 있는 레이어드 디자인 + 구분선 악센트.",
    src: "/images/logos/tilemart-concept3-horizontal.svg",
  },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-zinc-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-2 text-3xl font-bold">타일마트 로고 컨셉</h1>
        <p className="mb-12 text-zinc-500">
          3가지 모던 컨셉 — 마음에 드는 것을 선택해주세요
        </p>

        <div className="space-y-10">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200"
            >
              {/* 라이트 배경 */}
              <div className="flex items-center justify-center bg-white px-12 py-14">
                <Image
                  src={logo.src}
                  alt={logo.concept}
                  width={320}
                  height={70}
                  className="h-auto w-full max-w-xs"
                />
              </div>
              {/* 다크 배경 */}
              <div className="flex items-center justify-center bg-zinc-900 px-12 py-14">
                <Image
                  src={logo.src}
                  alt={logo.concept}
                  width={320}
                  height={70}
                  className="h-auto w-full max-w-xs brightness-0 invert"
                />
              </div>
              {/* 설명 */}
              <div className="border-t border-zinc-100 px-6 py-5">
                <h2 className="text-lg font-bold">{logo.concept}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {logo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
