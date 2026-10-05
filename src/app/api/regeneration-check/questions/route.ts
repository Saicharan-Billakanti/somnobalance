import { NextResponse } from "next/server";
import { CHECK_QUESTIONS, ANSWER_OPTIONS } from "@/lib/regenerationCheck";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") === "en" ? "en" : "de";

    const formattedQuestions = CHECK_QUESTIONS.map((q) => ({
      id: q.id,
      index: q.index,
      text: q.text[lang],
      subscale: q.subscale,
    }));

    const formattedOptions = ANSWER_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label[lang],
    }));

    return NextResponse.json({
      success: true,
      lang,
      totalQuestions: CHECK_QUESTIONS.length,
      scale: formattedOptions,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("[regeneration-check/questions] error:", error);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
