import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { NomadUser, UserProfile } from "../types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function syncUserProfile(profile: UserProfile) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}`;
  try {
    const nomadUser: NomadUser = {
      uid: auth.currentUser.uid,
      name: profile.name,
      interests: profile.interests,
      wealth: profile.wealth,
      updatedAt: Date.now(),
    };
    await setDoc(doc(db, "users", auth.currentUser.uid), nomadUser);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getNetworkUsers(): Promise<NomadUser[]> {
  const path = 'users';
  try {
    const q = query(collection(db, "users"), orderBy("updatedAt", "desc"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as NomadUser);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToNetwork(callback: (users: NomadUser[]) => void) {
  const q = query(collection(db, "users"), orderBy("updatedAt", "desc"), limit(20));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as NomadUser));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'users');
  });
}
