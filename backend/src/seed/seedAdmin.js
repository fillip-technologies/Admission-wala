import dotenv from "dotenv"
dotenv.config();
import { connectDb } from "../configs/db.js";
import { User } from "../modules/auth/models/auth.model.js";

const seedAdmin = async (name, email, mobile_number, password) => {
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const user = await User.create({
    name,
    email,
    mobile_number,
    role: "admin",
    password, // let schema hash it
  });

  console.log("Admin created:", user.email);
};

const run = async () => {
  await connectDb();

  await seedAdmin(
    "Admin",
    "singhalgovind305@gmail.com",
    "6280381723",
    "Admin@123"
  );

  process.exit();
};

run();