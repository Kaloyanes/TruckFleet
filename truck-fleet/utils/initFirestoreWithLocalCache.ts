import { CACHE_SIZE_UNLIMITED, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';


export default async () => {
  let app = useFirebaseApp();

  let store = initializeFirestore(app, {
    localCache: persistentLocalCache(
      {
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      },
    ),
  });

  console.log(store);

}
