#!/usr/bin/env node
/**
 * Grant (or revoke) the `admin: true` custom claim by email.
 *
 * This is how the FIRST admin is created - the claim can't be set from the
 * client, only via the Admin SDK. firestore.rules trusts this claim.
 *
 * Setup:
 *   1. Firebase Console → Project settings → Service accounts
 *      → "Generate new private key" → save as serviceAccountKey.json
 *      in this folder (git-ignored - NEVER commit it).
 *   2. cd firebase-admin-scripts && npm install
 *
 * Usage:
 *   node assignRole.js you@gmail.com            # grant admin
 *   node assignRole.js you@gmail.com --revoke   # revoke admin
 *
 * The user must have signed in to the site at least once (so the Auth user
 * exists). After granting, they must sign out and back in to refresh the
 * ID token that carries the claim.
 */
const admin = require("firebase-admin");
const path = require("path");

const email = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!email || !email.includes("@")) {
  console.error("Usage: node assignRole.js <email> [--revoke]");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
} catch {
  console.error(
    "Missing serviceAccountKey.json in firebase-admin-scripts/.\n" +
      "Download it from Firebase Console → Project settings → Service accounts."
  );
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, revoke ? { admin: null } : { admin: true });
    console.log(
      `${revoke ? "Revoked admin from" : "Granted admin to"} ${email} (uid: ${user.uid}).`
    );
    console.log("They must sign out and back in for the new token to take effect.");
    process.exit(0);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      console.error(
        `No Auth user for ${email}. They must sign in to the site once first.`
      );
    } else {
      console.error("Failed:", err.message);
    }
    process.exit(1);
  }
})();
