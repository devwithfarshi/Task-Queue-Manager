/// <reference types="vite/client" />
type T_USER_ROLE = "admin" | "user" | "moderator";
type T_TASK_PRIORITY = "low" | "medium" | "high";
type T_TASK_STATUS =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed"
  | "canceled";

interface IUser {
  _id?: string;
  username: string;
  email: string;
  role: T_USER_ROLE;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: T_TASK_STATUS;
  priority: T_TASK_PRIORITY;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: IUser["_id"];
  priority: "low" | "medium" | "high";
}
interface IEmailTask {
  _id?: string;
  email: string;
  subject: string;
  message: string;
  howMuchMessage: number;
  status?: T_TASK_STATUS;
  userId?: IUser["_id"];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}
