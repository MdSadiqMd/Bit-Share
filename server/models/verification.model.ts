import { mongoose, bcrypt } from "../imports";
require("dotenv").config();

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
    const token = process.env.TOKEN_SECRET;
    if (token != undefined) {
      verification.code = await bcrypt.hash(verification.code, parseInt(token));
    }
  }
  next();
});

const verificationModel =
  mongoose.models["verifications"] ||
  mongoose.model("verifications", verificationSchema);
export default verificationModel;
