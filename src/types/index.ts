import { Document, Types } from "mongoose";
import { EnterInput, UserSignupInput } from "./validation";

// User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Entry Interface
export interface IEntry extends Document , EnterInput{
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  fullName: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  createdAt: Date;
  updatedAt: Date;
}

// Session User (stored in session)
export interface SessionUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  createdAt: Date;
}

// Express Session Extension
declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: SessionUser;
  }
}

// Express Request Extension
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
