"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

type AuthMode = "login" | "signup";
type CheckoutTier = "monthly" | "yearly";

const PRICE_IDS: Record<CheckoutTier, string> = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? "",
  yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ?? "",
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutState, setCheckoutState] = useState<{ userId: string; email: string } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<CheckoutTier | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setCheckoutError(null);
    setInfoMessage(null);
    setCheckoutState(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setFormError("Please provide your name.");
          return;
        }

        const {
          data: { user },
          error: signupError,
        } = await supabaseClient.auth.signUp({
          email,
          password,
        });

        if (signupError || !user) {
          throw new Error(signupError?.message || "Unable to sign up.");
        }

        const { error: insertError } = await supabaseClient
          .from("UserUdemy")
          .insert([{ users_id: user.id, name: name.trim(), email }]);

        if (insertError) {
          throw new Error(insertError.message || "Unable to save your profile.");
        }

        setCheckoutState({ userId: user.id, email });
        setInfoMessage("Account created! Choose your free trial to continue.");
        setPassword("");
        setName("");
      } else {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error(signInError.message || "Unable to log in.");
        }

        router.push("/home");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (tier: CheckoutTier) => {
    if (!checkoutState) {
      return;
    }

    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      setCheckoutError("Missing Stripe price configuration.");
      return;
    }

    setCheckoutError(null);
    setCheckoutLoading(tier);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: checkoutState.userId,
          email: checkoutState.email,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout session.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout session missing redirect URL.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout.";
      setCheckoutError(message);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl border border-white/70 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              Welcome
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {mode === "login" ? "Log In" : "Create your account"}
            </h1>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "signup" : "login"));
              setFormError(null);
              setInfoMessage(null);
              setCheckoutState(null);
            }}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {infoMessage && <p className="text-sm text-green-600">{infoMessage}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        {checkoutState && (
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 space-y-3">
            <p className="text-sm font-semibold text-indigo-800">
              Choose your 30-day free trial to continue
            </p>

            <div className="grid gap-3">
              <button
                type="button"
                className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-left shadow hover:bg-indigo-50 disabled:opacity-60"
                onClick={() => handleCheckout("monthly")}
                disabled={checkoutLoading === "monthly"}
              >
                <p className="font-semibold text-indigo-900">Start 30-day free trial – Monthly</p>
                <p className="text-sm text-indigo-600">$7.87 / month after trial</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-left shadow hover:bg-indigo-50 disabled:opacity-60"
                onClick={() => handleCheckout("yearly")}
                disabled={checkoutLoading === "yearly"}
              >
                <p className="font-semibold text-indigo-900">Start 30-day free trial – Yearly</p>
                <p className="text-sm text-indigo-600">$78.70 / year after trial</p>
              </button>
            </div>

            {checkoutError && <p className="text-sm text-red-600">{checkoutError}</p>}
            {checkoutLoading && (
              <p className="text-sm text-indigo-700">
                Preparing {checkoutLoading === "monthly" ? "monthly" : "yearly"} checkout...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


