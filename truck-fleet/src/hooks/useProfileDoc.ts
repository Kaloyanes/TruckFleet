import { auth, db } from "@/firebase/firebase";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

export default function useProfileDoc(userId?: string) {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any | null>(null); // Adjust type according to your profile structure

  const profileRef = user ? doc(db, "users", userId ?? user.uid) : null;
  const [profileData, loading, error] = useDocumentData(profileRef);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  return { profile, loading, error };
}
