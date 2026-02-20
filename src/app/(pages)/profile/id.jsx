"use client";

import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id;

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    about: "",
    profilePicUrl: "",
    socialLinks: {
      linkedin: "",
      instagram: "",
      twitter: "",
      cricprofile: ""
    },
    achievements: [],
    games: { outdoor: [], indoor: [], esports: [] }
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/profile/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setProfile(data.profile);
          setForm(data.profile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setProfile(null);
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSocialChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  }

  // Simple save function
  async function handleSave() {
    const res = await fetch(`/api/profile/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setProfile(form);
      setEditMode(false);
    } else {
      alert("Error saving profile");
    }
  }

  // Upload profile pic handler
  async function handleFileChange(e) {
    if (!storage) {
      alert("Firebase Storage is not configured");
      return;
    }
    
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profilePics/${id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm(prev => ({ ...prev, profilePicUrl: url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>User not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-[var(--surface)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{form.name || "No Name"}</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-hover)] transition-colors"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <img
          src={form.profilePicUrl || "/default-avatar.png"}
          alt="Profile Picture"
          className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
        />
        {editMode && (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
      </div>

      {editMode ? (
        <>
          <label className="block mb-3">
            Name:
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] p-2 rounded bg-[var(--background)] text-[var(--text-primary)]"
            />
          </label>
          <label className="block mb-3">
            Title:
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] p-2 rounded bg-[var(--background)] text-[var(--text-primary)]"
            />
          </label>
          <label className="block mb-3">
            Location:
            <input
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] p-2 rounded bg-[var(--background)] text-[var(--text-primary)]"
            />
          </label>
          <label className="block mb-3">
            About:
            <textarea
              name="about"
              value={form.about || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] p-2 rounded bg-[var(--background)] text-[var(--text-primary)]"
              rows={4}
            />
          </label>

          {/* Social links */}
          <h3 className="font-semibold mt-4 mb-2">Social Links</h3>
          {["linkedin", "instagram", "twitter", "cricprofile"].map((site) => (
            <label key={site} className="block mb-2">
              {site.charAt(0).toUpperCase() + site.slice(1)}:
              <input
                name={site}
                value={form.socialLinks?.[site] || ""}
                onChange={handleSocialChange}
                className="w-full border border-[var(--border)] p-2 rounded bg-[var(--background)] text-[var(--text-primary)]"
              />
            </label>
          ))}

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-[var(--success)] text-white rounded hover:opacity-90 transition"
          >
            Save Profile
          </button>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold">{form.title}</p>
          <p className="mb-4">{form.location}</p>
          <p className="mb-6">{form.about}</p>
          <div className="mb-6">
            <h3 className="font-semibold">Social Links:</h3>
            <ul className="list-disc ml-5 text-[var(--primary)]">
              {Object.entries(form.socialLinks || {}).map(([key, val]) =>
                val ? (
                  <li key={key}>
                    <a href={val} target="_blank" rel="noopener noreferrer">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
