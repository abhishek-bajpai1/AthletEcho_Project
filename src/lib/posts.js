/**
 * Firestore Posts Utilities
 *
 * Structure:
 *   posts/{postId}
 *     { authorId, authorName, authorPhoto, content, imageUrl, sport,
 *       createdAt, likedBy: [uid,...], commentCount }
 *
 *   posts/{postId}/comments/{commentId}
 *     { authorId, authorName, authorPhoto, text, createdAt }
 */

import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    arrayUnion, arrayRemove, increment,
    query, orderBy, limit, onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Upload image to Cloudinary (free tier — no Firebase Storage needed) */
async function uploadToCloudinary(imageFile) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local");
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Cloudinary upload failed");
    }
    const data = await res.json();
    return data.secure_url;
}


/** Create a new post — imageFile is optional. If upload fails, post goes through without image */
export async function createPost({ authorId, authorName, authorPhoto, content, sport, imageFile }) {
    if (!db) throw new Error("Firestore not initialized");
    let imageUrl = null;

    if (imageFile) {
        try {
            imageUrl = await uploadToCloudinary(imageFile);
        } catch (err) {
            console.error("[createPost] image upload failed:", err.message);
            throw Object.assign(new Error("IMAGE_UPLOAD_FAILED"), { cause: err });
        }
    }


    const docRef = await addDoc(collection(db, "posts"), {
        authorId,
        authorName,
        authorPhoto: authorPhoto || null,
        content,
        sport,
        imageUrl,
        likedBy: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/** Post text only (no image) — always works if Firestore rules allow */
export async function createTextPost({ authorId, authorName, authorPhoto, content, sport }) {
    if (!db) throw new Error("Firestore not initialized");
    const docRef = await addDoc(collection(db, "posts"), {
        authorId, authorName,
        authorPhoto: authorPhoto || null,
        content, sport,
        imageUrl: null,
        likedBy: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}


/** Toggle like on a post */
export async function toggleLike(postId, uid, currentlyLiked) {
    if (!db) return;
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, {
        likedBy: currentlyLiked ? arrayRemove(uid) : arrayUnion(uid),
    });
}

/** Delete a post */
export async function deletePost(postId) {
    if (!db) return;
    await deleteDoc(doc(db, "posts", postId));
}

/** Add a comment */
export async function addComment(postId, { authorId, authorName, authorPhoto, text }) {
    if (!db || !text.trim()) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
        authorId, authorName, authorPhoto: authorPhoto || null,
        text: text.trim(), createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", postId), { commentCount: increment(1) });
}

/** Subscribe to comments for a post */
export function subscribeToComments(postId, callback) {
    if (!db) return () => { };
    const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) =>
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
}

/** Subscribe to the main feed (last 30 posts, newest first) */
export function subscribeToFeed(callback) {
    if (!db) return () => { };
    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(30)
    );
    return onSnapshot(q, (snap) =>
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
}
