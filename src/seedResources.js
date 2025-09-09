const mongoose = require("mongoose");
const Resource = require("./models/Resource");
require("dotenv").config();

const sampleResources = [
  // Biology Resources
  {
    title: "Introduction to Cell Biology",
    description:
      "Comprehensive guide covering cell structure, organelles, and cellular processes including mitosis and meiosis.",
    type: "pdf",
    url: "https://example.com/cell-biology.pdf",
    file: "",
    department: "Biology",
    subject: "Cell Biology",
    year: "Year 1",
    semester: "1st",
  },
  {
    title: "Genetics and Heredity Notes",
    description:
      "Detailed notes on Mendelian genetics, DNA structure, and inheritance patterns.",
    type: "pdf",
    url: "https://example.com/genetics-notes.pdf",
    file: "",
    department: "Biology",
    subject: "Genetics",
    year: "Year 2",
    semester: "2nd",
  },
  {
    title: "Ecology Research Paper",
    description:
      "Research paper on ecosystem dynamics and biodiversity conservation in West Africa.",
    type: "pdf",
    url: "https://example.com/ecology-research.pdf",
    file: "",
    department: "Biology",
    subject: "Ecology",
    year: "Year 3",
    semester: "Both",
  },

  // Chemistry Resources
  {
    title: "Organic Chemistry Fundamentals",
    description:
      "Complete textbook covering organic compounds, reactions, and mechanisms.",
    type: "pdf",
    url: "https://example.com/organic-chemistry.pdf",
    file: "",
    department: "Chemistry",
    subject: "Organic Chemistry",
    year: "Year 2",
    semester: "1st",
  },
  {
    title: "Physical Chemistry Lab Manual",
    description:
      "Laboratory procedures and experiments for physical chemistry practicals.",
    type: "document",
    url: "https://example.com/phys-chem-lab.pdf",
    file: "",
    department: "Chemistry",
    subject: "Physical Chemistry",
    year: "Year 3",
    semester: "Both",
  },
  {
    title: "Analytical Chemistry Past Papers",
    description:
      "Collection of past examination papers for analytical chemistry with solutions.",
    type: "pdf",
    url: "https://example.com/analytical-past-papers.pdf",
    file: "",
    department: "Chemistry",
    subject: "Analytical Chemistry",
    year: "Year 4",
    semester: "2nd",
  },

  // Physics Resources
  {
    title: "Classical Mechanics Textbook",
    description:
      "Comprehensive textbook on Newtonian mechanics, energy, and momentum.",
    type: "pdf",
    url: "https://example.com/classical-mechanics.pdf",
    file: "",
    department: "Physics",
    subject: "Classical Mechanics",
    year: "Year 1",
    semester: "1st",
  },
  {
    title: "Quantum Physics Lecture Notes",
    description:
      "Advanced lecture notes on quantum mechanics principles and applications.",
    type: "document",
    url: "https://example.com/quantum-physics.pdf",
    file: "",
    department: "Physics",
    subject: "Quantum Physics",
    year: "Year 3",
    semester: "2nd",
  },
  {
    title: "Electromagnetism Problem Sets",
    description:
      "Practice problems and solutions for electromagnetic theory and applications.",
    type: "pdf",
    url: "https://example.com/em-problems.pdf",
    file: "",
    department: "Physics",
    subject: "Electromagnetism",
    year: "Year 2",
    semester: "Both",
  },

  // Mathematics Resources
  {
    title: "Calculus I Complete Guide",
    description:
      "Comprehensive guide to limits, derivatives, and integration techniques.",
    type: "pdf",
    url: "https://example.com/calculus-1.pdf",
    file: "",
    department: "Mathematics",
    subject: "Calculus",
    year: "Year 1",
    semester: "1st",
  },
  {
    title: "Linear Algebra Study Notes",
    description:
      "Study notes covering matrices, vector spaces, and linear transformations.",
    type: "document",
    url: "https://example.com/linear-algebra.pdf",
    file: "",
    department: "Mathematics",
    subject: "Linear Algebra",
    year: "Year 2",
    semester: "1st",
  },
  {
    title: "Statistics and Probability",
    description:
      "Complete resource on statistical methods and probability theory.",
    type: "pdf",
    url: "https://example.com/statistics.pdf",
    file: "",
    department: "Mathematics",
    subject: "Statistics",
    year: "Year 3",
    semester: "Both",
  },

  // Computer Science Resources
  {
    title: "Data Structures and Algorithms",
    description:
      "Comprehensive guide to common data structures and algorithmic techniques.",
    type: "pdf",
    url: "https://example.com/dsa.pdf",
    file: "",
    department: "Computer Science",
    subject: "Data Structures",
    year: "Year 2",
    semester: "1st",
  },
  {
    title: "Database Design Fundamentals",
    description:
      "Introduction to relational databases, normalization, and SQL.",
    type: "pdf",
    url: "https://example.com/database-design.pdf",
    file: "",
    department: "Computer Science",
    subject: "Database Systems",
    year: "Year 2",
    semester: "2nd",
  },
  {
    title: "Object-Oriented Programming",
    description: "Complete guide to OOP concepts with Java and C++ examples.",
    type: "document",
    url: "https://example.com/oop-guide.pdf",
    file: "",
    department: "Computer Science",
    subject: "Programming",
    year: "Year 1",
    semester: "2nd",
  },

  // Environmental Science Resources
  {
    title: "Climate Change Research",
    description:
      "Latest research on climate change impacts and mitigation strategies.",
    type: "pdf",
    url: "https://example.com/climate-research.pdf",
    file: "",
    department: "Environmental Science",
    subject: "Climate Science",
    year: "Year 3",
    semester: "1st",
  },
  {
    title: "Environmental Impact Assessment",
    description:
      "Guidelines and procedures for conducting environmental impact assessments.",
    type: "document",
    url: "https://example.com/eia-guide.pdf",
    file: "",
    department: "Environmental Science",
    subject: "Environmental Assessment",
    year: "Year 4",
    semester: "2nd",
  },
  {
    title: "Sustainable Development Goals",
    description:
      "Study material on UN Sustainable Development Goals and their implementation.",
    type: "pdf",
    url: "https://example.com/sdg-study.pdf",
    file: "",
    department: "Environmental Science",
    subject: "Sustainable Development",
    year: "Year 2",
    semester: "Both",
  },

  // Timetables
  {
    title: "Biology Department Timetable 2024",
    description:
      "Current semester timetable for all Biology courses and lab sessions.",
    type: "pdf",
    url: "https://example.com/bio-timetable.pdf",
    file: "",
    department: "Biology",
    subject: "Timetable",
    year: "All Years",
    semester: "Both",
  },
  {
    title: "Chemistry Lab Schedule",
    description:
      "Laboratory session schedule for all Chemistry practical courses.",
    type: "pdf",
    url: "https://example.com/chem-lab-schedule.pdf",
    file: "",
    department: "Chemistry",
    subject: "Laboratory",
    year: "All Years",
    semester: "Both",
  },
];

async function seedResources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing resources
    await Resource.deleteMany({});
    console.log("Cleared existing resources");

    // Insert sample resources
    await Resource.insertMany(sampleResources);
    console.log(`Inserted ${sampleResources.length} sample resources`);

    console.log("Resources seeded successfully!");
  } catch (error) {
    console.error("Error seeding resources:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedResources();
