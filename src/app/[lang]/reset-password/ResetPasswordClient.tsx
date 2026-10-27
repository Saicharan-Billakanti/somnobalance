"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function ResetPasswordClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.authPages.resetPassword, router = useRouter();
  const [email,setEmail]=useState(""); const [code,setCode]=useState(""); const [password,setPassword]=useState(""); const [confirmPassword,setConfirmPassword]=useState("");
  const [busy,setBusy]=useState(false); const [success,setSuccess]=useState(false); const [message,setMessage]=useState<string|null>(null);
  const submit=async(event:React.FormEvent)=>{event.preventDefault();setMessage(null);if(password!==confirmPassword){setMessage(t.passwordMismatch);return;}setBusy(true);try{const response=await fetch("/api/auth/password/reset/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim().toLowerCase(),code,password})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not reset password.");setSuccess(true);window.setTimeout(()=>{router.push(`/${lang}/login`);router.refresh();},1500);}catch(error){setMessage(error instanceof Error?error.message:"Could not reset password.");}finally{setBusy(false);}};
  return <div className="mx-auto max-w-md px-4 py-16 sm:px-6"><h1 className="font-serif text-3xl text-ink">{t.title}</h1><p className="mt-2 text-sm text-ink/70">Enter the code sent to your email and choose a new password.</p>{success?<p className="mt-6 text-sm text-ink/70">{t.success}</p>:<form onSubmit={submit} className="mt-6 space-y-4"><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={dict.authPages.forgotPassword.emailPlaceholder} className="input-field"/><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit reset code" className="input-field"/><input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder={t.passwordPlaceholder} className="input-field"/><input required type="password" minLength={8} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder={t.confirmPasswordPlaceholder} className="input-field"/><button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy?t.submitting:t.submit}</button></form>}{message&&<p className="mt-4 text-sm text-ink/70">{message}</p>}<Link href={`/${lang}/forgot-password`} className="mt-6 inline-block text-sm text-mauve-dark underline underline-offset-4">Request a new code</Link></div>;
}
