import express from "express";
import connectDB from "./db.connect.js";
import course from "./course/course.model.js";
import mongoose from "mongoose";

const app = express();

// to make app understand json
app.use(express.json());

// connect db
connectDB();

//  create routes here
app.post("/course/add", async (req, res) => {
  // extract new course from req.body
  const newcourse = req.body;

  await course.create(newcourse);

  return res.status(201).send({ message: "course is added successfully." });
});

// get courses
app.get("/course/list", async (req, res) => {
  const courses = await course.find();

  return res.status(200).send({ message: "success", courseList: courses });
});


// Delete course
app.delete("/course/delete/:courseId", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.courseId;

  // check if course id is valid mongo id
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course using course id
  const requiredcourse = await course.findOne({ _id: courseId });

  // if  not course, throw error
  if (!requiredcourse) {
    return res.status(404).send({ message: "course does not exist." });
  }

  // delete course
  await course.deleteOne({ _id: courseId });

  // send res
  return res.status(200).send({ message: "course is deleted successfully." });
});


// Edit
app.put("/course/edit/:courseId", async (req, res) => {
  // extract courseId from req.params
  const courseId = req.params.courseId;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course
  const requiredcourse = await course.findOne({ _id: courseId });

  // if not course, throw error
  if (!requiredcourse) {
    return res.status(404).send({ message: "course does not exist." });
  }

  // extract new values from req.body
  const newValues = req.body;

  // update course
  await course.updateOne(
    { _id: courseId },
    {
      $set: {
        name: newValues.name,
        duration: newValues.duration,
        price: newValues.price,
        tutorName: newValues.tutorName,
      },
    }
  );

  // send response
  return res.status(200).send({ message: "course is updated successfully." });
});

// network port and server
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
