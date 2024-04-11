import { link } from "fs";
import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const socketIO = require("socket.io");
const authRoutes = require("./routes/auth.routes");
const fileShareRoutes = require("./routes/fileShare.routes");

export {
  express,
  Application,
  Request,
  Response,
  NextFunction,
  SocketIOServer,
  http,
  socketIO,
  cors,
  bodyParser,
  cookieParser,
  mongoose,
  bcrypt,
  authRoutes,
  fileShareRoutes,
};
