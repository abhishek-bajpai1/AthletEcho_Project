/**
 * Firebase Firestore Chat Utilities
 *
 * Firestore structure:
 *   users/{uid}                     → { uid, displayName, photoURL, email, online, lastSeen }
 *   conversations/{convId}          → { participants: [uid1, uid2], lastMessage, lastTime, createdAt }
 *   conversations/{convId}/messages/{msgId} → { senderId, text, time, read }
 *
 * convId is deterministic: sorted [uid1, uid2].join("_")
 */

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Create or update the current user's profile in Firestore */
export async function upsertUserProfile(user) {
    if (!db || !user?.uid) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(
        ref,
        {
            uid: user.uid,
            displayName: user.displayName || "Athlete",
            photoURL: user.photoURL || null,
            email: user.email || null,
            online: true,
            lastSeen: serverTimestamp(),
        },
        { merge: true }
    );
}

/** Mark user offline */
export async function setUserOffline(uid) {
    if (!db || !uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { online: false, lastSeen: serverTimestamp() });
}

/** Fetch all users except the current user */
export async function fetchOtherUsers(currentUid) {
    if (!db) return [];
    const q = query(collection(db, "users"), where("uid", "!=", currentUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
}

/** Subscribe to all other users in real time */
export function subscribeToUsers(currentUid, callback) {
    if (!db) return () => { };
    const q = query(collection(db, "users"), where("uid", "!=", currentUid));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => d.data()));
    });
}

/** Get or create a conversation between two users */
export async function getOrCreateConversation(uid1, uid2) {
    if (!db) return null;
    const convId = [uid1, uid2].sort().join("_");
    const ref = doc(db, "conversations", convId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, {
            participants: [uid1, uid2],
            lastMessage: "",
            lastTime: serverTimestamp(),
            createdAt: serverTimestamp(),
        });
    }
    return convId;
}

/** Subscribe to conversations the current user is part of */
export function subscribeToConversations(uid, callback) {
    if (!db) return () => { };
    const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", uid),
        orderBy("lastTime", "desc")
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}

/** Subscribe to real-time messages in a conversation */
export function subscribeToMessages(convId, callback) {
    if (!db || !convId) return () => { };
    const q = query(
        collection(db, "conversations", convId, "messages"),
        orderBy("time", "asc")
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}

/** Send a message */
export async function sendMessage(convId, senderId, text) {
    if (!db || !convId || !text.trim()) return;
    const msgRef = collection(db, "conversations", convId, "messages");
    await addDoc(msgRef, {
        senderId,
        text: text.trim(),
        time: serverTimestamp(),
        read: false,
    });
    // Update conversation metadata
    const convRef = doc(db, "conversations", convId);
    await updateDoc(convRef, {
        lastMessage: text.trim(),
        lastTime: serverTimestamp(),
    });
}

/** Mark all messages in a conversation as read for a user */
export async function markMessagesRead(convId, currentUid) {
    if (!db || !convId) return;
    const q = query(
        collection(db, "conversations", convId, "messages"),
        where("read", "==", false),
        where("senderId", "!=", currentUid)
    );
    const snap = await getDocs(q);
    const updates = snap.docs.map((d) => updateDoc(d.ref, { read: true }));
    await Promise.all(updates);
}
