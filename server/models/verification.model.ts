import { mongoose, bcrypt } from "../imports";

const verificationSchema = new mongoose.Schema(
  {
    email: { required: true, type: String },
    code: { required: true, type: String },
  },
  { timestamps: true }
);

verificationSchema.pre("save", async function (next) {
  const verification = this;
  if (verification.isModified("code")) {
    verification.code = await bcrypt.hash(
      verification.code,
      process.env.TOKEN_SECRET
    );
  }
  next();
});

module.exports =
  mongoose.models["verifications"] ||
  mongoose.model("verifications", verificationSchema);
