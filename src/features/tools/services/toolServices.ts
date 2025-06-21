// src/features/auth/services/authService.ts
import axiosInstance from "@/services/axios";

export const fetchInstalledTools = async () => {
  const response = await axiosInstance.get("/tools");
  return response.data;
};
