"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";
import Header from "../../components/header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUsers } from "@/lib/chat";
import {
  subscribeToMyConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  removeConnection,
} from "@/lib/connections";
import {
  MdSearch, MdPersonAdd, MdPersonRemove,
  MdCheck, MdClose, MdSend,
} from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { GiTrophy } from "react-icons/gi";
import { BsCircleFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Suggestions", "My Connections", "Invitations"];

// ── Person Card ────────────────────────────────────────────────────────────
function PersonCard({ person, status, onConnect, onAccept, onIgnore, onRemove, onMessage }) {
  const isSent = status === "sent";       // I sent a request, pending
  const isConnected = status === "accepted";
  const isIncoming = status === "incoming"; // They sent me a request

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
      className="sport-card p-4 flex items-center gap-4">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {person.photoURL ? (
          <Image src={person.photoURL} alt={person.displayName || "Athlete"}
            width={56} height={56}
            className="rounded-full border-2 border-[var(--primary)] object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-xl font-bold border-2 border-[var(--primary)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {person.displayName?.[0] || "?"}
          </div>
        )}
        {person.online && (
          <BsCircleFill className="absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] border border-[var(--background)] rounded-full" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-bold text-white text-sm"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {person.displayName || "Athlete"}
          </p>
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate">{person.email}</p>
        {person.online ? (
          <span className="text-[10px] text-green-500 font-medium">● Online</span>
        ) : (
          <span className="text-[10px] text-[var(--text-muted)]">● Offline</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {isConnected && (
          <>
            <button onClick={() => onMessage(person.uid)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all font-semibold">
              <MdSend /> Message
            </button>
            <button onClick={() => onRemove(person.uid)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500 hover:text-red-500 transition-all">
              <MdPersonRemove /> Remove
            </button>
          </>
        )}
        {isSent && (
          <button onClick={() => onIgnore(person.uid)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500 hover:text-red-500 transition-all">
            <MdClose /> Withdraw
          </button>
        )}
        {isIncoming && (
          <>
            <button onClick={() => onIgnore(person.uid)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500 hover:text-red-500 transition-all">
              <MdClose /> Ignore
            </button>
            <button onClick={() => onAccept(person.uid)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all font-semibold">
              <MdCheck /> Accept
            </button>
          </>
        )}
        {!isConnected && !isSent && !isIncoming && (
          <button onClick={() => onConnect(person.uid)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all font-semibold">
            <MdPersonAdd /> Connect
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ConnectionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);       // All other registered users
  const [myConns, setMyConns] = useState([]);         // My connection docs from Firestore
  const [activeTab, setActiveTab] = useState("Suggestions");
  const [searchQuery, setSearchQuery] = useState("");


  // Subscribe to users and connections
  useEffect(() => {
    if (!user?.uid) return;
    const unsubUsers = subscribeToUsers(user.uid, setAllUsers);
    const unsubConns = subscribeToMyConnections(user.uid, setMyConns);
    return () => { unsubUsers(); unsubConns(); };
  }, [user?.uid]);

  // Build status map: otherUid → 'sent' | 'incoming' | 'accepted'
  const statusMap = useMemo(() => {
    const map = {};
    myConns.forEach((conn) => {
      if (conn.status === "accepted") {
        map[conn.otherUid] = "accepted";
      } else if (conn.status === "pending") {
        map[conn.otherUid] = conn.requestedBy === user?.uid ? "sent" : "incoming";
      }
    });
    return map;
  }, [myConns, user?.uid]);

  const handleConnect = async (otherUid) => {
    await sendConnectionRequest(user.uid, otherUid);
  };

  const handleAccept = async (otherUid) => {
    await acceptConnectionRequest(user.uid, otherUid);
  };

  const handleIgnore = async (otherUid) => {
    await removeConnection(user.uid, otherUid);
  };

  const handleRemove = async (otherUid) => {
    await removeConnection(user.uid, otherUid);
  };

  const handleMessage = (otherUid) => {
    router.push(`/message?uid=${otherUid}`);
  };

  // Filter helpers
  const matchesSearch = useCallback((u) => {
    const q = searchQuery.toLowerCase();
    return !q || u.displayName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  }, [searchQuery]);

  // Suggestions: users with no connection yet
  const suggestions = useMemo(() =>
    allUsers.filter((u) => !statusMap[u.uid] && matchesSearch(u)),
    [allUsers, statusMap, matchesSearch]
  );

  // My Connections: accepted
  const connections = useMemo(() =>
    allUsers.filter((u) => statusMap[u.uid] === "accepted" && matchesSearch(u)),
    [allUsers, statusMap, matchesSearch]
  );

  // Invitations: incoming pending requests
  const invitations = useMemo(() =>
    allUsers.filter((u) => statusMap[u.uid] === "incoming" && matchesSearch(u)),
    [allUsers, statusMap, matchesSearch]
  );

  // Pending sent (shown in suggestions with "Withdraw" button)
  const sentPending = useMemo(() =>
    allUsers.filter((u) => statusMap[u.uid] === "sent"),
    [allUsers, statusMap]
  );

  const listByTab = {
    "Suggestions": [...sentPending.filter(matchesSearch), ...suggestions],
    "My Connections": connections,
    "Invitations": invitations,
  };

  const activeList = listByTab[activeTab] || [];

  const tabCounts = {
    "Suggestions": suggestions.length + sentPending.length,
    "My Connections": connections.length,
    "Invitations": invitations.length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen sport-grid-bg" style={{ background: "var(--background)" }}>
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
          {/* Heading */}
          <div className="flex items-center gap-2">
            <GiTrophy className="text-[var(--primary)] text-xl" />
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-2xl font-bold uppercase tracking-widest text-white">
              Athlete <span className="text-[var(--primary)]">Network</span>
            </h1>
            {invitations.length > 0 && (
              <span className="ml-auto text-xs bg-[var(--primary)] text-white font-bold px-2 py-0.5 rounded-full">
                {invitations.length} new invite{invitations.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Search & Filter */}
          <div className="sport-card p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
              <input type="text" placeholder="Search by name or email..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm sport-input" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all ${activeTab === tab
                  ? "bg-[var(--primary)] text-white shadow-[0_0_14px_rgba(255,85,0,0.4)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}>
                {tab}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"
                  }`}>{tabCounts[tab]}</span>
              </button>
            ))}
          </div>

          {/* List */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3">
              {allUsers.length === 0 && activeTab === "Suggestions" && (
                <div className="sport-card p-10 text-center text-[var(--text-muted)]">
                  <HiLightningBolt className="text-4xl mx-auto mb-2 text-[var(--primary)] opacity-50" />
                  <p className="font-semibold text-[var(--text-secondary)]">
                    {user ? "No other athletes registered yet." : "Sign in to see athletes."}
                  </p>
                  <p className="text-sm mt-1">As more athletes join AthletEcho, they&apos;ll appear here.</p>
                </div>
              )}

              {activeList.length === 0 && !(allUsers.length === 0 && activeTab === "Suggestions") && (
                <div className="sport-card p-10 text-center text-[var(--text-muted)]">
                  <MdCheck className="text-4xl mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-[var(--text-secondary)]">
                    {activeTab === "Invitations" ? "No pending invitations" :
                      activeTab === "My Connections" ? "No connections yet" :
                        searchQuery ? `No results for "${searchQuery}"` : "No suggestions"}
                  </p>
                </div>
              )}

              <AnimatePresence>
                {activeList.map((person) => (
                  <PersonCard
                    key={person.uid}
                    person={person}
                    status={statusMap[person.uid]}
                    myUid={user?.uid}
                    onConnect={handleConnect}
                    onAccept={handleAccept}
                    onIgnore={handleIgnore}
                    onRemove={handleRemove}
                    onMessage={handleMessage}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
