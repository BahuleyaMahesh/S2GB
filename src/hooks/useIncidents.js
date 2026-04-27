import { useState, useEffect } from "react";
import { subscribeToIncidents, addIncident, updateIncident } from "../services/firestoreService";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = subscribeToIncidents((data) => {
        setIncidents(data);
        setLoading(false);
      });
    } catch (err) {
      console.error("useIncidents error:", err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { incidents, loading, error, addIncident, updateIncident };
};
