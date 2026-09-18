"use client";

import { useState } from "react";

type HealthResponse = {
  timestamp: string;
  supabase: { configured: boolean; connected: boolean; error?: string };
  supabaseOtp: { configured: boolean };
  stripe: { configured: boolean; connected: boolean; error?: string };
};

export default function SystemStatusPage() {
  const [status, setStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/health");
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reach /api/health");
    } finally {
      setLoading(false);
    }
  };

  const badge = (ok: boolean | undefined, labelOk: string, labelWaiting = "Not configured") => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        ok ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
      }`}
    >
      {ok ? labelOk : labelWaiting}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-10 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h1 className="text-3xl font-bold text-white mb-2">System Diagnostics</h1>
            <p className="text-blue-100">Live check of SomnoBalance&rsquo;s Supabase and Stripe integrations</p>
          </div>

          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <p className="text-gray-500 text-sm">
                Press the button below to check the app&rsquo;s real integrations.
              </p>
              <button
                onClick={checkHealth}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking Systems...
                  </>
                ) : (
                  "Run Health Check"
                )}
              </button>
            </div>

            {error && (
              <div className="p-6 mb-8 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Connection Error</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${status?.supabase.connected ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Supabase Database</h3>
                    <p className="text-xs text-gray-500">Main data store (users, orders, affiliates)</p>
                  </div>
                </div>
                {badge(status?.supabase.connected, "Connected")}
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${status?.supabaseOtp.configured ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Supabase OTP</h3>
                    <p className="text-xs text-gray-500">Phone verification for auth</p>
                  </div>
                </div>
                {badge(status?.supabaseOtp.configured, "Configured")}
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between md:col-span-2">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${status?.stripe.connected ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a4 4 0 00-8 0v2M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Stripe</h3>
                    <p className="text-xs text-gray-500">Checkout &amp; webhook payments</p>
                  </div>
                </div>
                {badge(status?.stripe.connected, "Connected")}
              </div>
            </div>

            {status && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Raw Health Response</h4>
                <div className="bg-gray-900 rounded-xl p-5 overflow-auto">
                  <pre className="text-green-400 text-sm font-mono">{JSON.stringify(status, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
