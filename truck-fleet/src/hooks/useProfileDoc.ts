import { auth, db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function useProfileDoc(userId?: string) {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any | null>(null);
  const [promiseResolve, setPromiseResolve] = useState<
    ((value: any) => void) | null
  >(null);
  const [profilePromise] = useState<Promise<any>>(
    () => new Promise((resolve) => setPromiseResolve(() => resolve)),
  );

  const profileRef = user ? doc(db, "users", userId ?? user.uid) : null;
  const [profileData, loading, error] = useDocumentData(profileRef);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      if (promiseResolve) {
        promiseResolve(profileData);
      }
    }
  }, [profileData, promiseResolve]);

  return { profile, loading, error, profilePromise };
}
