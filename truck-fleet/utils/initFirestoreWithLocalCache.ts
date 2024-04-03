import { CACHE_SIZE_UNLIMITED, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';


export default () => {
  let app = useFirebaseApp();
  let store = initializeFirestore(app, {
    localCache: persistentLocalCache(
      {
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      },

    ),
  });
}
