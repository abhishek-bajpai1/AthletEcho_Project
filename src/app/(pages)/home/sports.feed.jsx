import { useState } from "react";

const sportsFeedData = {
  indoor: [
    {
      id: 1,
      user: "Ritika Sharma",
      content: "Just smashed my personal best in badminton 🏸",
      likes: 5,
      comments: ["Great job!", "Where did you play?"],
    },
  ],
  outdoor: [
    {
      id: 2,
      user: "Rahul Mehta",
      content: "Early morning run at 6 AM 🌅 #fitness",
      likes: 8,
      comments: ["Respect!", "Keep it up!"],
    },
  ],
  esports: [
    {
      id: 3,
      user: "Ankur Jain",
      content: "Top 1% in Valorant leaderboard! 🕹️",
      likes: 10,
      comments: ["Cracked!", "Need tips bro!"],
    },
  ],
};

export default function SportsFeed() {
  const [activeTab, setActiveTab] = useState("indoor");
  const [feeds, setFeeds] = useState(sportsFeedData);

  const handleLike = (id) => {
    const updated = { ...feeds };
    updated[activeTab] = updated[activeTab].map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setFeeds(updated);
  };

  const handleComment = (id, comment) => {
    const updated = { ...feeds };
    updated[activeTab] = updated[activeTab].map((post) =>
      post.id === id
        ? { ...post, comments: [...post.comments, comment] }
        : post
    );
    setFeeds(updated);
  };

  return (
    <div className="min-h-screen bg-[url('/sporty-bg.jpg')] bg-cover bg-center p-6 text-white">
      <div className="bg-black/60 p-4 rounded-xl max-w-4xl mx-auto shadow-2xl">
        <div className="flex justify-center gap-6 mb-6 text-lg font-semibold">
          {["indoor", "outdoor", "esports"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === type ? "bg-[var(--primary)]" : "bg-[var(--surface-elevated)] hover:bg-[var(--surface)]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {feeds[activeTab].map((post) => (
          <div
            key={post.id}
            className="bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-lg p-4 mb-6 shadow-md border border-[var(--border)]"
          >
            <div className="font-bold text-lg">{post.user}</div>
            <div className="text-[var(--text-secondary)] my-2">{post.content}</div>
            <div className="flex items-center gap-4 text-sm mt-3">
              <button
                onClick={() => handleLike(post.id)}
                className="text-[var(--primary)] hover:underline"
              >
                ❤️ {post.likes}
              </button>
              <span>💬 {post.comments.length} Comments</span>
            </div>

            <ul className="mt-2 ml-4 text-sm text-[var(--text-muted)] list-disc">
              {post.comments.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const comment = e.target.comment.value.trim();
                if (comment) {
                  handleComment(post.id, comment);
                  e.target.reset();
                }
              }}
            >
              <input
                type="text"
                name="comment"
                placeholder="Write a comment..."
                className="w-full mt-1 p-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)]"
              />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
