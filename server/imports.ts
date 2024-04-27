import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
const socketIO = require("socket.io");
import nodemailer, { Transporter } from "nodemailer";
import authRoutes from "./routes/auth.routes";
import fileShareRoutes from "./routes/fileShare.routes";
import userModel from "./models/user.model";
import verificationModel from "./models/verification.model";
import authTokenHandler from "./middlewares/authTokenhandler";
import errorHandler from "./middlewares/errorHandler";
import connectDB from "./db/db";
import response from "./utils/responseFunction";

export {
  express,
  Application,
  Request,
  Response,
  NextFunction,
  Router,
  SocketIOServer,
  http,
  socketIO,
  cors,
  bodyParser,
  cookieParser,
  mongoose,
  bcrypt,
  jwt,
  VerifyErrors,
  multer,
  nodemailer,
  Transporter,
  fs,
  authRoutes,
  fileShareRoutes,
  userModel,
  verificationModel,
  authTokenHandler,
  errorHandler,
  connectDB,
  response,
};
