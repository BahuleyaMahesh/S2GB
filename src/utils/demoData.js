import { collection, addDoc, getDocs, query, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const demoIncidents = [
  {
    reporterName: "Rajesh Kumar",
    incidentType: "fire",
    severity: "critical",
    location: { latitude: 28.6139, longitude: 77.2090, address: "Connaught Place, New Delhi" },
    description: "Major fire in a commercial building. Smoke visible from miles away.",
    structuredData: { title: "CP Commercial Fire", priority: 10, requiredServices: ["Fire Brigade", "Police"] },
    status: "open",
    reportsCount: 1
  },
  {
    reporterName: "Anjali Sharma",
    incidentType: "medical",
    severity: "high",
    location: { latitude: 19.0760, longitude: 72.8777, address: "Dharavi, Mumbai" },
    description: "Person collapsed, possibly heatstroke. Need ambulance immediately.",
    structuredData: { title: "Medical Emergency - Mumbai", priority: 9, requiredServices: ["Ambulance"] },
    status: "in-progress",
    assignedTo: "resp_001"
  },
  {
    reporterName: "Amit Patel",
    incidentType: "accident",
    severity: "medium",
    location: { latitude: 12.9716, longitude: 77.5946, address: "MG Road, Bengaluru" },
    description: "Two-car collision near the metro station, blocking traffic.",
    structuredData: { title: "Traffic Accident - Bengaluru", priority: 6, requiredServices: ["Police", "Tow Truck"] },
    status: "open"
  },
  {
    reporterName: "Sonia Singh",
    incidentType: "hazmat",
    severity: "critical",
    location: { latitude: 28.5355, longitude: 77.3910, address: "Noida Sector 62" },
    description: "Strange chemical smell near the industrial area. People are coughing.",
    structuredData: { title: "Potential Hazmat Leak - Noida", priority: 10, requiredServices: ["Hazmat Team", "Fire Brigade"] },
    status: "open"
  },
  {
    reporterName: "Vikram Malhotra",
    incidentType: "medical",
    severity: "low",
    location: { latitude: 28.6500, longitude: 77.2300, address: "Chandni Chowk, Delhi" },
    description: "Minor bicycle accident. Person seems okay but shaken.",
    structuredData: { title: "Minor Bike Accident", priority: 3, requiredServices: ["First Aid"] },
    status: "resolved"
  },
  // Adding more Indian locations
  { incidentType: "medical", severity: "high", location: { latitude: 28.6120, longitude: 77.2100 }, description: "Heat exhaustion case near India Gate.", status: "open" },
  { incidentType: "accident", severity: "medium", location: { latitude: 28.6200, longitude: 77.2000 }, description: "Rickshaw collision on Janpath.", status: "resolved" },
  { incidentType: "fire", severity: "low", location: { latitude: 28.6300, longitude: 77.2200 }, description: "Small kitchen fire in Karol Bagh.", status: "resolved" },
  { incidentType: "other", severity: "medium", location: { latitude: 28.6400, longitude: 77.2300 }, description: "Water pipe burst in Old Delhi.", status: "open" },
  { incidentType: "medical", severity: "high", location: { latitude: 28.6000, longitude: 77.1900 }, description: "Heart attack reported in Chanakyapuri.", status: "in-progress" }
];

export const initializeDemoData = async () => {
  try {
    const q = query(collection(db, "incidents"), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("Populating Firestore with demo data...");
      for (const incident of demoIncidents) {
        await addDoc(collection(db, "incidents"), {
          ...incident,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userConsent: true,
          responses: []
        });
      }
      console.log("Demo data populated successfully.");
    }
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
};
