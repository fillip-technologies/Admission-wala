// Static blog content. Each post has a unique `slug` used both as the React key
// and the URL segment (/blogs/:slug). `content` is an array of paragraphs.
export const blogs = [
  {
    slug: "nios-vs-regular-board",
    title: "NIOS vs a Regular Board: Which One Is Right for You?",
    excerpt:
      "Confused between open schooling and a regular board? Here's a clear, honest comparison to help you decide.",
    author: "Team Shree Admission Gurukul",
    date: "2026-06-20",
    readMins: 5,
    tags: ["NIOS", "Guidance"],
    content: [
      "Choosing between the National Institute of Open Schooling (NIOS) and a regular board is one of the most common questions we hear. Both lead to a recognised Class 10th or 12th certificate, but they suit different kinds of learners.",
      "A regular board follows fixed timetables, daily attendance and a set exam session every year. It works well for students who thrive with structure and want the traditional school experience.",
      "NIOS, on the other hand, is built for flexibility. You can study at your own pace, appear for On-Demand Examinations subject-by-subject, and continue even if you have had a gap year or are working alongside your studies.",
      "If you have dropped a year, failed a subject, or need a schedule that fits around a job or other commitments, open schooling is often the faster, less stressful route. If you want a conventional classroom routine, a regular board may suit you better.",
      "Still unsure? Book a free counselling session and we'll map out the option that fits your goals and timeline.",
    ],
  },
  {
    slug: "documents-for-open-school-admission",
    title: "Documents You Need for Open-School Admission",
    excerpt:
      "A simple checklist of everything you should keep ready before starting your NIOS, BBOSE or BOSSE admission.",
    author: "Team Shree Admission Gurukul",
    date: "2026-06-28",
    readMins: 4,
    tags: ["Admission", "Checklist"],
    content: [
      "Getting your admission confirmed is much quicker when your documents are ready in advance. Here is the checklist we share with every student.",
      "For most open-board admissions you will need: a passport-size photograph, a valid ID proof (Aadhaar is preferred), your date-of-birth proof, and your previous marksheet or transfer certificate if you have one.",
      "For Class 12th admission you will also need your Class 10th passing certificate. If you are re-admitting after a gap, don't worry — open boards are designed to accommodate exactly this situation.",
      "Keep clear scans or photos of each document. Blurry or cropped images are the most common reason an admission gets delayed.",
      "If you're missing a document, talk to your counsellor before you begin — there is almost always a way forward.",
    ],
  },
  {
    slug: "on-demand-exams-explained",
    title: "On-Demand Examinations, Explained",
    excerpt:
      "NIOS lets you sit for exams whenever you're ready, one subject at a time. Here's how it actually works.",
    author: "Team Shree Admission Gurukul",
    date: "2026-07-02",
    readMins: 4,
    tags: ["NIOS", "Exams"],
    content: [
      "One of the biggest advantages of NIOS is the On-Demand Examination (ODE) system. Instead of waiting for a single fixed exam session, you can appear for a subject whenever you feel prepared.",
      "This means you can clear your subjects gradually, focus on one at a time, and avoid the pressure of sitting every paper in the same window.",
      "ODE is especially useful for working students and anyone balancing other responsibilities. You build your certificate at a pace that works for your life.",
      "Your counsellor will help you plan the order of subjects and register for each exam at the right time, so nothing falls through the cracks.",
    ],
  },
];

// Look up a single post by its slug (used by the /blogs/:slug detail page).
export const getBlogBySlug = (slug) => blogs.find((b) => b.slug === slug);
