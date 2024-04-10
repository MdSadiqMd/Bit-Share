import {
  express,
  http,
  socketIO,
  cors,
  bodyParser,
  cookieParser,
  authRoutes,
  fileShareRoutes,
} from "./imports";

const app=express();
const server=http.createServer(app);
const io=socketIO(server);