import { collection, doc } from "@firebase/firestore";

export const useProfileDoc = () => {
  let user = useCurrentUser();
  let db = useFirestore();
  let profileDoc =
    useDocument(doc(collection(db, 'users'), `${user.value?.uid}`));

  return {
    promise: profileDoc.promise,
    data: profileDoc.data,
    error: profileDoc.error,
    loading: profileDoc.pending,
  };

}
