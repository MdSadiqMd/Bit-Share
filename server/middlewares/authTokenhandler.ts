import { Request, Response, NextFunction, jwt, VerifyErrors } from "../imports";

interface CustomRequest extends Request {
  userId?: string;
  ok?: boolean;
  message?: string;
}

async function authTokenHandler(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;
  console.log("Auth Token Handler", authToken, refreshToken);
  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: "Authentication failed: No authToken or refreshToken provided",
      ok: false,
    });
  }
  const jwtKey = process.env.JWT_SECRET_KEY;
  if (jwtKey) {
    jwt.verify(authToken, jwtKey, (err: VerifyErrors | null, decoded: any) => {
      const jwtRefresh = process.env.JWT_REFRESH_KEY;
      if (err && jwtRefresh) {
        jwt.verify(
          refreshToken,
          jwtRefresh,
          (refreshErr: VerifyErrors | null, refreshDecoded: any) => {
            if (refreshErr) {
              return res.status(401).json({
                message: "Authentication failed: Both tokens are invalid",
                ok: false,
              });
            } else {
              const newAuthToken = jwt.sign(
                { userId: refreshDecoded.userId },
                jwtKey,
                { expiresIn: "1d" }
              );
              const newRefreshToken = jwt.sign(
                { userId: refreshDecoded.userId },
                jwtRefresh,
                { expiresIn: "2d" }
              );
              res.cookie("authToken", newAuthToken, {
                sameSite: "none",
                httpOnly: true,
                secure: true,
              });
              res.cookie("refreshToken", newRefreshToken, {
                sameSite: "none",
                httpOnly: true,
                secure: true,
              });
              req.userId = refreshDecoded.userId;
              req.ok = true;
              req.message = "Authentication successful";
              next();
            }
          }
        );
      } else {
        req.userId = decoded?.userId;
        req.ok = true;
        req.message = "Authentication successful";
        next();
      }
    });
  }
}

export default authTokenHandler;
