import { mongoose, bcrypt } from "../imports";
require("dotenv").config();

const fileSchema = new mongoose.Schema(
  {
    senderEmail: { required: true, type: String },
    receiverEmail: { required: true, type: String },
    fileURL: { required: true, type: String },
    fileName: { required: true, type: String },
    sharedAt: { required: true, type: Date },
    fileType: { type: String },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    email: { required: true, type: String },
    password: { required: true, type: String },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREl1TQtDYX5h2D_zEWAcR7uZge3w8w-BVjd-4QqFc4ZncS05EcIP7oVgvJWHY7ETxPp8Y&usqp=CAU",
    },
    files: {
      type: [fileSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const token = process.env.TOKEN_SECRET;
    if (token != undefined) {
      user.password = await bcrypt.hash(user.password, parseInt(token));
    }
  }
  next();
});

const userModel =
  mongoose.models["users"] || mongoose.model("users", userSchema);
export default userModel;
