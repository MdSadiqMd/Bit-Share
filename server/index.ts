process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { Socket } from "socket.io";
import {
  express,
  Application,
  Request,
  Response,
  NextFunction,
  SocketIOServer,
  http,
  socketIO,
  createServer,
  cors,
  bodyParser,
  cookieParser,
  authRoutes,
  fileShareRoutes,
  connectDB,
} from "./imports";
require("dotenv").config();

connectDB();

interface CustomCookieOptions extends cookieParser.CookieParseOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  signed?: boolean;
}

const PORT: number = parseInt(process.env.PORT || "8000", 10);
const app: Application = express();
const server: http.Server = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

const allowOrigins: string[] = ["http://localhost:3000"];
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Unreliable CORS Origin"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  cookieParser(process.env.TOKEN_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
  } as CustomCookieOptions)
);

app.use("/public", express.static("public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/file", fileShareRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Running");
});

io.on("connection", (Socket) => {
  Socket.on("connection", (Socket) => {
    console.log("new connection", Socket.id);
  });
  Socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  Socket.on("joinself", (data) => {
    console.log("joinself", data);
    Socket.join(data);
  });
  Socket.on("uploaded", (data) => {
    let sender = data.from;
    let receiver = data.to;
    console.log("uploaded", data);
    Socket.to(receiver).emit("notify", {
      from: sender,
      message: "New file shared",
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is Running at Port ${PORT}`);
});
