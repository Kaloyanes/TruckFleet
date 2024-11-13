import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import useProfileDoc from "./useProfileDoc";

export default function useCompanyId() {
  const [user] = useAuthState(auth);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { profile, loading: profileLoading } = useProfileDoc();

  useEffect(() => {
    if (!profile || !user) return;

    if (profile.type === "company") {
      setCompanyId(user.uid);
    } else if (profile.companyId) {
      setCompanyId(profile.companyId);
    } else {
      setCompanyId(null);
    }
  }, [profile, user]);

  return {
    companyId,
    isLoading: profileLoading,
    error:
      !companyId && !profileLoading ? new Error("No company ID found") : null,
    debug: { profile, user },
  };
}
