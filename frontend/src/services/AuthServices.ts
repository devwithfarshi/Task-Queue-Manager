import { RegisterFormValues } from "@/pages/Auth/Register";
import requests from "./httpRequest";

const AuthServices = {
  register: async (body: RegisterFormValues): Promise<ApiResponse<null>> =>
    requests.post("/auth/register", body),
  login: async (
    body: Pick<RegisterFormValues, "email" | "password">
  ): Promise<ApiResponse<{ accessToken: string; _id: string }>> =>
    requests.post("/auth/login", body),
  me: async (): Promise<ApiResponse<IUser>> => requests.get("/auth/me"),
  verifyEmail: async (token: string): Promise<ApiResponse<null>> =>
    requests.get(`/auth/verify-email/${token}`),
  forgotPassword: async (email: string): Promise<ApiResponse<null>> =>
    requests.post("/auth/forgot-password", { email }),
  resetPassword: async (
    newPassword: string,
    token: string
  ): Promise<ApiResponse<null>> =>
    requests.post("/auth/reset-password", { newPassword, token }),
};

export default AuthServices;
