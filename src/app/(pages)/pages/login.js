// import Link from "next/link";
// import Footer from "../../components/footer";

// export default function Login() {
//   return (
//     <>
//       <div
//         className="relative h-screen bg-no-repeat bg-cover bg-center overflow-hidden pt-10"
//         style={{
//           backgroundImage: "url('landing_image.jpg')",
//         }}
//       >
//         <div className="items-center justify-left h-full text-white text-4xl font-bold pl-9 pt-10 mt-10">
//           <div className="items-center justify-center">
//             <p className="m-2">Welcome to your Sporting</p>
//             <p className="m-2">Community</p>
//           </div>
//           {/* <div className="flex flex-col gap-4 mt-8 ">
//             <button className="flex items-center justify-center  bg-white text-black border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition w-full sm:w-2/3 lg:w-1/3">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
//                 alt="Google logo"
//                 className="w-9 h-5 sm:mr-5"
//               />
//               <p className=" text-lg sm:text-xl lg:text-2xl. ml-2">
//                 Sign in with Google
//               </p>
//             </button>

//             <button className="flex items-center justify-center  bg-white text-black border border-gray-300 rounded-full px-2 py-2 w-full sm:w-2/3 lg:w-1/3">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
//                 alt="Microsoft logo"
//                 className="w-5 h-5  sm:mr-5"
//               />
//               <p className="text-lg sm:text-xl lg:text-2xl. ml-2">
//                 Sign in with Microsoft
//               </p>
//             </button>
//           </div> */}
//           <div className=" pt-6 font-extralight text-2xl">
//             <p className="text-sm text-gray-400 mb-3">
//               By clicking Continue, you agree to AthleteEcho's{" "}
//               <u>User Agreement</u>,
//               <p>
//                 <u> Privacy Policy</u>, and <u>Cookie Policy</u>.
//               </p>
//             </p>
//             <br></br>
//             <p
//               className=" sm:text-xl lg:text-md  text-gray-400

//             mt-4 ml-9"
//             >
//               New to AtheltEcho?
//               <u>
//                 <Link href="/signup"> Join now</Link>
//               </u>
//             </p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
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
        className="relative h-screen bg-no-repeat bg-cover bg-center overflow-hidden pt-10"
        style={{
          backgroundImage: "url('landing_image.jpg')",
        }}
      >
        <div className="h-full text-white text-4xl font-bold pl-9 pt-10 mt-10">
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
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google logo"
                className="w-6 h-6 sm:mr-4"
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
