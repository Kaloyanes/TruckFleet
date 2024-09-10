import { auth, db } from "@/firebase/firebase";
import type { User } from "firebase/auth";
import { doc, type DocumentReference } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function useCompanyId() {
  const [user] = useAuthState(auth);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyRef, setCompanyRef] = useState<DocumentReference | null>(null);

  const userRef = user ? doc(db, "users", user.uid) : null;
  const [docValue] = useDocumentData(userRef);

  useEffect(() => {
    if (docValue) {
      if (docValue.type === "company") {
        setCompanyId(docValue.id);
        setCompanyRef(doc(db, "users", docValue.id));
      } else {
        setCompanyId(docValue.companyId);
        setCompanyRef(doc(db, "users", docValue.companyId));
      }
    }
  }, [docValue]);

  return { companyId, companyRef };
}
