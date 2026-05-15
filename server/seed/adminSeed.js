require("dotenv").config();
const connectDB = require("../config/db");
const { auth } = require("../config/firebase");
const User = require("../api/user/userModel");

const seedAdmin = async () => {
  const adminEmail = "admin@karigar.com";
  const adminPassword = "admin123";

  try {
    await connectDB();

    console.log("Checking for existing admin in Firebase...");
    let firebaseUid;
    try {
      const userRecord = await auth.getUserByEmail(adminEmail);
      firebaseUid = userRecord.uid;
      console.log("Admin already exists in Firebase with UID:", firebaseUid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log("Admin not found in Firebase. Creating...");
        const newRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: "Admin",
        });
        firebaseUid = newRecord.uid;
        console.log("Admin created in Firebase with UID:", firebaseUid);
      } else {
        throw error;
      }
    }

    console.log("Checking for existing admin in MongoDB...");
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists in MongoDB. Updating role to admin...");
      existingAdmin.role = "admin";
      existingAdmin.firebase_uid = firebaseUid;
      await existingAdmin.save();
      console.log("Admin successfully updated in MongoDB.");
    } else {
      console.log("Creating admin in MongoDB...");
      await User.create({
        firebase_uid: firebaseUid,
        email: adminEmail,
        name: "Admin",
        role: "admin",
      });
      console.log("Admin successfully created in MongoDB.");
    }

    console.log("Admin seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
