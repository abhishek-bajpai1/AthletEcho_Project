"use client";

import { useRef, useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";

export default function Settings() {
  // Initial user data (can be fetched from API or DB in real app)
  const initialUser = {
    name: "Abhishek Bajpai",
    title: "Professional Cricketer · All-Rounder",
    location: "Bengaluru, India",
    about:
      "A passionate cricketer with 7+ years of experience playing at district and state levels. Known for consistent batting performance and agile fielding. Represented Karnataka U23 and currently playing for CodeDploy Warriors League Team.",
    linkedin: "https://www.linkedin.com/in/abhibajpai",
    instagram: "https://www.instagram.com/abhi_cricketer",
    twitter: "https://twitter.com/abhi_sports",
    cricprofile: "https://www.cricprofile.com/abhi",
    avatarUrl: "/avatar.jpg",
  };

  const [user, setUser] = useState(initialUser);
  const [editedUser, setEditedUser] = useState(initialUser);
  const [avatarPreview, setAvatarPreview] = useState(initialUser.avatarUrl);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  // Cancel editing - reset to initial user data
  const handleCancel = () => {
    setEditedUser(user);
    setAvatarPreview(user.avatarUrl);
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Simulate saving (e.g. call API here)
  const handleSave = () => {
    // In real app, upload avatarFile and update user info in DB
    setUser(editedUser);
    if (avatarFile) {
      // Simulate avatar URL update by using preview URL
      setUser((prev) => ({ ...prev, avatarUrl: avatarPreview }));
    }
    setAvatarFile(null);
    setIsEditing(false);
    alert("Settings saved!");
  };

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 bg-[var(--surface)] rounded-2xl shadow-lg font-sans min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-[var(--primary)]">Profile Settings</h1>

        {/* Avatar Upload */}
        <div className="flex items-center space-x-6 mb-8">
          <div
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${avatarPreview})` }}
            onClick={() => fileInputRef.current.click()}
            title="Click to change avatar"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-[var(--text-muted)]">Click on avatar to upload new image</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-semibold text-[var(--text-primary)] mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={editedUser.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-semibold text-[var(--text-primary)] mb-1">
              Profession / Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={editedUser.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block font-semibold text-[var(--text-primary)] mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={editedUser.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
            />
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block font-semibold text-[var(--text-primary)] mb-1">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              rows={4}
              value={editedUser.about}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block font-semibold text-[var(--text-primary)] mb-1">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={editedUser.linkedin}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block font-semibold text-[var(--text-primary)] mb-1">
                Instagram URL
              </label>
              <input
                id="instagram"
                name="instagram"
                type="url"
                value={editedUser.instagram}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block font-semibold text-[var(--text-primary)] mb-1">
                Twitter URL
              </label>
              <input
                id="twitter"
                name="twitter"
                type="url"
                value={editedUser.twitter}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label htmlFor="cricprofile" className="block font-semibold text-[var(--text-primary)] mb-1">
                CricProfile URL
              </label>
              <input
                id="cricprofile"
                name="cricprofile"
                type="url"
                value={editedUser.cricprofile}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="https://cricprofile.com/username"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!isEditing}
              className="px-6 py-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isEditing}
              className="px-6 py-2 rounded-full bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Save
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
