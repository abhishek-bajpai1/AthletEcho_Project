/**
 * Firebase Firestore Connections Utilities
 *
 * Firestore structure:
 *   connections/{connId}  → where connId = [uid1, uid2].sort().join("_")
 *     { participants: [uid1, uid2], status: 'pending'|'accepted', requestedBy: uid, createdAt, updatedAt }
 *
 * Status flow:
 *   no doc         → no connection (show "Follow/Connect" button)
 *   status=pending, requestedBy=me  → I sent the request (pending)
 *   status=pending, requestedBy=them → they sent me request (in my Invitations)
 *   status=accepted → connected (show in My Connections)
 */

import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Deterministic connection document ID */
export function getConnId(uid1, uid2) {
    return [uid1, uid2].sort().join("_");
}

/** Send a connection request */
export async function sendConnectionRequest(fromUid, toUid) {
    if (!db) return;
    const connId = getConnId(fromUid, toUid);
    await setDoc(doc(db, "connections", connId), {
        participants: [fromUid, toUid],
        status: "pending",
        requestedBy: fromUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

/** Accept a connection request */
export async function acceptConnectionRequest(fromUid, toUid) {
    if (!db) return;
    const connId = getConnId(fromUid, toUid);
    await updateDoc(doc(db, "connections", connId), {
        status: "accepted",
        updatedAt: serverTimestamp(),
    });
}

/** Remove / ignore / cancel a connection */
export async function removeConnection(uid1, uid2) {
    if (!db) return;
    const connId = getConnId(uid1, uid2);
    await deleteDoc(doc(db, "connections", connId));
}

/**
 * Subscribe to all connections involving a user.
 * Returns an unsubscribe function.
 * callback receives: { connId, status, requestedBy, participants, otherUid }[]
 */
export function subscribeToMyConnections(uid, callback) {
    if (!db) return () => { };
    const q = query(
        collection(db, "connections"),
        where("participants", "array-contains", uid)
    );
    return onSnapshot(q, (snap) => {
        const conns = snap.docs.map((d) => {
            const data = d.data();
            const otherUid = data.participants.find((id) => id !== uid);
            return { connId: d.id, otherUid, ...data };
        });
        callback(conns);
    });
}
