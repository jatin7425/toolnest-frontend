"use client";
import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/axios";

export const fetchInstalledTools = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.TOOLS.GET_ALL);
  return response.data;
};
