// src/features/auth/services/authService.ts
import axiosInstance from "@/services/axios";

export const signup = (payload: { email: string; password: string }) =>
    axiosInstance.post("/auths/signup/", payload);

export const login = (payload: { email: string; password: string }) =>
    axiosInstance.post("/auths/login/", payload);

export const sendOTP = () =>
    axiosInstance.post("/auths/send-otp/");

export const verifyOTP = (payload: { otp: string }) =>
    axiosInstance.post("/auths/verify-otp/", payload);
