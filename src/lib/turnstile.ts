// src/lib/turnstile.ts
//
// Cloudflare Turnstile bot verification service.

export async function verifyTurnstileToken(
  token: string | undefined | null,
  clientIp?: string | null
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile secret is not set (e.g. local dev or test), pass gracefully
  if (!secretKey) {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Turnstile verification token missing" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return {
        success: false,
        error: `Bot verification failed: ${data["error-codes"]?.join(", ") || "invalid token"}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[turnstile] verification exception:", err);
    return { success: false, error: "Bot verification service error" };
  }
}
