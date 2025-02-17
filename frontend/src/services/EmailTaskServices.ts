import requests from "./httpRequest";

const EmailTaskServices = {
  getAllEmailTask: async (): Promise<ApiResponse<IEmailTask[]>> =>
    requests.get("/email-task/user"),
  createEmailTask: async (
    body: Pick<IEmailTask, "email" | "howMuchMessage" | "subject" | "message">
  ): Promise<ApiResponse<IEmailTask>> =>
    requests.post("/email-task/create", body),
};

export default EmailTaskServices;
