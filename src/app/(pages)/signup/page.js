"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "../../components/footer";
import Link from "next/link";
import { HiLightningBolt } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || "Failed to sign up");
      setLoading(false);
    }
  };

  return (
    <>
      <main
        className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 py-14"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1950&q=80')",
        }}
        aria-label="Sign Up page"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm" />

        {/* Decorative orange glow blob */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--primary)] opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Form card */}
        <section className="relative z-10 w-full max-w-md bg-[#13131e]/95 border border-[var(--border-bright)] rounded-2xl shadow-[0_0_60px_rgba(255,85,0,0.15)] p-8 flex flex-col space-y-5 overflow-hidden">
          {/* Orange top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-orange-400 to-[var(--primary-dark)]" />

          {/* Logo & heading */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HiLightningBolt className="text-[var(--primary)] text-2xl" />
              <span
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-2xl font-bold tracking-widest uppercase text-white"
              >
                Athlet<span className="text-[var(--primary)]">Echo</span>
              </span>
            </div>
            <h1
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-3xl font-bold uppercase tracking-wide text-white mt-3"
            >
              Join the Team
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Create your athlete profile today
            </p>
          </div>

          <form className="flex flex-col space-y-4" aria-label="Sign up form">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="sport-input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="sport-input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                required
                className="sport-input"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)]"
              />
              <span className="text-sm text-[var(--text-muted)]">
                I agree to the{" "}
                <a href="#" className="text-[var(--primary)] hover:underline">Terms</a>{" "}
                &{" "}
                <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a>
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="text-sm text-[var(--error)] bg-[var(--error-light)] border border-[var(--error)]/30 p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Primary CTA */}
            <button type="submit" className="btn-sport w-full py-3 text-base">
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-[var(--text-muted)]">
              <hr className="flex-grow border-[var(--border)]" />
              <span className="text-xs uppercase tracking-widest">or</span>
              <hr className="flex-grow border-[var(--border)]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full border border-[var(--border-bright)] rounded-full py-3 bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium text-[var(--text-primary)]"
            >
              <FcGoogle className="text-xl" />
              {loading ? "Creating account..." : "Sign up with Google"}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)] transition-colors">
              Sign in
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
