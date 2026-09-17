import Image from "next/image";

const PETAL_IMAGES = [
  "/products/somnobalance-roll-on.jpg",
  "/products/somnobalance-oil-blend.jpg",
  "/products/somnobalance-room-spray.jpg",
  "/products/somnobalance-roll-on.jpg",
  "/products/somnobalance-oil-blend.jpg",
  "/products/somnobalance-room-spray.jpg",
];

const PETAL_COUNT = PETAL_IMAGES.length;

// A "bloom" of the ritual bottles arranged as lotus petals: each petal is
// pinned by its base to the flower's center and fanned out by rotation
// (bottom:50% + transform-origin: 50% 100% puts the pivot exactly at the
// center, so pure `rotate()` is enough — no translate math needed). The
// bottle photo inside is counter-rotated back to upright so labels stay
// readable at every angle.
export function LotusHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
      <div
        className="absolute inset-[8%] -z-10 rounded-full bg-sand/70 blur-2xl"
        aria-hidden="true"
      />

      {PETAL_IMAGES.map((src, i) => {
        const angle = (360 / PETAL_COUNT) * i;
        const ring = i % 2 === 0 ? "var(--color-mauve)" : "var(--color-teal)";
        return (
          <div
            key={i}
            className="absolute left-1/2 bottom-1/2 w-[26%] h-[46%] -ml-[13%] origin-bottom"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div
              className="h-full w-full overflow-hidden rounded-full border-2 shadow-sm"
              style={{ borderColor: ring }}
            >
              <div
                className="relative h-full w-full"
                style={{ transform: `rotate(${-angle}deg) scale(1.9)` }}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
        <Image
          src="/brand/somnobalance-icon.png"
          alt="SomnoBalance"
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
        />
      </div>
    </div>
  );
}
