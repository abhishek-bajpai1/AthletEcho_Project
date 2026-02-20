import PostCard from "./postcard";

const posts = [
  {
    id: 1,
    name: "Jane Smith",
    role: "UI/UX Designer",
    content: "Excited to share my new project with you all!",
    image: "/assets/home_img0.jpg", // ✅ fixed spelling of "assets"
  },
  {
    id: 2,
    name: "John Doe",
    role: "Software Engineer",
    content: "Just finished an awesome sprint with the team!",
    image: "/assets/home_img1.jpg", // ✅ fixed spelling
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] p-6 md:p-10 flex flex-wrap gap-6 justify-center">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
