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
    const tokenSecretEnv = process.env.TOKEN_SECRET;
    if (tokenSecretEnv) {
      const tokenSecret = parseInt(tokenSecretEnv);
      if (!isNaN(tokenSecret)) {
        const hashedCode = await bcrypt.hash(
          verification.code,
          tokenSecret.toString()
        );
        verification.code = hashedCode;
      } else {
        throw new Error("TOKEN_SECRET is not a valid number.");
      }
    } else {
      throw new Error("TOKEN_SECRET is not defined.");
    }
  }
  next();
});

module.exports =
  mongoose.models["verifications"] ||
  mongoose.model("verifications", verificationSchema);
