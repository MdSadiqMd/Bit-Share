import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
const socketIO = require("socket.io");
const authRoutes = require("./routes/auth.routes");
const fileShareRoutes = require("./routes/fileShare.routes");
const userModel = require("./models/user.model");
const verificationModel = require("./models/verification.model");
import connectDB from "./db/db";

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
  jwt,
  multer,
  nodemailer,
  authRoutes,
  fileShareRoutes,
  userModel,
  verificationModel,
  connectDB,
};
