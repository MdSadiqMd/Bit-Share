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
const nodemailer = require("nodemailer");
import { Transporter } from "nodemailer";
const authRoutes = require("./routes/auth.routes");
const fileShareRoutes = require("./routes/fileShare.routes");
const userModel = require("./models/user.model");
const verificationModel = require("./models/verification.model");
const authTokenHandler = require("./middlewares/authTokenhandler");
const errorHandler = require("./middlewares/errorHandler");
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
