import { auth, db } from "@/firebase/firebase";
import type { User } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function useCompanyId() {
  const [user] = useAuthState(auth);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const companyRef = user ? doc(db, "users", user.uid) : null;
  const [docValue] = useDocumentData(companyRef);

  useEffect(() => {
    if (docValue) {
      if (docValue.type === "company") {
        setCompanyId(docValue.id);
      } else {
        setCompanyId(docValue.companyId);
      }
    }
  }, [docValue]);

  return companyId;
}
