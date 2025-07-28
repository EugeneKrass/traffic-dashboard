const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Helper function to verify Firebase Auth ID token
const verifyToken = async (req) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    throw new Error("No token provided");
  }
  return await admin.auth().verifyIdToken(token);
};

// Helper function to check user role (optional bonus feature)
const checkUserRole = async (uid, email) => {
  // Example role-based access control
  // You can implement this based on your requirements
  // For demo purposes, we'll use email domain or specific UIDs

  // Admins/Editors - can create, update, delete
  const editorEmails = ["admin@gmail.com", "test@gmail.com"];
  const editorUIDs = ["gaU0aUDrUZNhNkObHUAKCMhpcIw2", "EczgN4Ww1LMQVXFs6PcHWy4a4gj1"];

  if (editorEmails.includes(email) || editorUIDs.includes(uid)) {
    return "editor";
  }

  // Everyone else is a viewer
  return "viewer";
};

// Main API endpoint
exports.api = functions.region("europe-west1").https.onRequest((req, res) => {
  const path = req.path.replace(/^\/+|\/+$/g, "");
  const pathParts = path.split("/");

  // Handle CORS
  cors(req, res, async () => {
    try {
      // Verify authentication
      const decodedToken = await verifyToken(req);
      const userRole = await checkUserRole(
        decodedToken.uid,
        decodedToken.email
      );

      // Route handling
      if (pathParts[0] === "traffic") {
        if (pathParts.length === 1) {
          // /traffic
          switch (req.method) {
            case "GET":
              await handleGetTraffic(req, res);
              break;
            case "POST":
              if (userRole === "viewer") {
                return res
                  .status(403)
                  .json({ error: "Insufficient permissions" });
              }
              await handleCreateTraffic(req, res);
              break;
            default:
              res.status(405).json({ error: "Method not allowed" });
          }
        } else if (pathParts.length === 2) {
          // /traffic/:id
          const id = pathParts[1];
          switch (req.method) {
            case "PUT":
              if (userRole === "viewer") {
                return res
                  .status(403)
                  .json({ error: "Insufficient permissions" });
              }
              await handleUpdateTraffic(req, res, id);
              break;
            case "DELETE":
              if (userRole === "viewer") {
                return res
                  .status(403)
                  .json({ error: "Insufficient permissions" });
              }
              await handleDeleteTraffic(req, res, id);
              break;
            default:
              res.status(405).json({ error: "Method not allowed" });
          }
        } else {
          res.status(404).json({ error: "Not found" });
        }
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message === "No token provided") {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
});

// GET all traffic entries
async function handleGetTraffic(req, res) {
  try {
    const snapshot = await db
      .collection("trafficStats")
      .orderBy("date", "asc")
      .get();

    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// POST new traffic entry
async function handleCreateTraffic(req, res) {
  try {
    const { date, visits } = req.body;

    // Validate input
    if (!date || visits === undefined) {
      return res.status(400).json({ error: "Date and visits are required" });
    }

    if (typeof visits !== "number" || visits < 0) {
      return res
        .status(400)
        .json({ error: "Visits must be a positive number" });
    }

    // Check if date already exists
    const existing = await db
      .collection("trafficStats")
      .where("date", "==", date)
      .get();

    if (!existing.empty) {
      return res
        .status(409)
        .json({ error: "Entry for this date already exists" });
    }

    // Create new entry
    const docRef = await db.collection("trafficStats").add({
      date,
      visits,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      id: docRef.id,
      date,
      visits,
    });
  } catch (error) {
    console.error("Error creating traffic entry:", error);
    res.status(500).json({ error: "Failed to create entry" });
  }
}

// PUT update traffic entry
async function handleUpdateTraffic(req, res, id) {
  try {
    const { date, visits } = req.body;

    // Validate input
    if (!date || visits === undefined) {
      return res.status(400).json({ error: "Date and visits are required" });
    }

    if (typeof visits !== "number" || visits < 0) {
      return res
        .status(400)
        .json({ error: "Visits must be a positive number" });
    }

    // Check if document exists
    const docRef = db.collection("trafficStats").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Update entry
    await docRef.update({
      date,
      visits,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      id,
      date,
      visits,
    });
  } catch (error) {
    console.error("Error updating traffic entry:", error);
    res.status(500).json({ error: "Failed to update entry" });
  }
}

// DELETE traffic entry
async function handleDeleteTraffic(req, res, id) {
  try {
    // Check if document exists
    const docRef = db.collection("trafficStats").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Delete entry
    await docRef.delete();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting traffic entry:", error);
    res.status(500).json({ error: "Failed to delete entry" });
  }
}

// Optional: Function to seed initial data
exports.seedData = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const decodedToken = await verifyToken(req);
        const userRole = await checkUserRole(
          decodedToken.uid,
          decodedToken.email
        );

        if (userRole !== "editor") {
          return res.status(403).json({ error: "Insufficient permissions" });
        }

        const seedData = [
          { date: "2025-03-01", visits: 120 },
          { date: "2025-03-02", visits: 140 },
          { date: "2025-03-03", visits: 98 },
          { date: "2025-03-04", visits: 132 },
          { date: "2025-03-05", visits: 101 },
          { date: "2025-03-06", visits: 87 },
          { date: "2025-03-07", visits: 94 },
          { date: "2025-03-08", visits: 178 },
          { date: "2025-03-09", visits: 164 },
          { date: "2025-03-10", visits: 112 },
          { date: "2025-03-11", visits: 106 },
          { date: "2025-03-12", visits: 133 },
          { date: "2025-03-13", visits: 90 },
          { date: "2025-03-14", visits: 124 },
          { date: "2025-03-15", visits: 110 },
          { date: "2025-03-16", visits: 175 },
          { date: "2025-03-17", visits: 188 },
          { date: "2025-03-18", visits: 147 },
          { date: "2025-03-19", visits: 133 },
          { date: "2025-03-20", visits: 119 },
          { date: "2025-03-21", visits: 102 },
          { date: "2025-03-22", visits: 111 },
          { date: "2025-03-23", visits: 154 },
          { date: "2025-03-24", visits: 162 },
          { date: "2025-03-25", visits: 120 },
          { date: "2025-03-26", visits: 108 },
          { date: "2025-03-27", visits: 113 },
          { date: "2025-03-28", visits: 95 },
          { date: "2025-03-29", visits: 142 },
          { date: "2025-03-30", visits: 170 },
          { date: "2025-03-31", visits: 128 },
          { date: "2025-04-01", visits: 105 },
          { date: "2025-04-02", visits: 87 },
          { date: "2025-04-03", visits: 156 },
          { date: "2025-04-04", visits: 131 },
          { date: "2025-04-05", visits: 122 },
          { date: "2025-04-06", visits: 149 },
          { date: "2025-04-07", visits: 95 },
          { date: "2025-04-08", visits: 143 },
          { date: "2025-04-09", visits: 137 },
          { date: "2025-04-10", visits: 128 },
          { date: "2025-04-11", visits: 109 },
          { date: "2025-04-12", visits: 117 },
          { date: "2025-04-13", visits: 138 },
          { date: "2025-04-14", visits: 160 },
          { date: "2025-04-15", visits: 151 },
          { date: "2025-04-16", visits: 100 },
          { date: "2025-04-17", visits: 134 },
          { date: "2025-04-18", visits: 141 },
          { date: "2025-04-19", visits: 108 },
          { date: "2025-04-20", visits: 157 },
          { date: "2025-04-21", visits: 120 },
          { date: "2025-04-22", visits: 99 },
          { date: "2025-04-23", visits: 126 },
          { date: "2025-04-24", visits: 153 },
          { date: "2025-04-25", visits: 115 },
          { date: "2025-04-26", visits: 130 },
          { date: "2025-04-27", visits: 98 },
          { date: "2025-04-28", visits: 118 },
          { date: "2025-04-29", visits: 167 },
          { date: "2025-04-30", visits: 148 },
        ];

        const batch = db.batch();

        for (const item of seedData) {
          const docRef = db.collection("trafficStats").doc();
          batch.set(docRef, {
            ...item,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        await batch.commit();

        res.status(200).json({
          message: "Data seeded successfully",
          count: seedData.length,
        });
      } catch (error) {
        console.error("Error seeding data:", error);
        res.status(500).json({ error: "Failed to seed data" });
      }
    });
  });
