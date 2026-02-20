import Header from "../../components/header";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { FaMobileScreen } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Footer from "../../components/footer";
export default function Contact() {
  return (
    <>
      <div className="relative h-screen bg-no-repeat bg-cover bg-center overflow-hidden flex flex-col px-4 lg:pl-9">
        <Image
          src="/assests/sports-tools.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          width={500}
          height={300}
        />
        <Header />

        <div className="flex justify-center items-center z-0 opacity-90">
          <div className="bg-[var(--surface-elevated)] shadow-xl rounded-2xl w-full max-w-md p-8 border border-[var(--border)]">
            <h1 className="text-3xl font-bold text-[var(--primary)]">Get in touch</h1>
            <p className="text-[var(--text-muted)] mt-1 mb-6">
              Welcome back! Please enter your details.
            </p>
            <div className="flex justify-between">
              <div className="w-30 h-25 border-2 border-[var(--border)] mb-3 rounded-xl">
                <IoLocationSharp className="flex  w-12 h-12 items-center p-2 " />
                <p>
                  <span className="text-sm font-semibold p-2 text-[var(--text-primary)]">
                    1234 street
                  </span>
                </p>
              </div>
              <div className="w-30 h-25 border-2 border-[var(--border)] mb-3 rounded-xl">
                <FaMobileScreen className="flex  w-12 h-12 items-center p-2 " />
                <p>
                  <span className="text-sm font-semibold p-2 text-[var(--text-primary)]">
                    1234567890
                  </span>
                </p>
              </div>
              <div className="w-30 h-25 border-2 border-[var(--border)] mb-3 rounded-xl">
                <MdEmail className="flex  w-12 h-12 items-center p-2 " />
                <p>
                  <span className="text-sm font-semibold p-2 text-[var(--text-primary)]">
                    abc@gmail.com
                  </span>
                </p>
              </div>
            </div>

            <form>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                  >
                    Username or Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    required
                    className="mt-1 w-full px-4 py-2 border border-[var(--border)] rounded-xl text-[var(--text-primary)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    placeholder="Enter your username or email"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 w-full px-4 py-2 border border-[var(--border)] rounded-xl text-[var(--text-primary)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    placeholder="Enter your valid email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                  >
                    Meassage
                  </label>
                  <textarea
                    rows="4"
                    type="message"
                    id="message"
                    name="message"
                    required
                    className="mt-1 w-full px-4 py-2 border border-[var(--border)] rounded-xl text-[var(--text-primary)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    placeholder="Enter your message"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-[var(--primary)] text-white font-semibold py-2.5 rounded-xl hover:bg-[var(--primary-hover)] transition duration-300 cursor-pointer"
                >
                  SUBMIT
                </button>
              </div>
            </form>
            {/* <div className="text-left mt-4">
              <Link
                href="/forgotpassword"
                className=" text-blue-600 hover:underline text-md font-semibold"
              >
                Don't have an accounnt? SignUp
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
