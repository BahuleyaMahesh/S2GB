import { FIREBASE_ENABLED, db } from "../config/firebase";
import { demoIncidents } from "../utils/demoData";
import {
  collection, addDoc, updateDoc, doc, getDocs,
  query, orderBy, onSnapshot, serverTimestamp, where
} from "firebase/firestore";

// Generate IDs for local demo incidents
const localDemoData = demoIncidents.map((inc, i) => ({
  ...inc,
  id: `demo-${i + 1}`,
  createdAt: { toDate: () => new Date(Date.now() - i * 1000 * 60 * 15) },
  updatedAt: { toDate: () => new Date() },
  responses: []
}));

let localIncidents = [...localDemoData];
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach(cb => cb([...localIncidents]));
};

export const addIncident = async (incidentData) => {
  if (!FIREBASE_ENABLED) {
    const newId = `local-${Date.now()}`;
    const newInc = {
      ...incidentData,
      id: newId,
      status: "open",
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
      responses: []
    };
    localIncidents = [newInc, ...localIncidents];
    notifyListeners();
    return newId;
  }

  const docRef = await addDoc(collection(db, "incidents"), {
    ...incidentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "open",
    responses: []
  });
  return docRef.id;
};

export const updateIncident = async (incidentId, updates) => {
  if (!FIREBASE_ENABLED) {
    localIncidents = localIncidents.map(inc =>
      inc.id === incidentId
        ? { ...inc, ...updates, updatedAt: { toDate: () => new Date() } }
        : inc
    );
    notifyListeners();
    return;
  }

  const docRef = doc(db, "incidents", incidentId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
};

export const getIncidents = async (filters = {}) => {
  if (!FIREBASE_ENABLED) return localIncidents;

  let q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToIncidents = (callback) => {
  if (!FIREBASE_ENABLED) {
    // Immediately call with local data
    callback([...localIncidents]);
    // Register for local updates
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(incidents);
  });
};

export const assignResponder = async (incidentId, responderId) => {
  await updateIncident(incidentId, { assignedTo: responderId, status: "in-progress" });
};

export const mergeDuplicates = async (originalId, duplicateIds) => {
  for (const dupId of duplicateIds) {
    await updateIncident(dupId, { status: "merged", duplicateOf: originalId });
  }
};
