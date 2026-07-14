const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend from CourseProject
app.use(express.static(path.join(__dirname, "CourseProject")));

// Sample data
const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd"
  },
  {
    id: 2,
    title: "Flowers",
    artist: "Miley Cyrus"
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa"
  }
];

const courses = [
  {
    id: 1,
    subject: "IVYT",
    number: "111",
    name: "Student Success",
    credits: 1,
    description: "This course provides students with an overview of skills and strategies necessary to successfully complete a degree or certificate from Ivy Tech Community College and/or to transfer to a four-year institution."
  },
  {
    id: 2,
    subject: "CPIN",
    number: "279",
    name: "Information Technology Capstone",
    credits: 1,
    description: "Prepares students for entry into the information world."
  },
  {
    id: 3,
    subject: "DBMS",
    number: "110",
    name: "Introduction to Data Analytics",
    credits: 3,
    description: "Introduces students to the basic concepts of databases."
  }
];

function buildCourseFromBody(body = {}) {
  return {
    subject: body.subject || "",
    number: body.number || "",
    name: body.name || "",
    credits: Number(body.credits) || 0,
    description: body.description || ""
  };
}

// Route
router.get("/songs", (req, res) => {
  res.json(songs);
});

router.get("/courses", (req, res) => {
  res.json(courses);
});

router.get("/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === Number(req.params.id));

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  res.json(course);
});

router.post("/courses", (req, res) => {
  const newCourse = {
    id: courses.length ? Math.max(...courses.map((course) => course.id)) + 1 : 1,
    ...buildCourseFromBody(req.body)
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

router.put("/courses/:id", (req, res) => {
  const courseId = Number(req.params.id);
  const index = courses.findIndex((course) => course.id === courseId);

  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  const updatedCourse = {
    ...courses[index],
    ...buildCourseFromBody(req.body),
    id: courseId
  };

  courses[index] = updatedCourse;
  res.json(updatedCourse);
});

router.delete("/courses/:id", (req, res) => {
  const courseId = Number(req.params.id);
  const index = courses.findIndex((course) => course.id === courseId);

  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  courses.splice(index, 1);
  res.status(204).send();
});

// Prefix routes with /api
app.use("/api", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "CourseProject", "index.html"));
});

// Route fallback for SPA/static assets
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
