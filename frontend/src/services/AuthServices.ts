import { RegisterFormValues } from "@/pages/Register";
import requests from "./httpRequest";

const AuthServices = {
  register: async (body: RegisterFormValues): Promise<ApiResponse<null>> =>
    requests.post("/auth/register", body),
  login: async (
    body: Pick<RegisterFormValues, "email" | "password">
  ): Promise<ApiResponse<{ accessToken: string; _id: string }>> =>
    requests.post("/auth/login", body),
  me: async (): Promise<ApiResponse<IUser>> => requests.get("/auth/me"),
};

export default AuthServices;
