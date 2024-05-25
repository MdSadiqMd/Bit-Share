import {
  express,
  Request,
  Response,
  Router,
  userModel,
  verificationModel,
  bcrypt,
  jwt,
  fs,
  nodemailer,
  Transporter,
  response,
  NextFunction,
} from "../imports";
import authTokenHandler from "../middlewares/authTokenhandler";
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

interface CustomRequest extends Request {
  userId?: string;
  ok?: boolean;
  message?: string;
}

const router: Router = express.Router();
const app = express();
app.use(express.json());

async function mailer(receiverEmail: string, code: number): Promise<void> {
  let transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "gmail",
    auth: {
      user: "mohammadsadiq4950@gmail.com",
      pass: "ozyx xzzz iovq ngmd",
    },
  });

  let info = await transporter.sendMail({
    from: "Bit-Share",
    to: receiverEmail,
    subject: "OTP Verification",
    text: "Verify your Account via OTP: " + code,
    html: "<b>Verify your Account via OTP: " + code + "</b>",
  });

  //console.log(info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));
}

/*router.get("/test", (req, res) => {
  res.send("Auth Routes Testing");
  //mailer("mohammadsadiq4930@gmail.com", 12345);
});*/

// Check headers settings when testing with postman
router.post("/sendotp", async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(req.body);
  if (!email) {
    return response(res, 400, "Email is Required", null, false);
  }
  try {
    await verificationModel.deleteOne({ email: email });
    const code = Math.floor(100000 + Math.random() * 900000);
    await mailer(email, code);
    await verificationModel.findOneAndDelete({ email: email });
    const newVerification = new verificationModel({
      email: email,
      code: code,
    });
    await newVerification.save();
    return response(res, 200, "OTP Sent Successfully", null, true);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error", null, false);
  }
});

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    try {
      const { name, email, password, otp, clientfile } = req.body;
      console.log({ name, email, password, otp, clientfile });
      let user = await userModel.findOne({ email: email });
      let verificationQueue = await verificationModel.findOne({ email: email });
      if (user) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File Deleted Successfully");
            }
          });
        }
      }
      if (!verificationQueue) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File Deleted Successfully");
            }
          });
        }
        return response(res, 400, "Please resend OTP", null, false);
      }
      const isMatch = await bcrypt.compare(otp, verificationQueue.code);
      if (!isMatch) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File Deleted Successfully");
            }
          });
        }
        return response(res, 400, "Invalid OTP", null, false);
      }
      user = new userModel({
        name: name,
        email: email,
        password: password,
        profilePicture: req.file?.path,
        files: clientfile,
      });
      await user.save();
      await verificationModel.deleteOne({ email: email });
      return response(res, 200, "User Registered Successfully", null, true);
    } catch (error: any) {
      console.log(error);
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return response(res, 400, "Invalid Credentials", null, false);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response(res, 400, "Invalid Credentials", null, false);
      }
      const jwtKey = process.env.JWT_SECRET_KEY;
      if (!jwtKey) {
        return response(res, 500, "JWT Secret Key is not defined", null, false);
      }
      const authToken = jwt.sign({ userId: user._id }, jwtKey, {
        expiresIn: "1d",
      });
      const jwtRefresh = process.env.JWT_REFRESH_KEY;
      if (!jwtRefresh) {
        return response(
          res,
          500,
          "JWT Refresh Key is not defined",
          null,
          false
        );
      }
      const refreshToken = jwt.sign({ userId: user._id }, jwtRefresh, {
        expiresIn: "1d",
      });
      res.cookie("authToken", authToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      return response(
        res,
        200,
        "Logged in Successfully",
        {
          authToken: authToken,
          refreshToken: refreshToken,
        },
        true
      );
    } catch (error) {
      console.log(error);
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

router.get(
  "/checklogin",
  authTokenHandler,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    res.json({
      userId: req.userId,
      message: req.message,
      ok: req.ok,
    });
  }
);

router.post(
  "/logout",
  authTokenHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.json({
      message: "Logged Out Successfully",
      ok: true,
    });
  }
);

router.get(
  "/getuser",
  authTokenHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body.email;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return response(res, 400, "User not found", null, false);
      }
      return response(res, 200, "User found", user, true);
    } catch (err) {
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

router.post(
  "/changepassword",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, password } = req.body;
      let user = await userModel.findOne({ email: email });
      let verificationQueue = await verificationModel.findOne({ email: email });
      if (!user) {
        return response(res, 400, "User doesn't exist", null, false);
      }
      if (!verificationQueue) {
        return response(res, 400, "Please send otp first", null, false);
      }
      const isMatch = await bcrypt.compare(otp, verificationQueue.code);
      if (!isMatch) {
        return response(res, 400, "Invalid OTP", null, false);
      }
      user.password = password;
      await user.save();
      await verificationModel.deleteOne({ email: email });
      return response(res, 200, "Password changed successfully", null, true);
    } catch (err) {
      next(err);
    }
  }
);

const getObjectURL = async (key: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
  };
  return await getSignedUrl(s3Client, new GetObjectCommand(params));
};

const postObjectURL = async (
  filename: string,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: filename,
    ContentType: contentType,
  };
  return await getSignedUrl(s3Client, new PutObjectCommand(params));
};

router.get(
  "/generatepostobjecturl",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeinms = new Date().getTime();
      const signedUrl = await postObjectURL(timeinms.toString(), "");
      return response(
        res,
        200,
        "signed url generated",
        {
          signedUrl: signedUrl,
          filekey: timeinms.toString(),
        },
        true
      );
    } catch (err) {
      next(err);
    }
  }
);

export default router;
