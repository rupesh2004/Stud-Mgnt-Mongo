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

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true

  },
  message : {
    type: String,
    required: true
  }
})
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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
const contactData = mongoose.model("contactData",contactSchema);
export { studData, contactData };
