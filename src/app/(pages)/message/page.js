"use client";

import { useState, useRef, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../../components/footer";
import Header from "../../components/header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  upsertUserProfile,
  setUserOffline,
  subscribeToUsers,
  subscribeToConversations,
  subscribeToMessages,
  getOrCreateConversation,
  sendMessage,
  markMessagesRead,
} from "@/lib/chat";
import { subscribeToMyConnections } from "@/lib/connections";
import {
  MdSend, MdSearch, MdMoreVert, MdVideocam, MdPhone,
  MdEmojiEmotions, MdPersonAdd,
} from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { BsCheckAll, BsCheck, BsCircleFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["😄", "👍", "🔥", "🏆", "💪", "🎯", "⚽", "🏏", "🏸", "🎮"];

function formatTime(ts) {
  if (!ts) return "";
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Get the other participant's uid from a conversation */
function getOtherUid(conv, myUid) {
  return conv.participants?.find((id) => id !== myUid) || null;
}

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);               // All other users
  const [myConns, setMyConns] = useState([]);         // My connections
  const [conversations, setConversations] = useState([]); // My conversations
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [userSearch, setUserSearch] = useState("");     // Search to start new conv
  const [showNewChat, setShowNewChat] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Upsert profile + subscribe to users, connections & conversations ──
  useEffect(() => {
    if (!user?.uid) return;
    upsertUserProfile(user);

    const unsubUsers = subscribeToUsers(user.uid, setUsers);
    const unsubConvs = subscribeToConversations(user.uid, setConversations);
    const unsubConnections = subscribeToMyConnections(user.uid, setMyConns);

    return () => {
      unsubUsers();
      unsubConvs();
      unsubConnections();
      setUserOffline(user.uid);
    };
  }, [user, user?.uid]);

  // ── Connection Status Map ──
  const statusMap = useMemo(() => {
    const map = {};
    myConns.forEach((conn) => {
      if (conn.status === "accepted") {
        map[conn.otherUid] = "accepted";
      }
    });
    return map;
  }, [myConns]);

  // ── Open or create conversation with a user ──────────────────────────────
  const openConversation = useCallback(async (otherUid) => {
    if (!user?.uid || isOpeningChat) return;
    console.log("Opening conversation with:", otherUid);
    setIsOpeningChat(true);
    try {
      const convId = await getOrCreateConversation(user.uid, otherUid);
      console.log("Conversation ID obtained:", convId);
      setActiveConvId(convId);
      setShowNewChat(false);
      setUserSearch("");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error("Error opening conversation:", err);
      alert("Failed to open conversation. Please check your connection.");
    } finally {
      setIsOpeningChat(false);
    }
  }, [user?.uid, isOpeningChat]);

  // ── Handle Auto-opening chat from URL ──
  useEffect(() => {
    const uidFromUrl = searchParams.get("uid");
    if (uidFromUrl && user?.uid && users.length > 0 && isInitialLoad) {
      openConversation(uidFromUrl);
      setIsInitialLoad(false);
    }
  }, [searchParams, user, users, isInitialLoad, openConversation]);

  // ── Subscribe to messages in active conversation ─────────────────────────
  useEffect(() => {
    if (!activeConvId) { setMessages([]); return; }
    const unsub = subscribeToMessages(activeConvId, setMessages);
    return unsub;
  }, [activeConvId]);

  // ── Mark read when opening a conversation ────────────────────────────────
  useEffect(() => {
    if (!activeConvId || !user?.uid) return;
    markMessagesRead(activeConvId, user.uid);
  }, [activeConvId, messages.length, user?.uid]);

  // ── Scroll to bottom on new message ─────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || !activeConvId || !user?.uid) return;
    const text = input;
    console.log("Sending message to:", activeConvId);
    try {
      setInput("");
      setShowEmoji(false);
      await sendMessage(activeConvId, user.uid, text);
      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
      setInput(text); // Restore input on failure
      alert("Failed to send message. Please try again.");
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  // Build sidebar conversation list enriched with the other user's data
  const convList = useMemo(() => {
    const getUserById = (uid) => users.find((u) => u.uid === uid);
    return conversations.map((conv) => {
      const otherUid = getOtherUid(conv, user?.uid);
      const other = getUserById(otherUid);
      return { ...conv, other };
    }).filter((c) => {
      if (!search) return true;
      const name = c.other?.displayName?.toLowerCase() || "";
      return name.includes(search.toLowerCase());
    });
  }, [conversations, users, user?.uid, search]);

  const activeConv = useMemo(() => conversations.find((c) => c.id === activeConvId), [conversations, activeConvId]);

  const otherUser = useMemo(() => {
    if (!activeConvId || !user?.uid) return null;
    const otherUid = activeConvId.split("_").find((id) => id !== user.uid);
    return users.find((u) => u.uid === otherUid);
  }, [activeConvId, user?.uid, users]);


  // New chat user list: Only include accepted connections
  const filteredNewChatUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return users.filter((u) => {
      const isConnected = statusMap[u.uid] === "accepted";
      const matchesSearch = !q || u.displayName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return isConnected && matchesSearch;
    });
  }, [users, statusMap, userSearch]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen sport-grid-bg flex flex-col" style={{ background: "var(--background)" }}>
        <Header />

        <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
          {/* Page heading */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiLightningBolt className="text-[var(--primary)] text-xl" />
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-2xl font-bold uppercase tracking-widest text-white">
                Messages
              </h1>
            </div>
            <button
              onClick={() => { setShowNewChat(v => !v); setUserSearch(""); }}
              className="btn-sport text-sm px-4 py-2 flex items-center gap-2">
              <MdPersonAdd /> New Message
            </button>
          </div>

          {/* ── New Chat modal ── */}
          <AnimatePresence>
            {showNewChat && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="sport-card p-4 mb-4">
                <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold mb-3">
                  Start a conversation
                </p>
                <div className="relative mb-3">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                  <input type="text" placeholder="Search athletes by name or email..."
                    value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm sport-input" />
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {filteredNewChatUsers.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">
                      {users.length === 0 ? "No other users registered yet." : "No users found."}
                    </p>
                  ) : (
                    filteredNewChatUsers.map((u) => (
                      <button key={u.uid} onClick={() => openConversation(u.uid)}
                        disabled={isOpeningChat}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors text-left disabled:opacity-50">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName}
                            className="w-9 h-9 rounded-full border border-[var(--primary)] object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold">
                            {u.displayName?.[0] || "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{u.displayName}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                        {isOpeningChat ? (
                          <div className="ml-auto w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          u.online && <BsCircleFill className="ml-auto text-green-500 text-xs" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Layout */}
          <div className="sport-card overflow-hidden flex h-[68vh] min-h-[480px]">

            {/* ── LEFT: Conversation List ── */}
            <div className="w-72 flex-shrink-0 border-r border-[var(--border)] flex flex-col">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                  <input type="text" placeholder="Search conversations..." value={search}
                    onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm sport-input" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {convList.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)] text-sm space-y-2">
                    <HiLightningBolt className="text-3xl mx-auto text-[var(--primary)] opacity-50" />
                    <p>No conversations yet.</p>
                    <p className="text-xs">Click <strong className="text-[var(--primary)]">New Message</strong> to start chatting!</p>
                  </div>
                ) : (
                  convList.map((conv) => {
                    const isActive = conv.id === activeConvId;
                    return (
                      <button key={conv.id} onClick={() => setActiveConvId(conv.id)}
                        className={`w-full text-left px-4 py-3 border-b border-[var(--border)] flex items-center gap-3 transition-colors ${isActive ? "bg-[var(--primary-light)] border-l-2 border-l-[var(--primary)]"
                          : "hover:bg-[var(--surface-elevated)]"
                          }`}>
                        <div className="relative flex-shrink-0">
                          {conv.other?.photoURL ? (
                            <img src={conv.other.photoURL} alt={conv.other.displayName}
                              className={`w-11 h-11 rounded-full object-cover border-2 ${isActive ? "border-[var(--primary)]" : "border-[var(--border)]"}`} />
                          ) : (
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold border-2 ${isActive ? "border-[var(--primary)]" : "border-[var(--border)]"}`}>
                              {conv.other?.displayName?.[0] || "?"}
                            </div>
                          )}
                          {conv.other?.online && (
                            <BsCircleFill className="absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-bold truncate ${isActive ? "text-[var(--primary)]" : "text-white"}`}>
                              {conv.other?.displayName || "Unknown User"}
                            </p>
                            <span className="text-[10px] text-[var(--text-muted)] ml-1 flex-shrink-0">
                              {formatTime(conv.lastTime)}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {conv.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── RIGHT: Chat Area ── */}
            {activeConvId && otherUser ? (
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chat header */}
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-elevated)]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {otherUser?.photoURL ? (
                        <img src={otherUser.photoURL} alt={otherUser.displayName}
                          className="w-10 h-10 rounded-full border-2 border-[var(--primary)] object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold border-2 border-[var(--primary)]">
                          {otherUser?.displayName?.[0] || "?"}
                        </div>
                      )}
                      {otherUser?.online && (
                        <BsCircleFill className="absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {otherUser?.displayName || "Loading..."}
                      </p>
                      <p className="text-xs">
                        {otherUser?.online
                          ? <span className="text-green-500">● Online</span>
                          : <span className="text-[var(--text-muted)]">
                            Last seen {otherUser?.lastSeen ? formatTime(otherUser.lastSeen) : "recently"}
                          </span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--text-muted)]">
                    <button className="hover:text-[var(--primary)] transition-colors p-1" title="Voice call">
                      <MdPhone className="text-xl" />
                    </button>
                    <button className="hover:text-[var(--primary)] transition-colors p-1" title="Video call">
                      <MdVideocam className="text-xl" />
                    </button>
                    <button className="hover:text-[var(--primary)] transition-colors p-1">
                      <MdMoreVert className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                      <HiLightningBolt className="text-4xl text-[var(--primary)] opacity-50 mb-2" />
                      <p className="text-sm">Say hello to <strong className="text-white">{otherUser?.displayName || "your contact"}</strong>!</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.uid;
                    return (
                      <motion.div key={msg.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
                        className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {!isMe && (
                          otherUser?.photoURL ? (
                            <img src={otherUser.photoURL} alt="" className="w-8 h-8 rounded-full border border-[var(--primary)] flex-shrink-0 self-end object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 self-end">
                              {otherUser?.displayName?.[0] || "?"}
                            </div>
                          )
                        )}
                        <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                          ? "bg-[var(--primary)] text-white rounded-br-sm"
                          : "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-sm"
                          }`}>
                          <p>{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className={`text-[10px] ${isMe ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                              {formatTime(msg.time)}
                            </span>
                            {isMe && (
                              msg.read
                                ? <BsCheckAll className="text-xs text-white/70" />
                                : <BsCheck className="text-xs text-white/50" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Emoji picker */}
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="px-5 pb-2 flex gap-2 flex-wrap border-t border-[var(--border)] pt-2 bg-[var(--surface-elevated)]">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => setInput(prev => prev + e)}
                          className="text-xl hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-end gap-3">
                  <button onClick={() => setShowEmoji(v => !v)}
                    className={`text-xl transition-colors flex-shrink-0 ${showEmoji ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}>
                    <MdEmojiEmotions />
                  </button>
                  <textarea ref={inputRef} value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message... (Enter to send)"
                    rows={1}
                    className="flex-1 resize-none sport-input text-sm py-2.5 max-h-28 overflow-y-auto" />
                  <button onClick={handleSend} disabled={!input.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-[0_0_12px_rgba(255,85,0,0.4)]">
                    <MdSend className="text-lg" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] gap-3">
                <HiLightningBolt className="text-5xl text-[var(--primary)]" />
                <p className="font-bold text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Start a Conversation
                </p>
                <p className="text-sm">Select a chat from the left or click <strong className="text-[var(--primary)]">New Message</strong></p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-white">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
