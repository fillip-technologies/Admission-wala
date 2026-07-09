import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "../configs/db.js";
import { Program } from "../modules/program/models/program.model.js";

// Initial course/admission strip for the home hero. The admin can add, edit,
// hide or delete these any time from the dashboard — this only bootstraps the
// list on a fresh database.
const DEFAULT_PROGRAMS = [
  // Competitive exam based
  ["JEE Admission", "Competitive Exam"],
  ["NEET Admission", "Competitive Exam"],
  ["CUET Admission", "Competitive Exam"],
  ["CAT Admission", "Competitive Exam"],
  ["CLAT Admission", "Competitive Exam"],
  ["GATE Admission", "Competitive Exam"],
  // General
  ["School Admission", "General"],
  ["NIOS Admission", "General"],
  ["Diploma Admission", "General"],
  ["UG Admission", "General"],
  ["PG Admission", "General"],
  ["Engineering Admission", "General"],
  ["Medical Admission", "General"],
  ["MBA Admission", "General"],
  ["Law Admission", "General"],
  ["Nursing Admission", "General"],
  ["Pharmacy Admission", "General"],
  ["Agriculture Admission", "General"],
  ["Hotel Management Admission", "General"],
  ["Aviation Admission", "General"],
  ["Design Admission", "General"],
  ["Study Abroad Admission", "General"],
  ["PhD Admission", "General"],
];

const run = async () => {
  await connectDb();

  let created = 0;
  for (let i = 0; i < DEFAULT_PROGRAMS.length; i++) {
    const [name, category] = DEFAULT_PROGRAMS[i];
    const exists = await Program.findOne({ name });
    if (exists) continue;
    await Program.create({ name, category, order: i, active: true });
    created += 1;
  }

  console.log(`Programs seeded: ${created} created, ${DEFAULT_PROGRAMS.length - created} skipped (already present).`);
  process.exit();
};

run();
