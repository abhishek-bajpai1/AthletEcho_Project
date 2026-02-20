"use client";

import Footer from "../../components/footer";
import Header from "../../components/header";
import { HiLightningBolt } from "react-icons/hi";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdSportsCricket, MdEmojiEvents } from "react-icons/md";
import { GiTrophy, GiCricketBat } from "react-icons/gi";

const stats = [
  { label: "Matches", value: "128", color: "var(--primary)" },
  { label: "Runs", value: "4,512", color: "var(--accent-teal)" },
  { label: "Wickets", value: "121", color: "var(--accent-gold)" },
  { label: "MOM Awards", value: "8", color: "var(--primary)" },
];

const tournaments = [
  { name: "Ranji Trophy – Karnataka", period: "2022 – Present" },
  { name: "Syed Mushtaq Ali Trophy", period: "2021 – 2022" },
  { name: "Inter-University Championship", period: "2018 – 2021" },
];

const achievements = [
  "Player of the Tournament – SMAT 2022",
  "1000+ domestic runs in one season (2023)",
  "Represented India A – Emerging Players Cup",
];

const certifications = [
  "BCCI Level-1 Coaching Certification",
  "High-Performance Athlete Camp – NCA, Bengaluru",
  "Sports Nutrition & Recovery by ICC Academy",
];

export default function Profile() {
  return (
    <>
      <Header />
      <main
        className="min-h-screen sport-grid-bg"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {/* ── Banner ── */}
          <div
            className="relative h-52 md:h-64 rounded-b-2xl overflow-hidden mb-0"
            style={{
              background:
                "linear-gradient(135deg, #1a0800 0%, #ff5500 40%, #cc0030 100%)",
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 12px)",
              }}
            />
            {/* Sport icon watermark */}
            <GiCricketBat className="absolute right-6 bottom-6 text-white/10 text-[10rem] rotate-[-30deg]" />

            {/* Sport badge */}
            <div className="absolute top-4 right-4">
              <span className="sport-badge">
                All-Rounder
              </span>
            </div>
          </div>

          {/* ── Avatar + Name ── */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-4 md:px-6 -mt-14 mb-6">
            <div className="w-28 h-28 rounded-full border-4 border-[var(--primary)] bg-[var(--surface-elevated)] shadow-[0_0_20px_rgba(255,85,0,0.5)] flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <MdSportsCricket className="text-white text-5xl" />
              </div>
            </div>
            <div className="pb-2">
              <h1
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-white leading-none"
              >
                Abhishek Bajpai
              </h1>
              <p className="text-[var(--primary)] font-semibold mt-1 text-sm">
                Professional Cricketer · All-Rounder
              </p>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">
                📍 Bengaluru, India
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a href="https://www.linkedin.com/in/abhibajpai" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-bright)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                  <FaLinkedin />
                </a>
                <a href="https://www.instagram.com/abhi_cricketer" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-bright)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com/abhi_sports" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-bright)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                  <FaTwitter />
                </a>
                <button className="btn-sport-ghost text-sm px-4 py-2 ml-2">
                  Connect
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* About */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2"
                >
                  <HiLightningBolt className="text-[var(--primary)]" /> About
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  A passionate cricketer with 7+ years of experience playing at district and state levels. Known for consistent batting performance and agile fielding. Represented Karnataka U23 and currently playing for CodeDploy Warriors League Team.
                </p>
              </section>

              {/* Featured */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"
                >
                  <MdEmojiEvents className="text-[var(--primary)]" /> Featured
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: "Player of the Tournament 2022", desc: "Awarded in SMAT for all-round performance." },
                    { title: "1000+ Domestic Runs", desc: "Scored across formats in 2023 season." },
                    { title: "India A – Emerging Cup", desc: "Represented India at international youth level." },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--primary)] transition-colors"
                    >
                      <GiTrophy className="text-[var(--primary)] text-xl mb-2" />
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{item.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tournaments */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"
                >
                  <MdSportsCricket className="text-[var(--primary)]" /> Tournaments
                </h2>
                <div className="space-y-3">
                  {tournaments.map((t) => (
                    <div key={t.name} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{t.name}</p>
                      <span className="sport-badge text-xs">{t.period}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Career Stats */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"
                >
                  <GiTrophy className="text-[var(--primary)]" /> Career Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="bg-[var(--surface)] rounded-xl p-3 text-center border border-[var(--border)]"
                    >
                      <p
                        className="stat-number"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"
                >
                  <GiTrophy className="text-[var(--primary)]" /> Achievements
                </h2>
                <ul className="space-y-2">
                  {achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--primary)] mt-0.5 flex-shrink-0">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Certifications */}
              <section className="sport-card p-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"
                >
                  <HiLightningBolt className="text-[var(--primary)]" /> Certifications
                </h2>
                <ul className="space-y-2">
                  {certifications.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--primary)] mt-0.5 flex-shrink-0">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
