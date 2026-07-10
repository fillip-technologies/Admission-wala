export const boards = [
  { code: "NIOS", name: "National Institute of Open Schooling", tag: "Most chosen",
    blurb: "India's largest open school, recognised nationwide. Flexible exams and on-demand options for Secondary and Senior Secondary." },
  { code: "BBOSE", name: "Bihar Board of Open Schooling & Examination", tag: "Bihar",
    blurb: "State open board for Bihar learners. A practical route to complete Class 10th, 11th and 12th at your own pace." },
  { code: "BOSSE", name: "Board of Open Schooling & Skill Education", tag: "Skill-focused",
    blurb: "Sikkim's open board with a strong focus on skill-linked certification alongside academics." },
];

export const courses = [
  { id: "secondary", title: "Class 10th — Secondary", level: "Foundation", duration: "1 year", boards: ["NIOS", "BBOSE", "BOSSE"],
    description: "Complete your matriculation through open schooling. Ideal for re-admission, dropouts, and working learners." },
  { id: "sr11-science", title: "Class 11th — Science", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE", "BOSSE"],
    description: "Physics, Chemistry, Biology / Maths. Build a strong base for Class 12th and competitive exams." },
  { id: "sr11-commerce", title: "Class 11th — Commerce", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE"],
    description: "Accountancy, Business Studies and Economics — the foundation year of your commerce stream." },
  { id: "sr11-arts", title: "Class 11th — Arts / Humanities", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE", "BOSSE"],
    description: "History, Political Science, Sociology and languages — a flexible base for further studies." },
  { id: "sr-science", title: "Class 12th — Science", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE", "BOSSE"],
    description: "Physics, Chemistry, Biology / Maths. Keep medical and engineering pathways open with a recognised certificate." },
  { id: "sr-commerce", title: "Class 12th — Commerce", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE"],
    description: "Accountancy, Business Studies and Economics for careers in finance, CA foundation and B.Com." },
  { id: "sr-arts", title: "Class 12th — Arts / Humanities", level: "Senior Secondary", duration: "1 year", boards: ["NIOS", "BBOSE", "BOSSE"],
    description: "History, Political Science, Sociology and languages — a flexible base for law, civil services and UG admission." },
  { id: "on-demand", title: "On-Demand Examination", level: "Flexible", duration: "Self-paced", boards: ["NIOS"],
    description: "Appear for exams subject-by-subject whenever you are ready, instead of waiting for fixed sessions." },
  { id: "vocational", title: "Skill & Vocational Courses", level: "Certificate", duration: "3–12 months", boards: ["BOSSE", "NIOS"],
    description: "Job-ready certifications you can stack with your board admission. Counsellor helps you pick the right track." },
];

// Admissions we take directly — the three open-school boards. Clicking these
// starts the admission flow.
export const admissionPrograms = [
  "NIOS Admission",
  "BBOSE Admission",
  "BOSSE Admission",
];

// Courses a visitor can enquire about from the on-load popup, listed in
// priority order (open-school boards first, then higher-education verticals,
// then "and many more"). Each `program`/`board` maps to the values the enquiry
// backend validates against (see backend .../admissionPrograms.js + the
// enquiryType enum). `isSchool` decides whether to ask for the class (10th/12th).
export const enquiryCourses = [
  { label: "NIOS — Open School (10th / 12th)", program: "NIOS Admission", board: "NIOS", isSchool: true },
  { label: "BOSSE — Open School (10th / 12th)", program: "School Admission", board: "BOSSE", isSchool: true },
  { label: "BBOSE — Open School (10th / 12th)", program: "School Admission", board: "BBOSE", isSchool: true },
  { label: "Engineering (JEE / B.Tech)", program: "Engineering Admission", board: "Other" },
  { label: "Medical (NEET / MBBS)", program: "Medical Admission", board: "Other" },
  { label: "Diploma", program: "Diploma Admission", board: "Other" },
  { label: "Graduation (UG)", program: "UG Admission", board: "Other" },
  { label: "Post Graduation (PG)", program: "PG Admission", board: "Other" },
  { label: "MBA", program: "MBA Admission", board: "Other" },
  { label: "Law", program: "Law Admission", board: "Other" },
  { label: "Nursing", program: "Nursing Admission", board: "Other" },
  { label: "Pharmacy", program: "Pharmacy Admission", board: "Other" },
  { label: "Study Abroad", program: "Study Abroad Admission", board: "Other" },
];

// What our counsellors help students with, end to end.
export const expertise = [
  "Personalized Career Counselling",
  "Course & College Selection",
  "Admission Guidance",
  "Application & Documentation Support",
  "Scholarship & Financial Aid Assistance",
  "Study in India & Abroad",
  "Visa Guidance (for international admissions)",
];

export const trustStats = [
  { value: "All", label: "Students & courses" },
  { value: "10–12", label: "Live classes" },
  { value: "Free", label: "1:1 counselling" },
];
