"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUsers } from "@/lib/chat";
import { AiOutlineHome } from "react-icons/ai";
import { BsRobot } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { IoMdContacts } from "react-icons/io";
import {
  MdOutlineConnectWithoutContact,
  MdClose,
  MdMenu,
  MdSearch,
  MdLightMode,
  MdDarkMode,
} from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("player");
  const [userMessage, setUserMessage] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "player";
    setRole(storedRole);
    // Respect saved theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    setIsDark(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (isOpen && !e.target.closest("nav")) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Subscribe to users for live search
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUsers(user.uid, setAllUsers);
    return unsub;
  }, [user?.uid]);

  const closeMenu = () => setIsOpen(false);
  const toggleBot = () => setIsBotOpen(!isBotOpen);
  const toggleProfile = () => setProfileDropdown(!profileDropdown);

  // Live search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allUsers
      .filter(
        (u) =>
          u.displayName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery, allUsers]);

  const handleSearchNavigate = (uid) => {
    setSearchQuery("");
    setSearchFocused(false);
    router.push(`/profile?uid=${uid}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchNavigate(searchResults[0].uid);
    }
  };

  const handleUserMessage = (e) => {
    e.preventDefault();
    const responses = {
      hi: "Hello Athlete! How can I help you today?",
      "how are you": "Ready to help you reach your peak performance!",
      bye: "Stay strong & keep training!",
    };
    const response =
      responses[userMessage.toLowerCase()] ||
      "I'm your AthletEcho AI assistant. Ask me anything!";
    setBotResponse(response);
    setUserMessage("");
  };

  const navLinks = [
    { href: "/home", icon: <AiOutlineHome className="text-lg" />, label: "Home" },
    { href: "/connections", icon: <MdOutlineConnectWithoutContact className="text-lg" />, label: "Connections" },
    { href: "/message", icon: <FaRegCommentDots className="text-lg" />, label: "Messages" },
    { href: "/coaching", icon: <GoVideo className="text-lg" />, label: role === "coach" ? "Coach Panel" : "Coaching" },
    { href: "/contact", icon: <IoMdContacts className="text-lg" />, label: "Contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#07070f]/98 shadow-[0_4px_24px_rgba(255,85,0,0.12)]"
          : "bg-[#0a0a0f]/95"
          } border-b border-[var(--border)] backdrop-blur-md`}
      >
        {/* Orange top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[var(--primary)] via-orange-400 to-[var(--primary-dark)]" />

        <nav className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto relative">

          {/* ── Logo: SVG only, no duplicate text ── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <img
              src="/logo_ath.svg"
              alt="AthletEcho"
              className="h-8 md:h-9 transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,85,0,0.7)]"
              onError={(e) => {
                // Fallback text logo if SVG fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "block";
              }}
            />
            {/* Fallback text — hidden by default, shown if SVG 404s */}
            <span
              style={{ fontFamily: "'Barlow Condensed', sans-serif", display: "none" }}
              className="text-xl font-bold tracking-widest uppercase text-white group-hover:text-[var(--primary)] transition-colors"
            >
              Athlet<span className="text-[var(--primary)]">Echo</span>
            </span>
          </Link>

          {/* ── Desktop Live Search ── */}
          <div className="hidden lg:block flex-1 max-w-sm mx-6 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search athletes..."
                  className="sport-input pl-9 pr-4 text-sm w-full"
                />
              </div>
            </form>

            {/* Live dropdown results */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    No athletes found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  searchResults.map((u) => (
                    <button
                      key={u.uid}
                      onClick={() => handleSearchNavigate(u.uid)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface)] transition-colors text-left"
                    >
                      {u.photoURL ? (
                        <img src={u.photoURL} alt={u.displayName}
                          className="w-8 h-8 rounded-full border border-[var(--primary)] object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.displayName?.[0] || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{u.displayName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── Desktop Nav ── */}
          <ul className="hidden md:flex gap-1 lg:gap-2 items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all text-sm font-medium"
                >
                  {link.icon}
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right: Theme Toggle + Profile / Sign In ── */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              {isDark ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
            </button>
            {user ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button onClick={toggleProfile} aria-label="Profile menu" className="relative">
                  <img
                    src={user.photoURL || "/avatar.png"}
                    alt={user.displayName || "Profile"}
                    className="w-9 h-9 rounded-full border-2 border-[var(--primary)] hover:shadow-[0_0_12px_rgba(255,85,0,0.6)] transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] border-2 border-[var(--background)] rounded-full" />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-3 w-52 bg-[var(--surface-elevated)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] py-2 z-50 border border-[var(--border)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={closeMenu}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] transition-colors">
                      View Profile
                    </Link>
                    <Link href="/profile/setting" onClick={closeMenu}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] transition-colors">
                      Settings
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--surface)] transition-colors"
                      onClick={async () => { await logout(); setProfileDropdown(false); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="hidden md:block btn-sport text-sm px-5 py-2">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-xl text-[var(--primary)] p-2 hover:bg-[var(--primary-light)] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[#0d0d18] animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search athletes..."
                  className="sport-input pl-9 text-sm w-full"
                />
                {searchResults.length > 0 && searchQuery.trim() && (
                  <div className="mt-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl overflow-hidden">
                    {searchResults.map((u) => (
                      <button key={u.uid} onClick={() => { handleSearchNavigate(u.uid); closeMenu(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--surface)] text-left">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName} className="w-7 h-7 rounded-full border border-[var(--primary)] object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                            {u.displayName?.[0] || "?"}
                          </div>
                        )}
                        <span className="text-sm text-white truncate">{u.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors font-medium">
                  {link.icon} {link.label}
                </Link>
              ))}

              {user ? (
                <div className="border-t border-[var(--border)] mt-2 pt-3 space-y-1">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img src={user.photoURL || "/avatar.png"} alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-[var(--primary)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.displayName || user.email}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] rounded-lg transition-colors">
                    View Profile
                  </Link>
                  <button onClick={async () => { await logout(); closeMenu(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--surface)] rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-[var(--border)] mt-2 pt-3">
                  <Link href="/signin" onClick={closeMenu} className="btn-sport w-full text-center block">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── AI Assistant FAB ── */}
      <button
        onClick={toggleBot}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(255,85,0,0.5)] hover:shadow-[0_4px_28px_rgba(255,85,0,0.7)] hover:scale-105 active:scale-95 transition-all"
        aria-label="Open AI Assistant"
      >
        <BsRobot size={22} />
      </button>

      {isBotOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
            <div className="flex items-center gap-2">
              <HiLightningBolt className="text-white" />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-white font-bold tracking-widest uppercase text-sm">
                AthletEcho AI
              </span>
            </div>
            <button onClick={toggleBot} className="text-white/80 hover:text-white">
              <MdClose size={18} />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={handleUserMessage} className="flex gap-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask me something..."
                className="sport-input text-sm"
              />
              <button type="submit" className="btn-sport px-4 py-2 text-sm whitespace-nowrap">
                Send
              </button>
            </form>
            {botResponse && (
              <p className="mt-3 text-sm text-[var(--text-primary)] bg-[var(--primary-light)] border border-[var(--primary)]/30 p-3 rounded-xl leading-relaxed">
                {botResponse}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
