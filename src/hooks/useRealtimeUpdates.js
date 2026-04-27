import { useState, useEffect } from "react";
import { onSnapshot, doc, collection, query as firestoreQuery } from "firebase/firestore";
import { db } from "../config/firebase";

export const useRealtimeUpdates = (path, queryConstraints = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      if (path.split('/').length % 2 === 0) {
        // Document path
        unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
          setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
          setLoading(false);
        });
      } else {
        // Collection path
        const q = firestoreQuery(collection(db, path), ...queryConstraints);
        unsubscribe = onSnapshot(q, (snapshot) => {
          setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }

    return () => unsubscribe && unsubscribe();
  }, [path]);

  return { data, loading, error };
};
