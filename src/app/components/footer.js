import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube, FaFacebookF, FaPhone, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] relative overflow-hidden">
      {/* Orange top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-orange-400 to-[var(--primary-dark)]" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,85,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,0,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Main footer columns ── */}
      <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand + Newsletter */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <HiLightningBolt className="text-[var(--primary)] text-xl" />
              <span
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-xl font-bold tracking-widest uppercase text-white"
              >
                Athlet<span className="text-[var(--primary)]">Echo</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
              The ultimate network for athletes and coaches. Connect, grow, and dominate your sport.
            </p>

            {/* Newsletter */}
            <p className="text-xs uppercase tracking-widest font-bold text-[var(--primary)] mb-2">
              Stay in the Game
            </p>
            <div className="flex rounded-full overflow-hidden border border-[var(--border)] focus-within:border-[var(--primary)] transition-colors">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm text-white px-4 py-2.5 outline-none placeholder-[var(--text-muted)]"
              />
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold uppercase tracking-widest px-4 transition-colors">
                Join
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: <FaInstagram />, href: "#", label: "Instagram" },
                { icon: <FaTwitter />, href: "#", label: "Twitter" },
                { icon: <FaYoutube />, href: "#", label: "YouTube" },
                { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
                { icon: <FaFacebookF />, href: "#", label: "Facebook" },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[0_0_10px_rgba(255,85,0,0.4)] transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-sm font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2"
            >
              <span className="w-4 h-0.5 bg-[var(--primary)] inline-block rounded-full" /> Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home Feed", href: "/home" },
                { label: "Find Connections", href: "/connections" },
                { label: "Coaching", href: "/coaching" },
                { label: "Messages", href: "/message" },
                { label: "My Profile", href: "/profile" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-sm font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2"
            >
              <span className="w-4 h-0.5 bg-[var(--primary)] inline-block rounded-full" /> Company
            </h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "Contact", "Terms & Conditions", "Privacy Policy", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-sm font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2"
            >
              <span className="w-4 h-0.5 bg-[var(--primary)] inline-block rounded-full" /> Contact Us
            </h3>
            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--primary)]">
                  <FaPhone className="text-xs" />
                </span>
                <span>+91-89575050</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--primary)]">
                  <FaEnvelope className="text-xs" />
                </span>
                <span>contact@atheltecho.in</span>
              </div>
              <p className="text-xs mt-1">Mon–Sat, 10:00 AM – 6:00 PM IST</p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-[var(--primary)]">Get the App</p>
              <div className="flex gap-2">
                <div className="px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-white transition-colors cursor-pointer">
                  App Store
                </div>
                <div className="px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-white transition-colors cursor-pointer">
                  Google Play
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--footer-border)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[var(--primary)] font-semibold">AthletEcho</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <span className="text-[var(--primary)] text-base">♥</span> for Athletes
          </p>
        </div>
      </div>
    </footer>
  );
}
