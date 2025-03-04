"use server";
import * as admin from "firebase-admin";

class FirebaseAdmin {
  static initializeApp() {
    if (!admin.apps.length) {
      try {
        // Decode the base64 string to JSON
        const serviceAccount = JSON.parse(
          Buffer.from(
            process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
            "base64"
          ).toString()
        );

        // Initialize the Firebase Admin SDK
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id, // Ensure this property exists in your service account JSON
        });

        console.log("Firebase Admin initialized successfully!");
      } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        throw error; // Handle the error appropriately
      }
    }
  }
}

export default FirebaseAdmin;



