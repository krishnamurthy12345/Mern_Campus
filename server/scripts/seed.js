
require("dotenv").config();

const mongoose = require("mongoose");
const College = require("../src/models/College");

const sampleColleges = [
  {
    name: "Indian Institute of Technology Madras",
    location: "Chennai, Tamil Nadu",
    description:
      "A leading technical institution offering engineering, science, technology, and research programs.",
  },
  {
    name: "Anna University",
    location: "Chennai, Tamil Nadu",
    description:
      "A public university known for engineering, technology, and higher education.",
  },
  {
    name: "Loyola College",
    location: "Chennai, Tamil Nadu",
    description:
      "An autonomous college offering undergraduate and postgraduate programs across multiple disciplines.",
  },
  {
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    description:
      "An engineering and technology institution offering technical education and research programs.",
  },
  {
    name: "Vellore Institute of Technology",
    location: "Vellore, Tamil Nadu",
    description:
      "A university offering programs in engineering, technology, science, and management.",
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Kattankulathur, Tamil Nadu",
    description:
      "An institution offering a range of programs in engineering, medicine, science, and management.",
  },
];

async function seedColleges() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error(
        "MongoDB connection string is missing from server/.env"
      );
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully.");

    const operations = sampleColleges.map((college) => ({
      updateOne: {
        filter: {
          name: college.name,
          location: college.location,
        },
        update: {
          $setOnInsert: college,
        },
        upsert: true,
      },
    }));

    const result = await College.bulkWrite(operations);

    console.log(
      `College seeding completed. Inserted ${result.upsertedCount} new colleges.`
    );
  } catch (error) {
    console.error("College seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedColleges();
