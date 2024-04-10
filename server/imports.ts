import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const socketIO=require('socket.io');
const authRoutes = require("./routes/auth.routes");
const fileShareRoutes = require("./routes/fileShare.routes");

export {
  express,
  http,
  socketIO,
  cors,
  bodyParser,
  cookieParser,
  authRoutes,
  fileShareRoutes,
};
