import Image from "next/image";
import { MdOutlineMessage } from "react-icons/md";
import { SlLike } from "react-icons/sl";
export default function PostCard({ post }) {
  return (
    <div className="bg-[var(--surface-elevated)] shadow-xl rounded-2xl p-4 border border-[var(--border)]">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
          {/* If post had an avatar, we would put it here */}
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{post.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{post.role}</p>
        </div>
      </div>
      <p className="text-[var(--text-secondary)]">{post.content}</p>
      <div className="flex justify-center my-4">
        {post.image && (
          <Image
            src={post.image}
            alt="Post"
            width={600}
            height={400}
            className="rounded-md object-cover"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </div>
      <div className="flex items-center space-x-4 text-2xl cursor-pointer text-[var(--primary)] hover:text-[var(--primary-hover)]">
        <SlLike />
        <MdOutlineMessage />
      </div>
    </div>
  );
}
