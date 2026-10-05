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
  FlaskConical,
  Leaf,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/lovable/Button";
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

const gallery = [
  "/products/SomnoBalance Roll-on.webp",
  "/products/SomnoBalance Roll-on.webp",
  "/products/SomnoBalance Roll-on.webp",
  "/products/SomnoBalance Roll-on.webp",
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
        <section className="mx-auto grid max-w-[1500px] gap-8 px-5 pb-10 pt-10 md:px-10 lg:grid-cols-[1.45fr_1fr_0.55fr] lg:px-16">
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-md bg-lovable-muted">
              <Image
                src={gallery[active]}
                alt={tx("SomnoBalance Anti-Stress aromatherapy roll-on", "SomnoBalance Anti-Stress Aromatherapie-Roll-on")}
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
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
              <div className="grid min-w-0 flex-1 grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    aria-label={`${tx("View product image", "Produktbild ansehen")} ${index + 1}`}
                    className={`aspect-square overflow-hidden rounded-sm border bg-lovable-muted transition-colors ${
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
                      className="h-full w-full object-cover"
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
              {dict.shop.categories.Ritual} <span className="mx-2">—</span>{" "}
              {dict.shop.phases.REGULATE}
            </p>
            <h1 className="mt-5 font-sans text-4xl font-medium leading-none md:text-5xl">
              SomnoBalance Roll-on
            </h1>
            <p className="mt-3 max-w-md font-lovable-serif text-xl leading-tight text-lovable-muted-foreground">
              {tx("A scent moment to carry with you,", "Ein Duftmoment zum Mitnehmen,")}
              <br />
              {tx("at home or on the go.", "zu Hause oder unterwegs.")}
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
            <div className="my-7 grid grid-cols-3 gap-3 border-y border-lovable-border py-5 text-[10px]">
              <span className="flex items-center gap-2">
                <Leaf className="size-5 stroke-[1.2]" />
                10 ml
              </span>
              <span className="flex items-center gap-2">
                <FlaskConical className="size-5 stroke-[1.2]" />
                Roll-on
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="size-5 stroke-[1.2]" />
                {tx("External use", "Äußerliche Anwendung")}
              </span>
            </div>
            <p className="text-xs leading-6 text-lovable-muted-foreground">
              {tx(
                "The SomnoBalance Roll-on pairs the brand’s signature scent with a simple, targeted application. Lavender, clementine, grapefruit, frankincense and patchouli are blended into a base of sunflower and jojoba oil, applied directly to the skin — easy to fold into a personal pause or ritual, whether at home, travelling, or as part of an evening routine.",
                "Das SomnoBalance Roll-on verbindet den Signaturduft der Marke mit einer einfachen, gezielten Anwendung. Lavendel, Clementine, Grapefruit, Weihrauch und Patchouli werden in einer Basis aus Sonnenblumen- und Jojobaöl gemischt und direkt auf die Haut aufgetragen — ideal für eine persönliche Pause oder ein Ritual, zu Hause, auf Reisen oder als Teil der Abendroutine.",
              )}
            </p>
          </div>

          <aside className="relative self-start rounded-md border border-lovable-border bg-lovable-card px-6 py-8 lg:min-h-[530px]">
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
            <div className="my-10 h-px w-9 bg-lovable-border" />
            <p className="rotate-[-7deg] text-center font-lovable-serif text-2xl italic leading-tight text-lovable-primary/60 whitespace-pre-line">
              {dict.shop.soundQuote}
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
          <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[280px_1fr_180px] lg:px-16">
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
              <div className="aspect-[2.15/1] overflow-hidden">
                <Image
                  src="/products/pdp-roll-on-rituals.webp"
                  alt={tx("Four ways to apply the SomnoBalance roll-on", "Vier Möglichkeiten, das SomnoBalance Roll-on anzuwenden")}
                  width={1600}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 pt-3 text-[9px] sm:text-[11px]">
                {dict.shop.howToUseSteps.map((label, index) => (
                  <span key={label}>
                    <b className="mr-2 font-normal underline underline-offset-8">
                      0{index + 1}
                    </b>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <p className="border-l border-lovable-border pl-8 font-lovable-serif text-xl leading-tight whitespace-pre-line">
              {dict.shop.howToUseNote}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 md:px-10 lg:grid-cols-[0.9fr_1.05fr_0.75fr] lg:gap-0 lg:px-16 lg:py-20">
          <div className="relative min-h-[520px] overflow-hidden rounded-md">
            <Image
              src="/products/SomnoBalance Roll-on.webp"
              alt={tx("SomnoBalance roll-on", "SomnoBalance Roll-on")}
              fill
              className="object-cover"
            />
          </div>
          <div className="px-2 py-4 md:px-8 lg:px-12 lg:py-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {dict.shop.productDetailsEyebrow}
            </p>
            <span className="mt-4 block h-px w-8 bg-lovable-primary" />
            <ul className="mt-6 space-y-7 text-xs leading-5">
              <li className="flex gap-5">
                <FlaskConical className="size-6 shrink-0 stroke-[1.2]" />
                <span>{tx("10 ml roll-on bottle", "10-ml-Roll-on-Flasche")}</span>
              </li>
              <li className="flex gap-5">
                <Leaf className="size-6 shrink-0 stroke-[1.2]" />
                <span>{tx("Base oils: sunflower oil, jojoba oil", "Basisöle: Sonnenblumenöl, Jojobaöl")}</span>
              </li>
              <li className="flex gap-5">
                <Sparkles className="size-6 shrink-0 stroke-[1.2]" />
                <span>
                  {tx("Scent: lavender, clementine, grapefruit,", "Duft: Lavendel, Clementine, Grapefruit,")}
                  <br />
                  {tx("frankincense, patchouli", "Weihrauch, Patchouli")}
                </span>
              </li>
              <li className="flex gap-5">
                <Sparkles className="size-6 shrink-0 stroke-[1.2]" />
                <span>
                  {tx("Apply to wrists, temples, neck, or soles", "Auf Handgelenke, Schläfen, Nacken oder Fußsohlen")}
                  <br />
                  {tx("of the feet — several times a day as needed", "auftragen — mehrmals täglich nach Bedarf")}
                </span>
              </li>
              <li className="flex gap-5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current font-lovable-serif text-base">
                  i
                </span>
                <span>
                  {tx("For external use only; discontinue if skin", "Nur zur äußerlichen Anwendung; bei Hautreizungen")}
                  <br />
                  {tx("irritation occurs.", "die Anwendung abbrechen.")}
                </span>
              </li>
            </ul>
          </div>
          <div className="px-2 py-4 md:px-8 lg:border-l lg:border-lovable-border/60 lg:px-7 lg:py-12">
            <div className="rounded-md border border-lovable-border bg-lovable-card p-6">
              <p className="text-[9px] uppercase tracking-[0.18em]">
                {tx("Ingredients (INCI)", "Inhaltsstoffe (INCI)")}
              </p>
              <p className="mt-5 text-[10px] leading-5 text-lovable-muted-foreground">
                Helianthus Annuus Seed Oil, Simmondsia Chinensis Seed Oil,
                Tocopherol, Lavandula Angustifolia Oil, Citrus Clementina Peel
                Oil, Citrus Paradisi Peel Oil, Boswellia Sacra Oil, Pogostemon
                Cablin Oil, D-Limonene, Linalool, Geraniol.
              </p>
            </div>
            <p className="mt-16 text-[10px] leading-5 text-lovable-muted-foreground">
              {before}
              <a href={`/${lang}/legal/withdrawal`} className="underline">
                {dict.shop.withdrawalLinkLabel}
              </a>
              {after}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1500px] px-5 py-14 md:px-10 lg:px-16 lg:py-20">
          <h2 className="mb-8 font-lovable-serif text-2xl md:text-3xl">
            {dict.shop.youMightAlsoLike}
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-8">
            {products
              .filter((p) => p.slug !== "somnobalance-roll-on")
              .slice(0, 4)
              .map((p) => {
                const pText = getProductText(p, lang);
                return (
                  <Link
                    key={p.slug}
                    href={`/${lang}/shop/${p.slug}`}
                    className="group block"
                  >
                    <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-md bg-lovable-muted">
                      <Image
                        src={p.image}
                        alt={pText.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-lovable-serif text-lg leading-tight">
                      {pText.name}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-lovable-muted-foreground">
                      {pText.tagline}
                    </p>
                    <div className="mt-3 text-sm font-medium">
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(p.price || 0)}
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
