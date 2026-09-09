"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { QuizContent } from "@/lib/regenerationscheckContent";
import {
  QUESTION_IDS,
  computeScores,
  resolveProduct,
  type Answers,
  type ProductRef,
} from "@/lib/regenerationscheck";
import { getProduct, getProductText } from "@/lib/products";

type Step =
  | { kind: "start" }
  | { kind: "question"; index: number }
  | { kind: "transition" }
  | { kind: "result" };

function productLink(lang: Locale, ref: ProductRef): { label: string; href: string } {
  const product = getProduct(ref.slug);
  if (!product) return { label: ref.label, href: `/${lang}/shop` };
  const text = getProductText(product, lang);
  return { label: text.name, href: `/${lang}/shop/${product.slug}` };
}

export function RegenerationscheckClient({
  lang,
  dict,
  quiz,
}: {
  lang: Locale;
  dict: Dictionary;
  quiz: QuizContent;
}) {
  const [step, setStep] = useState<Step>({ kind: "start" });
  const [answers, setAnswers] = useState<Answers>({});

  const totalQuestions = QUESTION_IDS.length;

  const start = () => setStep({ kind: "question", index: 0 });

  const answer = (value: number) => {
    if (step.kind !== "question") return;
    const qid = QUESTION_IDS[step.index];
    const next = { ...answers, [qid]: value };
    setAnswers(next);

    if (step.index + 1 < totalQuestions) {
      setStep({ kind: "question", index: step.index + 1 });
    } else {
      setStep({ kind: "transition" });
    }
  };

  const goBack = () => {
    if (step.kind !== "question" || step.index === 0) return;
    setStep({ kind: "question", index: step.index - 1 });
  };

  const restart = () => {
    setAnswers({});
    setStep({ kind: "start" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      {step.kind === "start" && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">
            {quiz.startEyebrow}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink">{quiz.startTitle}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">{quiz.startIntro1}</p>
          <p className="mt-4 leading-relaxed text-ink/70">{quiz.startIntro2}</p>
          <p className="mt-4 leading-relaxed text-ink/70">{quiz.startIntro3}</p>
          <button
            onClick={start}
            className="mt-10 rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark"
          >
            {quiz.startButton}
          </button>
          <p className="mt-4 text-xs text-ink/50">{quiz.startNote}</p>
        </div>
      )}

      {step.kind === "question" && (
        <QuestionScreen
          quiz={quiz}
          index={step.index}
          total={totalQuestions}
          selected={answers[QUESTION_IDS[step.index]]}
          onAnswer={answer}
          onBack={step.index > 0 ? goBack : undefined}
        />
      )}

      {step.kind === "transition" && (
        <div className="text-center">
          <h1 className="font-serif text-3xl text-ink">{quiz.transitionTitle}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">{quiz.transitionCopy}</p>
          <button
            onClick={() => setStep({ kind: "result" })}
            className="mt-10 rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark"
          >
            {quiz.transitionButton}
          </button>
        </div>
      )}

      {step.kind === "result" && (
        <ResultScreen lang={lang} quiz={quiz} answers={answers} onRestart={restart} />
      )}
    </div>
  );
}

function QuestionScreen({
  quiz,
  index,
  total,
  selected,
  onAnswer,
  onBack,
}: {
  quiz: QuizContent;
  index: number;
  total: number;
  selected: number | undefined;
  onAnswer: (value: number) => void;
  onBack?: () => void;
}) {
  const question = quiz.questions[index];
  const progress = quiz.progressLabel
    .replace("{current}", String(index + 1))
    .replace("{total}", String(total));

  return (
    <div>
      <p className="text-center text-xs uppercase tracking-[0.2em] text-ink/40">{progress}</p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="h-full bg-mauve transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {index === 0 && (
        <p className="mt-8 text-center text-sm leading-relaxed text-ink/60">{quiz.questionIntro}</p>
      )}

      <h2 className="mt-8 text-center font-serif text-2xl leading-snug text-ink">
        {question.text}
      </h2>

      <div className="mt-10 space-y-3">
        {quiz.scaleLabels.map((label, value) => (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={`w-full rounded-2xl border px-6 py-4 text-left text-sm transition ${
              selected === value
                ? "border-mauve bg-mauve/10 text-mauve-dark"
                : "border-mauve/15 text-ink/70 hover:bg-sand/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {onBack && (
        <button onClick={onBack} className="mt-8 text-sm text-ink/40 hover:text-ink">
          ← {quiz.back}
        </button>
      )}
    </div>
  );
}

function ResultScreen({
  lang,
  quiz,
  answers,
  onRestart,
}: {
  lang: Locale;
  quiz: QuizContent;
  answers: Answers;
  onRestart: () => void;
}) {
  const result = computeScores(answers);

  if (result.isLowScoreResult) {
    const { product } = resolveProduct(result);
    const link = productLink(lang, product);
    return (
      <div className="text-center">
        <h1 className="font-serif text-3xl text-ink">{quiz.lowScoreResult.title}</h1>
        <p className="mt-6 leading-relaxed text-ink/70">{quiz.lowScoreResult.intro}</p>
        <p className="mt-6 text-sm text-ink/60">{quiz.lowScoreResult.recommendation}</p>
        <Link
          href={link.href}
          className="mt-8 inline-block rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {quiz.lowScoreResult.cta}
        </Link>
        <div>
          <button onClick={onRestart} className="mt-10 block w-full text-sm text-ink/40 hover:text-ink">
            {quiz.restart}
          </button>
        </div>
        <p className="mt-10 text-xs text-ink/40">{quiz.disclaimer}</p>
      </div>
    );
  }

  const content = quiz.results[result.primary];
  const { product, addon } = resolveProduct(result);
  const link = productLink(lang, product);
  const addonRefs = Array.isArray(addon) ? addon : [addon];
  const addonLabel = addonRefs.map((a) => productLink(lang, a).label).join(" / ");

  const secondaryContent = result.secondary ? quiz.results[result.secondary] : null;

  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl text-ink">{content.title}</h1>
      <p className="mt-6 leading-relaxed text-ink/70">{content.intro}</p>

      <div className="mt-10 rounded-2xl border border-mauve/10 bg-white/60 p-6">
        <div className="text-xs font-medium uppercase tracking-wide text-teal-dark">
          {content.ritualLabel}
        </div>
        <p className="mt-2 text-sm text-ink">{content.ritualPoints}</p>
        <p className="mt-4 text-sm italic text-ink/60">{content.ritualLine}</p>
      </div>

      <div className="mt-8">
        <div className="text-xs font-medium uppercase tracking-wide text-ink/50">
          {content.productLabel}
        </div>
        <p className="mt-1 text-ink">{link.label}</p>
        <Link
          href={link.href}
          className="mt-4 inline-block rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {content.cta}
        </Link>
        {addonLabel && (
          <p className="mt-4 text-xs text-ink/50">
            {content.addonLabel.replace("{addon}", addonLabel)}
          </p>
        )}
      </div>

      {secondaryContent && (
        <div className="mt-10 border-t border-mauve/10 pt-8">
          <p className="text-xs uppercase tracking-wide text-ink/40">{quiz.secondaryHeading}</p>
          <p className="mt-2 font-serif text-lg text-ink">{secondaryContent.title}</p>
          <p className="mt-2 text-sm text-ink/60">{secondaryContent.ritualLine}</p>
        </div>
      )}

      <div>
        <button onClick={onRestart} className="mt-10 block w-full text-sm text-ink/40 hover:text-ink">
          {quiz.restart}
        </button>
      </div>
      <p className="mt-10 text-xs text-ink/40">{quiz.disclaimer}</p>
    </div>
  );
}
