import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect("mongodb://localhost:27017/studMgnt")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Error connecting to MongoDB");
    });
};

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  hobbie: {
    type: [String],
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});
const studData = mongoose.model("studentData", userSchema);
export { studData };
