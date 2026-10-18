"use client";

// Exact port of the client's Lovable design (src/routes/index.tsx) for the
// SomnoBalance Roll-on PDP body — kept as close to the original JSX/classes
// as possible so the two can be diffed directly. The real site Header/Footer
// still wrap this (see [lang]/layout.tsx); only the Lovable page's own
// <header>/<footer> were intentionally left out, per instruction. Swap the
// six AI-generated images once real photography exists.
//
// The Sound panel plays a real Spotify track via Spotify's official iFrame
// API (not a synthesized tone) — the embed itself is visually hidden so the
// panel's look is unchanged; our own play/pause button and progress bar
// drive it. SPOTIFY_TRACK_URI below is a placeholder public track (no
// specific track was supplied) — swap it for the real one whenever it's
// chosen.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Newsreader, Work_Sans } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/lovable/Button";
import { Accordion } from "@/components/Accordion";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { products, getProductText } from "@/lib/products";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lovable-serif-loaded",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-lovable-sans-loaded",
});

// Real photography of the original product with its unchanged label,
// from the client's final image set. Sequence per the briefing:
// product -> application -> everyday.
const gallery = [
  "/products/roll-on-bottle.webp",
  "/products/roll-on-application.webp",
  "/products/roll-on-bag.webp",
  "/products/gallery/roll-on-4.webp",
  "/products/gallery/roll-on-5.webp",
];

// Placeholder public track — no specific song was supplied. Swap the URI
// (open.spotify.com/track/<id> -> spotify:track:<id>) for the real one.
const SPOTIFY_TRACK_URI = "spotify:track:2WfaOiMkCvy7F5fcp2zZ8L";

type SpotifyPlaybackUpdate = {
  data: { isPaused: boolean; position: number; duration: number };
};
type SpotifyController = {
  addListener: (
    event: "playback_update" | "ready",
    cb: (e: SpotifyPlaybackUpdate) => void,
  ) => void;
  togglePlay: () => void;
  destroy: () => void;
};
type SpotifyIframeApi = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string; height: string },
    cb: (controller: SpotifyController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIframeApi) => void;
  }
}

export function RollOnPdp({
  lang,
  dict,
  onAddToCart,
}: {
  lang: Locale;
  dict: Dictionary;
  onAddToCart: (quantity: number) => void;
}) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const SOUND_DURATION = 120; // 2:00, matches the "/ 02:00" label

  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(SOUND_DURATION);
  const spotifyMountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);

  useEffect(() => {
    const mount = spotifyMountRef.current;
    if (!mount) return;

    const setup = (IFrameAPI: SpotifyIframeApi) => {
      IFrameAPI.createController(
        mount,
        { uri: SPOTIFY_TRACK_URI, width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            setPlaying(!e.data.isPaused);
            setElapsed(e.data.position / 1000);
            if (e.data.duration) setDuration(e.data.duration / 1000);
          });
        },
      );
    };

    window.onSpotifyIframeApiReady = setup;
    if (!document.getElementById("spotify-iframe-api")) {
      const script = document.createElement("script");
      script.id = "spotify-iframe-api";
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    controllerRef.current?.togglePlay();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const moveGallery = (step: number) =>
    setActive((current) => (current + step + gallery.length) % gallery.length);

  const [before, after] = dict.shop.withdrawalNote.split("{link}");
  const rollOn = products.find((p) => p.slug === "somnobalance-roll-on")!;
  const text = getProductText(rollOn, lang);
  const companions = [
    {
      slug: "somnobalance-starter-set",
      blurb: tx(
        "Your introduction to the SomnoBalance world—for mindful moments of regeneration from the active day into the night.",
        "Ihr Einstieg in die SomnoBalance-Welt – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht.",
      ),
    },
    {
      slug: "somnobalance-oil-blend",
      blurb: tx(
        "A fragrance cue for mindful moments of regeneration and personal rituals.",
        "Ein Duftimpuls für bewusste Regenerationsmomente und persönliche Rituale.",
      ),
    },
    {
      slug: "somnobalance-room-spray",
      blurb: tx(
        "A fragrance cue for your space and for mindful transitions.",
        "Ein Duftimpuls für Ihren Raum und bewusste Übergänge.",
      ),
    },
    {
      slug: "somnobalance-regeneration-tea",
      blurb: tx(
        "A mindful ritual for calmer moments and the transition into the evening.",
        "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend.",
      ),
    },
  ];
  const phaseKeys = ["REGULATE", "LET GO", "PREPARE", "REGENERATE"] as const;

  return (
    <div
      className={`${newsreader.variable} ${workSans.variable} relative text-lovable-foreground`}
      style={{ fontFamily: "var(--font-lovable-sans-loaded)" }}
    >
      <div
        className="relative"
        style={{
          background:
            "color-mix(in srgb, var(--color-lovable-background) 78%, transparent)",
        }}
      >
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.45fr_1fr_0.55fr]">
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-md border border-lovable-border bg-white">
              <Image
                src={gallery[active]}
                alt={tx("SomnoBalance Roll-on", "SomnoBalance Roll-on")}
                width={1200}
                height={1200}
                className="h-full w-full object-contain p-4"
              />
              <div className="absolute bottom-10 left-10 hidden text-[11px] uppercase leading-[2] tracking-[0.25em] text-lovable-primary md:block">
                {dict.shop.rollOnGalleryTagline.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <span className="mt-4 block h-px w-9 bg-lovable-primary" />
              </div>
              <button
                type="button"
                onClick={() => moveGallery(-1)}
                aria-label={tx("Previous image", "Vorheriges Bild")}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lovable-foreground shadow transition hover:bg-white"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => moveGallery(1)}
                aria-label={tx("Next image", "Nächstes Bild")}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lovable-foreground shadow transition hover:bg-white"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="outline"
                className="size-10 shrink-0 rounded-full px-0"
                onClick={() => moveGallery(-1)}
                aria-label={tx("Previous image", "Vorheriges Bild")}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    aria-label={`${tx("View product image", "Produktbild ansehen")} ${index + 1}`}
                    className={`size-[72px] shrink-0 overflow-hidden rounded-sm border bg-white transition-colors sm:size-20 ${
                      active === index
                        ? "border-lovable-primary"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      width={300}
                      height={300}
                      className="h-full w-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="size-10 shrink-0 rounded-full px-0"
                onClick={() => moveGallery(1)}
                aria-label={tx("Next image", "Nächstes Bild")}
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="py-2 lg:py-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {tx("REGULATE · LET GO · PREPARE", "REGULIEREN · LOSLASSEN · VORBEREITEN")}
            </p>
            <h1 className="mt-5 font-sans text-4xl font-medium leading-none md:text-5xl">
              SomnoBalance Roll-on
            </h1>
            <p className="mt-3 max-w-md font-lovable-serif text-xl leading-tight text-lovable-muted-foreground">
              {text.tagline}
            </p>
            <div className="mt-6 flex items-end gap-3">
              <strong className="text-2xl font-medium">19,00 €</strong>
              <span className="pb-1 text-[10px] text-lovable-muted-foreground">
                {dict.shop.inclVatShipping}
              </span>
            </div>
            <div className="mt-7 flex gap-3">
              <div className="flex h-12 items-center rounded-md border border-lovable-border">
                <Button
                  variant="ghost"
                  className="h-full min-h-0 px-3"
                  onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                  aria-label={tx("Decrease quantity", "Menge verringern")}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-7 text-center text-xs" aria-live="polite">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  className="h-full min-h-0 px-3"
                  onClick={() => setQuantity((v) => v + 1)}
                  aria-label={tx("Increase quantity", "Menge erhöhen")}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
              <Button
                className="h-12 min-h-0 flex-1 justify-between rounded-full px-7"
                onClick={() => {
                  onAddToCart(quantity);
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1800);
                }}
              >
                <span>{added ? `${quantity} ${tx("added", "hinzugefügt")}` : dict.shop.addToCart}</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="my-7 grid grid-cols-3 gap-3 border-y border-lovable-border py-5 text-[10px] uppercase tracking-[0.1em]">
              <span>10 ml</span>
              <span>{tx("For on the go & at home", "Für unterwegs & zu Hause")}</span>
              <span>{tx("Mindful fragrance cue", "Bewusster Duftimpuls")}</span>
            </div>
            <p className="whitespace-pre-line text-xs leading-6 text-lovable-muted-foreground">
              {text.description}
            </p>
          </div>

          <aside className="relative self-start rounded-md border border-lovable-border bg-lovable-card px-6 py-8">
            <h2 className="font-lovable-serif text-xl whitespace-pre-line">
              {dict.shop.soundTitle}
            </h2>
            <p className="mt-2 text-[10px] leading-5 text-lovable-muted-foreground whitespace-pre-line">
              {dict.shop.soundIntro}
            </p>
            <Button
              variant="ghost"
              className="mx-auto mt-6 size-16 rounded-full bg-lovable-secondary px-0"
              onClick={toggleSound}
              aria-label={playing ? tx("Pause sound", "Sound pausieren") : tx("Play sound", "Sound abspielen")}
            >
              {playing ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="size-6 fill-current" />
              )}
            </Button>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-lovable-border">
                <div
                  className="h-px bg-lovable-primary transition-[width]"
                  style={{
                    width: `${Math.min(100, (elapsed / duration) * 100)}%`,
                  }}
                />
              </div>
              <Volume2 className="size-4" />
            </div>
            <p className="mt-2 text-[9px] text-lovable-muted-foreground">
              {formatTime(elapsed)} / {formatTime(duration)}
            </p>
            {/* Real Spotify playback, controlled via the iFrame API — sized
              to 1x1 and visually hidden so the panel's design is unchanged.
              The embed still requires the visitor to click once inside it
              per browser autoplay rules, which is what our button does. */}
            <div
              ref={spotifyMountRef}
              className="absolute h-px w-px overflow-hidden opacity-0"
              aria-hidden="true"
            />
          </aside>
        </section>

        <section
          className="py-14 lg:py-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-lovable-secondary) 25%, transparent), transparent)",
          }}
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_1fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
                {dict.shop.howToUseEyebrow}
              </p>
              <span className="mt-4 block h-px w-8 bg-lovable-primary" />
              <h2 className="mt-8 font-lovable-serif text-3xl leading-tight md:text-4xl whitespace-pre-line">
                {dict.shop.howToUseTitle}
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-xs leading-6 text-lovable-muted-foreground">
                {tx(
                  "Apply a small amount to the intended areas of skin and mindfully notice the fragrance. Use as needed as a personal fragrance cue in everyday life.",
                  "Eine kleine Menge auf die dafür vorgesehenen Hautbereiche auftragen und den Duft bewusst wahrnehmen. Nach Bedarf als persönlichen Duftimpuls in den Alltag integrieren.",
                )}
              </p>
              {/* Real photos from the client's final image set (no fixed body areas shown). */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { src: "/products/roll-on-application.webp", alt: tx("Applying the roll-on", "Roll-on auftragen") },
                  { src: "/products/roll-on-bag.webp", alt: tx("The roll-on within reach in a handbag", "Der Roll-on griffbereit in der Tasche") },
                  { src: "/products/gallery/roll-on-4.webp", alt: tx("Roll-on and oil blend", "Roll-on und Ölmischung") },
                ].map((img) => (
                  <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-md bg-lovable-muted">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    t: tx("Choose a moment", "Moment wählen"),
                    d: tx(
                      "Take a brief moment for yourself.",
                      "Nutzen Sie den Roll-on dann, wenn Sie sich bewusst einen kurzen Moment nehmen möchten.",
                    ),
                  },
                  {
                    t: tx("Apply", "Auftragen"),
                    d: tx(
                      "Apply according to the approved instructions.",
                      "Eine kleine Menge entsprechend der freigegebenen Anwendung auftragen.",
                    ),
                  },
                  {
                    t: tx("Notice the fragrance", "Duft wahrnehmen"),
                    d: tx(
                      "Mindfully notice the fragrance.",
                      "Den Duft bewusst wahrnehmen und den Moment kurz unterbrechen.",
                    ),
                  },
                  {
                    t: tx("Continue your day", "Weitergehen"),
                    d: tx(
                      "Return to your daily rhythm.",
                      "Den Roll-on unkompliziert wieder in den eigenen Tagesrhythmus integrieren.",
                    ),
                  },
                ].map((step, index) => (
                  <div key={step.t} className="border-t border-lovable-border pt-4 text-[11px]">
                    <b className="mr-2 font-normal underline underline-offset-8">0{index + 1}</b>
                    <span className="uppercase tracking-[0.1em]">{step.t}</span>
                    <p className="mt-3 text-[11px] leading-5 text-lovable-muted-foreground">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.05fr_0.75fr] lg:gap-0 lg:py-20">
          <div className="relative min-h-[520px] overflow-hidden rounded-md bg-white">
            <Image
              src="/products/SomnoBalance Roll-on.webp"
              alt={tx("SomnoBalance roll-on", "SomnoBalance Roll-on")}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-contain p-6"
            />
          </div>
          <div className="px-2 py-4 md:px-8 lg:px-12 lg:py-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {dict.shop.productDetailsEyebrow}
            </p>
            <span className="mt-4 block h-px w-8 bg-lovable-primary" />
            <ul className="mt-6 space-y-5 text-xs leading-5">
              {text.details.map((d) => {
                const i = d.indexOf(": ");
                return (
                  <li key={d} className="border-t border-lovable-border/60 pt-5">
                    {i > 0 ? (
                      <>
                        <span className="block text-[10px] uppercase tracking-[0.15em] text-lovable-muted-foreground">
                          {d.slice(0, i)}
                        </span>
                        <span className="mt-1 block">{d.slice(i + 2)}</span>
                      </>
                    ) : (
                      <span>{d}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="px-2 py-4 md:px-8 lg:border-l lg:border-lovable-border/60 lg:px-7 lg:py-12">
            <Accordion
              items={[
                {
                  title: tx("Product & safety information", "Produkt- & Sicherheitsinformationen"),
                  content: (
                    <>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-lovable-foreground">
                        {tx("Ingredients (INCI)", "Inhaltsstoffe (INCI)")}
                      </p>
                      <p className="mt-3 text-[10px] leading-5">
                        Helianthus Annuus Seed Oil, Simmondsia Chinensis Seed Oil,
                        Tocopherol, Lavandula Angustifolia Oil, Citrus Clementina Peel
                        Oil, Citrus Paradisi Peel Oil, Boswellia Sacra Oil, Pogostemon
                        Cablin Oil, D-Limonene, Linalool, Geraniol.
                      </p>
                      <p className="mt-4 text-[10px] leading-5">
                        {tx(
                          "For external use only; discontinue if skin irritation occurs. Keep out of reach of children.",
                          "Nur zur äußerlichen Anwendung; bei Hautreizungen die Anwendung abbrechen. Für Kinder unzugänglich aufbewahren.",
                        )}
                      </p>
                    </>
                  ),
                },
              ]}
            />
            <p className="mt-10 text-[10px] leading-5 text-lovable-muted-foreground">
              {before}
              <a href={`/${lang}/legal/withdrawal`} className="underline">
                {dict.shop.withdrawalLinkLabel}
              </a>
              {after}
            </p>
          </div>
        </section>

        <section
          className="px-4 py-14 sm:px-6"
          style={{
            background: "color-mix(in srgb, var(--color-lovable-secondary) 25%, transparent)",
          }}
        >
          <div className="mx-auto max-w-[1232px]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {tx("WITHIN THE SOMNOBALANCE CYCLE", "IM SOMNOBALANCE-KREISLAUF")}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em]">
              {phaseKeys.map((key, i) => (
                <span
                  key={key}
                  className={
                    i < 3
                      ? "font-semibold text-lovable-foreground underline decoration-lovable-primary underline-offset-8"
                      : "text-lovable-muted-foreground/60"
                  }
                >
                  {dict.shop.phases[key]}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl font-lovable-serif text-xl italic leading-snug text-lovable-foreground md:text-2xl">
              {tx("A companion for different moments.", "Ein Begleiter für unterschiedliche Momente.")}
            </p>
            <p className="mt-4 max-w-2xl text-xs leading-6 text-lovable-muted-foreground">
              {tx(
                "The SomnoBalance Roll-on can be used during different phases of the day—as a mindful fragrance cue in the middle of everyday life, when letting go, or as part of personal preparation for the evening.",
                "Der SomnoBalance Roll-on lässt sich in unterschiedlichen Phasen Ihres Tages einsetzen – als bewusster Duftimpuls mitten im Alltag, beim Loslassen oder als Teil Ihrer persönlichen Vorbereitung auf den Abend.",
              )}
            </p>
            <p className="mt-4 text-[11px] text-lovable-muted-foreground">
              {tx(
                "The phases provide guidance. When and how you integrate the roll-on into your everyday life remains individual.",
                "Die Phasen geben Orientierung. Wann und wie Sie den Roll-on in Ihren Alltag integrieren, bleibt individuell.",
              )}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
            {tx("DISCOVER MORE OF SOMNOBALANCE", "SOMNOBALANCE WEITERENTDECKEN")}
          </p>
          <h2 className="mt-4 max-w-xl font-lovable-serif text-2xl italic leading-snug md:text-3xl">
            {tx("More companions for your rhythm of regeneration.", "Weitere Begleiter für Ihren Regenerationsrhythmus.")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {companions.map((item) => {
              const p = products.find((x) => x.slug === item.slug);
              if (!p) return null;
              const pText = getProductText(p, lang);
              return (
                <Link key={p.slug} href={`/${lang}/shop/${p.slug}`} className="group block">
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-md border border-lovable-border bg-white">
                    <Image
                      src={p.image}
                      alt={pText.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-lovable-serif text-lg leading-tight">{pText.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-lovable-muted-foreground">{item.blurb}</p>
                </Link>
              );
            })}
          </div>
          <Link
            href={`/${lang}/shop`}
            className="mt-10 inline-block text-xs font-semibold uppercase tracking-wider underline underline-offset-8"
          >
            {tx("Discover all products →", "Alle Produkte entdecken →")}
          </Link>
        </section>
      </div>
    </div>
  );
}
