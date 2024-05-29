import mongoose from "mongoose";

// set rule/schema
const courseSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  price: Number,
  tutorName: String,
});

// create table/model/collection
const course = mongoose.model("course", courseSchema);

export default course;
