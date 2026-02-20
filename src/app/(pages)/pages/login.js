"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "../../components/footer";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || "Failed to sign in");
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="relative h-screen overflow-hidden flex flex-col pt-10"
      >
        <Image
          src="/landing_image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 h-full text-white text-4xl font-bold pl-9 pt-10 mt-10">
          <div className="text-left">
            <p className="m-2">Welcome to</p>
            <p className="m-2 text-5xl text-[var(--primary)] drop-shadow-lg">
              AthleteEcho
            </p>
            <p className="m-2 text-xl font-light text-gray-200">
              Your Ultimate Sporting Community Awaits
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex flex-col gap-4 mt-8">
            {error && (
              <div className="text-sm text-red-400 bg-red-900/30 p-3 rounded-lg max-w-md">
                {error}
              </div>
            )}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center bg-white text-black border border-gray-300 rounded-full px-4 py-3 hover:shadow-lg transition-all w-full sm:w-2/3 lg:w-1/3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google logo"
                width={24}
                height={24}
                className="sm:mr-4"
              />
              <p className="text-lg sm:text-xl ml-2">
                {loading ? "Signing in..." : "Sign in with Google"}
              </p>
            </button>
          </div>

          <div className="pt-6 font-extralight text-lg max-w-lg text-gray-300">
            <p className="text-sm text-gray-400 mb-3">
              By continuing, you agree to AthleteEcho&apos;s{" "}
              <u className="cursor-pointer">User Agreement</u>,{" "}
              <u className="cursor-pointer">Privacy Policy</u>, and{" "}
              <u className="cursor-pointer">Cookie Policy</u>.
            </p>

            <p className="mt-6 text-md text-gray-400 ml-2">
              New to AthleteEcho?{" "}
              <u className="text-white hover:text-[var(--primary)] transition">
                <Link href="/signup">Join Now</Link>
              </u>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
