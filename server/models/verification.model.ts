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
    const tokenSecret = process.env.TOKEN_SECRET;
    if (tokenSecret) {
      const hashedCode = await bcrypt.hash(verification.code, tokenSecret);
      verification.code = hashedCode;
    } else {
      throw new Error("TOKEN_SECRET is not defined.");
    }
  }
  next();
});

module.exports =
  mongoose.models["verifications"] ||
  mongoose.model("verifications", verificationSchema);
