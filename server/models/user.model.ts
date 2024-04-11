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
      default: "",
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
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

module.exports =
  mongoose.models["users"] || mongoose.model("users", userSchema);
