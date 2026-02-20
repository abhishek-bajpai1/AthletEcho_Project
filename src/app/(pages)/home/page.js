"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUsers } from "@/lib/chat";
import {
  createPost, createTextPost, toggleLike, deletePost,
  addComment, subscribeToComments, subscribeToFeed,
} from "@/lib/posts";
import {
  AiFillLike, AiOutlineLike,
} from "react-icons/ai";
import { BiComment, BiShare } from "react-icons/bi";
import { HiLightningBolt } from "react-icons/hi";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  MdSportsSoccer, MdSportsEsports,
  MdDelete, MdSend,
} from "react-icons/md";
import { GiTrophy, GiMedal } from "react-icons/gi";
import { BsBookmark, BsThreeDots } from "react-icons/bs";

const SPORTS = ["All", "Cricket", "Football", "Badminton", "Tennis", "Athletics", "Esports", "Other"];

const TABS = [
  { key: "All", label: "All Sports", icon: <HiLightningBolt /> },
  { key: "Cricket", label: "Cricket", icon: <GiTrophy /> },
  { key: "Football", label: "Football", icon: <MdSportsSoccer /> },
  { key: "Esports", label: "Esports", icon: <MdSportsEsports /> },
];

function timeAgo(ts) {
  if (!ts) return "just now";
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Comment Section ──────────────────────────────────────────────────────────
function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToComments(postId, setComments);
    return unsub;
  }, [postId]);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    await addComment(postId, {
      authorId: user.uid,
      authorName: user.displayName || "Athlete",
      authorPhoto: user.photoURL,
      text,
    });
    setText("");
    setLoading(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
      {/* Input */}
      <div className="flex gap-2 items-center">
        {user.photoURL ? (
          <Image src={user.photoURL} width={32} height={32} className="rounded-full border border-[var(--primary)] flex-shrink-0 object-cover" alt="" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.displayName?.[0] || "?"}
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add a comment..."
            className="flex-1 sport-input text-sm py-2"
          />
          <button onClick={submit} disabled={!text.trim() || loading}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary)] text-white disabled:opacity-40 hover:bg-[var(--primary-hover)] transition-colors flex-shrink-0">
            <MdSend className="text-sm" />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <AnimatePresence>
        {comments.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-start">
            {c.authorPhoto ? (
              <Image src={c.authorPhoto} width={28} height={28} className="rounded-full border border-[var(--border)] flex-shrink-0 object-cover" alt="" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--primary)] text-xs font-bold flex-shrink-0 border border-[var(--border)]">
                {c.authorName?.[0] || "?"}
              </div>
            )}
            <div className="flex-1 bg-[var(--surface-elevated)] rounded-xl px-3 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-white">{c.authorName}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{c.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, user }) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isLiked = post.likedBy?.includes(user?.uid);
  const isOwner = post.authorId === user?.uid;

  const handleLike = () => toggleLike(post.id, user.uid, isLiked);
  const handleDelete = async () => { setShowMenu(false); await deletePost(post.id); };

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}
      className="sport-card p-4">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.authorPhoto ? (
            <Image src={post.authorPhoto} width={44} height={44} className="rounded-full border-2 border-[var(--primary)] object-cover" alt="" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold text-lg border-2 border-[var(--primary)]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {post.authorName?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="font-bold text-white text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {post.authorName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {post.sport && post.sport !== "All" && (
                <span className="sport-badge text-[10px]">{post.sport}</span>
              )}
              <span className="text-[10px] text-[var(--text-muted)]">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options menu */}
        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowMenu(v => !v)}
              className="text-[var(--text-muted)] hover:text-[var(--primary)] p-1 transition-colors">
              <BsThreeDots />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl shadow-lg z-10 overflow-hidden">
                <button onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--surface)] transition-colors">
                  <MdDelete /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative w-full h-80 mb-3">
          <Image src={post.imageUrl} fill className="rounded-xl object-cover" alt="Post" />
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-2 px-1">
        <span>{post.likedBy?.length || 0} like{post.likedBy?.length !== 1 ? "s" : ""}</span>
        <button onClick={() => setShowComments(v => !v)} className="hover:text-[var(--primary)] transition-colors">
          {post.commentCount || 0} comment{post.commentCount !== 1 ? "s" : ""}
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)] text-sm text-[var(--text-muted)]">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors font-medium ${isLiked ? "text-[var(--primary)]" : "hover:text-[var(--primary)]"}`}>
          {isLiked ? <AiFillLike className="text-base" /> : <AiOutlineLike className="text-base" />}
          Like
        </button>
        <button onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors">
          <BiComment className="text-base" /> Comment
        </button>
        <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors">
          <BiShare className="text-base" /> Share
        </button>
        <button className="ml-auto hover:text-[var(--primary)] transition-colors">
          <BsBookmark />
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            <CommentSection postId={post.id} user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Create Post Box ─────────────────────────────────────────────────────────
function CreatePostBox({ user, sport }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedSport, setSelectedSport] = useState(sport || "All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (textOnly = false) => {
    if ((!text.trim() && !imageFile) || loading) return;
    setLoading(true);
    setError("");
    try {
      if (textOnly || !imageFile) {
        await createTextPost({
          authorId: user.uid,
          authorName: user.displayName || "Athlete",
          authorPhoto: user.photoURL,
          content: text,
          sport: selectedSport,
        });
      } else {
        await createPost({
          authorId: user.uid,
          authorName: user.displayName || "Athlete",
          authorPhoto: user.photoURL,
          content: text,
          sport: selectedSport,
          imageFile,
        });
      }
      setText(""); setImageFile(null); setPreview(null); setError("");
    } catch (err) {
      if (err.message === "IMAGE_UPLOAD_FAILED") {
        setError("Image upload failed (Firebase Storage may not be enabled). Post without the image or enable Storage.");
      } else {
        setError(err.message || "Failed to post. Check Firestore rules.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sport-card p-4">
      <div className="flex gap-3 items-start">
        {user.photoURL ? (
          <Image src={user.photoURL} width={40} height={40} className="rounded-full border-2 border-[var(--primary)] flex-shrink-0 object-cover" alt="" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold border-2 border-[var(--primary)] flex-shrink-0">
            {user.displayName?.[0] || "?"}
          </div>
        )}
        <div className="flex-1">
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Share your sports moment, achievement, or update..."
            className="w-full resize-none outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm leading-relaxed"
            rows={3} />

          {preview && (
            <div className="relative mt-2 w-full h-48">
              <Image src={preview} fill className="rounded-lg object-cover" alt="Preview" unoptimized />
              <button onClick={() => { setImageFile(null); setPreview(null); }}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full text-white text-xs flex items-center justify-center hover:bg-[var(--error)] transition-colors">
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button onClick={() => fileRef.current.click()}
                className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm">
                <HiOutlinePhotograph className="text-xl" /> Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
              <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}
                className="sport-input text-xs py-1.5 px-2">
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={() => handleSubmit(false)} disabled={(!text.trim() && !imageFile) || loading}
              className="btn-sport text-sm px-5 py-2 disabled:opacity-50">
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Error message with fallback action */}
          {error && (
            <div className="mt-2 p-2.5 bg-[var(--error-light)] border border-[var(--error)]/40 rounded-xl text-xs text-[var(--error)] flex items-start justify-between gap-2">
              <span>{error}</span>
              {error.includes("Image upload failed") && (
                <button onClick={() => handleSubmit(true)}
                  className="text-xs whitespace-nowrap font-semibold text-white bg-[var(--error)] px-2 py-1 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0">
                  Post Without Image
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Main Feed Page ──────────────────────────────────────────────────────────
export default function SportFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const unsubFeed = subscribeToFeed(setPosts);
    return unsubFeed;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUsers(user.uid, setUsers);
    return unsub;
  }, [user?.uid]);

  const filteredPosts = useMemo(() =>
    activeTab === "All" ? posts : posts.filter(p => p.sport === activeTab),
    [posts, activeTab]
  );

  const suggestedUsers = users.slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen sport-grid-bg" style={{ background: "var(--background)" }}>
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex gap-6">

            {/* ── Left Sidebar ── */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
              {/* Profile card */}
              <div className="sport-card overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]" />
                <div className="px-4 pb-4 -mt-7">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} width={56} height={56} alt="" className="rounded-full border-3 border-[var(--surface)] border-2 shadow-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold text-xl border-2 border-[var(--surface)] shadow-lg"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {user?.displayName?.[0] || "?"}
                    </div>
                  )}
                  <p className="font-bold text-white mt-2 text-sm"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {user?.displayName || "Athlete"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                  <div className="flex justify-between mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                    <div><p className="text-white font-bold text-base">{posts.filter(p => p.authorId === user?.uid).length}</p><p>Posts</p></div>
                    <div><p className="text-white font-bold text-base">{users.length}</p><p>Network</p></div>
                  </div>
                  <Link href="/profile" className="btn-sport-ghost text-xs px-4 py-1.5 mt-3 w-full block text-center">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Quick links */}
              <div className="sport-card p-4 space-y-1">
                {[
                  { label: "My Connections", href: "/connections" },
                  { label: "Messages", href: "/message" },
                  { label: "Coaching", href: "/coaching" },
                ].map(l => (
                  <Link key={l.label} href={l.href}
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </aside>

            {/* ── Main Feed ── */}
            <main className="flex-1 min-w-0 space-y-4">
              {/* Title + Tabs */}
              <div className="flex items-center gap-2">
                <HiLightningBolt className="text-[var(--primary)] text-xl" />
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-2xl font-bold uppercase tracking-widest text-white">
                  Sports <span className="text-[var(--primary)]">Feed</span>
                </h1>
              </div>

              <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === tab.key
                      ? "bg-[var(--primary)] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]"
                      : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Create Post */}
              {user && <CreatePostBox user={user} sport={activeTab === "All" ? "All" : activeTab} />}

              {/* Posts */}
              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <div className="sport-card p-12 text-center text-[var(--text-muted)]">
                    <HiLightningBolt className="text-5xl mx-auto mb-3 text-[var(--primary)] opacity-40" />
                    <p className="text-lg font-semibold text-[var(--text-secondary)]">No posts yet</p>
                    <p className="text-sm mt-1">Be the first to share something!</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} user={user} />
                  ))
                )}
              </AnimatePresence>
            </main>

            {/* ── Right Sidebar ── */}
            <aside className="hidden xl:block w-64 flex-shrink-0 space-y-4">
              {/* Suggested users */}
              {suggestedUsers.length > 0 && (
                <div className="sport-card p-4">
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-sm font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                    <GiMedal className="text-[var(--primary)]" /> People You May Know
                  </h3>
                  <div className="space-y-3">
                    {suggestedUsers.map(u => (
                      <div key={u.uid} className="flex items-center gap-2.5">
                        {u.photoURL ? (
                          <Image src={u.photoURL} alt={u.displayName} width={36} height={36} className="rounded-full border border-[var(--primary)] object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {u.displayName?.[0] || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{u.displayName}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                        </div>
                        <Link href="/connections" className="text-xs text-[var(--primary)] border border-[var(--primary)] px-2 py-1 rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors whitespace-nowrap flex-shrink-0">
                          + Connect
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link href="/connections" className="block text-center text-xs text-[var(--primary)] hover:underline mt-3">
                    See all →
                  </Link>
                </div>
              )}

              {/* Post stats */}
              <div className="sport-card p-4">
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-sm font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                  <GiTrophy className="text-[var(--primary)]" /> Feed Stats
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Total Posts", value: posts.length },
                    { label: "Your Posts", value: posts.filter(p => p.authorId === user?.uid).length },
                    { label: "Athletes Here", value: users.length + 1 },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">{s.label}</span>
                      <span className="font-bold text-[var(--primary)]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
