import { mongoose, bcrypt } from "../imports";

const fileSchema = new mongoose.Schema(
  {
    senderEmail: { required: true, type: String },
    receiverEmail: { required: true, type: String },
    fileURL: { required: true, type: String },
    fileName: { required: true, type: String },
    sharedAt: { required: true, type: Date },
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
    file: {
      type: [fileSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const tokenSecret = process.env.TOKEN_SECRET;
    if (tokenSecret) {
      user.password = await bcrypt.hash(user.password, tokenSecret);
    } else {
      throw new Error("TOKEN_SECRET is not defined.");
    }
  }
  next();
});

module.exports =
  mongoose.models["users"] || mongoose.model("users", userSchema);
