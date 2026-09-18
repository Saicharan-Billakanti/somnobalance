"use client";

// Generalized version of RollOnPdp.tsx for the other 8 products, following
// the client's master-system briefing (SomnoBalance_Produktseiten_Design_
// Content_Briefing.docx): same visual system (typography, spacing, warm
// editorial imagery, Cormorant Garamond/Manrope) and the same 6-part
// architecture — hero, ritual/application, details, system role, next
// companion, brand close — but content is per-product, driven by the
// config passed in rather than hardcoded.
//
// Per the briefing's explicit warning (§14): body-part instructions,
// ingredients, warnings and quantities are NOT copied from the Roll-on
// mockup — each product's real, already-verified data from products.ts is
// used instead. Where that data doesn't exist yet (e.g. a styled multi-
// angle gallery), the product's single real photo is repeated as the only
// gallery image rather than inventing a fake "different angle."
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/lovable/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import {
  products,
  getProductText,
  type Product,
  type ProductVariant,
} from "@/lib/products";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lovable-serif-loaded",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-lovable-sans-loaded",
});

// Same placeholder public track as the Roll-on page — no specific song was
// supplied for any product; swap for the real one whenever it's chosen.
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

export type RitualStep = { icon: LucideIcon; label: string };

export type ProductSystemConfig = {
  systemRoleLabel: string; // e.g. "RITUAL · REGULATE" shown top-left of hero
  galleryTagline: string[]; // lines shown over the hero image, top-left
  howToUseEyebrow: string;
  howToUseTitle: string[];
  howToUseImage?: string; // real application-sequence photo; leave unset to show a placeholder until one exists
  howToUseSteps: RitualStep[];
  howToUseNote: string[];
  detailIcons: LucideIcon[]; // one icon per details[] line, in order; extra details reuse the last icon
  nextCompanionLabel: string; // e.g. "Dein Begleiter für Regulieren & Loslassen."
  soundTitle: [string, string];
  soundIntro: [string, string];
  soundQuote: [string, string];
  brandCloseTagline: [string, string];
  brandCloseNote: [string, string, string];
  translations?: {
    en?: {
      systemRoleLabel?: string;
      galleryTagline?: string[];
      howToUseEyebrow?: string;
      howToUseTitle?: string[];
      howToUseSteps?: string[];
      howToUseNote?: string[];
      nextCompanionLabel?: string;
      soundTitle?: [string, string];
      soundIntro?: [string, string];
      soundQuote?: [string, string];
      brandCloseTagline?: [string, string];
      brandCloseNote?: [string, string, string];
    };
  };
};

export function ProductSystemPage({
  lang,
  dict,
  product,
  config,
  onAddToCart,
}: {
  lang: Locale;
  dict: Dictionary;
  product: Product;
  config: ProductSystemConfig;
  onAddToCart: (quantity: number, variant?: string) => void;
}) {
  const text = lang === "de" ? product.translations.de : product;
  const SOUND_DURATION = 120;

  const [quantity, setQuantity] = useState(1);
  const [active, setActive] = useState(0);
  const gallery = [product.image, product.image, product.image, product.image];
  const moveGallery = (step: number) =>
    setActive((current) => (current + step + gallery.length) % gallery.length);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product.variants?.[0]);
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

  const toggleSound = () => controllerRef.current?.togglePlay();
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const [before, after] = dict.shop.withdrawalNote.split("{link}");
  const price = selectedVariant ? selectedVariant.price : (product.price ?? 0);

  const t =
    lang === "en" && config.translations?.en ? config.translations.en : {};
  const c = { ...config, ...t };

  return (
    <div
      className={`${cormorant.variable} ${manrope.variable} relative animate-leaf-drift text-lovable-foreground`}
      style={{
        fontFamily: "var(--font-lovable-sans-loaded)",
        backgroundImage: "url('/brand/related-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
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
                alt={text.name}
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-10 left-10 hidden text-[11px] uppercase leading-[2] tracking-[0.25em] text-lovable-primary md:block">
                {c.galleryTagline.map((line, i) => (
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
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lovable-foreground shadow transition hover:bg-white"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => moveGallery(1)}
                aria-label="Next image"
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
                aria-label="Previous image"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="grid min-w-0 flex-1 grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    aria-label={`View product image ${index + 1}`}
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
                aria-label="Next image"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="py-2 lg:py-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {c.systemRoleLabel}
            </p>
            <h1 className="mt-5 font-sans text-4xl font-medium leading-none md:text-5xl">
              {text.name}
            </h1>
            <p className="mt-3 max-w-md font-lovable-serif text-xl leading-tight text-lovable-muted-foreground">
              {text.tagline}
            </p>
            <div className="mt-6 flex items-end gap-3">
              <strong className="text-2xl font-medium">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(price)}
              </strong>
              <span className="pb-1 text-[10px] text-lovable-muted-foreground">
                {dict.shop.inclVatShipping}
              </span>
            </div>

            {product.variants && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-full border px-4 py-2 text-xs ${
                      selectedVariant?.label === v.label
                        ? "border-lovable-primary bg-lovable-primary/10"
                        : "border-lovable-border text-lovable-muted-foreground hover:bg-lovable-muted"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-7 flex gap-3">
              <div className="flex h-12 items-center rounded-md border border-lovable-border">
                <Button
                  variant="ghost"
                  className="h-full min-h-0 px-3"
                  onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                  aria-label="Decrease quantity"
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
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3" />
                </Button>
              </div>
              <Button
                className="h-12 min-h-0 flex-1 justify-between rounded-full px-7"
                onClick={() => {
                  onAddToCart(quantity, selectedVariant?.label);
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1800);
                }}
              >
                <span>
                  {added
                    ? `${quantity} ${dict.shop.addedToCart}`
                    : dict.shop.addToCart}
                </span>
                <ArrowRight className="size-4" />
              </Button>
            </div>

            {text.specs && (
              <div className="my-7 grid grid-cols-3 gap-3 border-y border-lovable-border py-5 text-[10px]">
                <span className="flex items-center gap-2">
                  {text.specs.format}
                </span>
                <span className="flex items-center gap-2">
                  {text.specs.type}
                </span>
                <span className="flex items-center gap-2">
                  {text.specs.usage}
                </span>
              </div>
            )}

            <p className="text-xs leading-6 text-lovable-muted-foreground">
              {text.description}
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
              aria-label={playing ? "Pause sound" : "Play sound"}
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
            <div
              ref={spotifyMountRef}
              className="absolute h-px w-px overflow-hidden opacity-0"
              aria-hidden="true"
            />
          </aside>
        </section>

        <section className="border-y border-lovable-border bg-lovable-secondary/35 py-8">
          <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[280px_1fr_180px] lg:px-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
                {c.howToUseEyebrow}
              </p>
              <span className="mt-4 block h-px w-8 bg-lovable-primary" />
              <h2 className="mt-8 font-lovable-serif text-3xl leading-tight md:text-4xl">
                {c.howToUseTitle[0]}
                <br />
                {c.howToUseTitle[1]}
              </h2>
            </div>
            <div>
              <div className="w-full overflow-hidden">
                {config.howToUseImage ? (
                  <Image
                    src={config.howToUseImage}
                    alt=""
                    width={1600}
                    height={720}
                    className="h-auto w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-[2.15/1] w-full items-center justify-center border border-dashed border-lovable-border bg-lovable-muted text-[10px] uppercase tracking-[0.2em] text-lovable-muted-foreground">
                    Image coming soon
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 pt-3 text-[9px] sm:text-[11px]">
                {config.howToUseSteps.map((step, index) => (
                  <span key={step.label}>
                    <b className="mr-2 font-normal underline underline-offset-8">
                      0{index + 1}
                    </b>
                    {t.howToUseSteps?.[index] || step.label}
                  </span>
                ))}
              </div>
            </div>
            <p className="border-l border-lovable-border pl-8 font-lovable-serif text-xl leading-tight">
              {c.howToUseNote[0]}
              <br />
              {c.howToUseNote[1]}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1500px] lg:grid-cols-[0.9fr_1.05fr_0.75fr]">
          <div className="relative min-h-[520px]">
            <Image
              src={product.image}
              alt={text.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="px-7 py-12 md:px-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              {dict.shop.productDetailsEyebrow}
            </p>
            <span className="mt-4 block h-px w-8 bg-lovable-primary" />
            <ul className="mt-6 space-y-7 text-xs leading-5">
              {text.details.map((d, i) => {
                const Icon =
                  config.detailIcons[
                    Math.min(i, config.detailIcons.length - 1)
                  ];
                return (
                  <li key={d} className="flex gap-5">
                    <Icon className="size-6 shrink-0 stroke-[1.2]" />
                    <span>{d}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-l border-lovable-border px-7 py-12">
            {text.ingredients && (
              <div className="rounded-md border border-lovable-border bg-lovable-card p-6">
                <p className="text-[9px] uppercase tracking-[0.18em]">
                  {dict.shop.ingredients}
                </p>
                <p className="mt-5 text-[10px] leading-5 text-lovable-muted-foreground">
                  {text.ingredients}
                </p>
              </div>
            )}
            <p className="mt-16 text-[10px] leading-5 text-lovable-muted-foreground">
              {before}
              <a href={`/${lang}/legal/withdrawal`} className="underline">
                {dict.shop.withdrawalLinkLabel}
              </a>
              {after}
            </p>
          </div>
        </section>

        <section className="border-y border-lovable-border bg-lovable-secondary/35 px-5 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-lovable-muted-foreground">
              System
            </p>
            <p className="mt-3 max-w-lg font-lovable-serif text-2xl italic leading-snug text-lovable-primary">
              {c.nextCompanionLabel}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1500px] px-5 py-14 md:px-10 lg:px-16 lg:py-20">
          <h2 className="mb-8 font-lovable-serif text-2xl md:text-3xl">
            {dict.shop.youMightAlsoLike}
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-8">
            {products
              .filter((p) => p.slug !== product.slug)
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
