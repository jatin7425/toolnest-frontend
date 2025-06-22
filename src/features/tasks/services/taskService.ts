import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/constants";
import { TaskRequest, DailyTaskRequest, TaskInstanceRequest } from "@/features/tasks/types";

// Utility to get correct endpoint by type
const getEndpoint = (type: "single" | "daily" | "instance") => {
  switch (type) {
    case "single":
      return API_ENDPOINTS.TASKS.SINGLE_TASKS;
    case "daily":
      return API_ENDPOINTS.TASKS.DAILY_TASKS;
    case "instance":
      return API_ENDPOINTS.TASKS.TASKS_INSTANCES;
  }
};

// Generic CRUD for all task types
export const getAllTasks = async (type: "single" | "daily" | "instance") => {
  const res = await axiosInstance.get(getEndpoint(type));
  return res.data;
};

export const getTaskById = async (type: "single" | "daily" | "instance", id: number) => {
  const res = await axiosInstance.get(`${getEndpoint(type)}${id}/`);
  return res.data;
};

export const createTask = async (
  type: "single" | "daily" | "instance",
  payload: TaskRequest | DailyTaskRequest | TaskInstanceRequest
) => {
  const res = await axiosInstance.post(getEndpoint(type), payload);
  return res.data;
};

export const updateTask = async (
  type: "single" | "daily" | "instance",
  id: number,
  payload: Partial<TaskRequest | DailyTaskRequest | TaskInstanceRequest>
) => {
  const res = await axiosInstance.patch(`${getEndpoint(type)}${id}/`, payload);
  return res.data;
};

export const deleteTask = async (type: "single" | "daily" | "instance", id: number) => {
  return axiosInstance.delete(`${getEndpoint(type)}${id}/`);
};

export const toggleCompleteTask = async (type: "single" | "daily" | "instance", id: number) => {
  const res = await axiosInstance.post(`${getEndpoint(type)}${id}/toggle-complete/`, {});
  return res.data;
};
