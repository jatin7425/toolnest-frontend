"use client";

import axiosInstance from "@/services/axios";
import { useEffect, useState } from "react";
import {
  TOKEN_KEY,
  TOKEN_TIMESTAMP_KEY,
  EXPIRY_HOURS,
  API_ENDPOINTS,
} from "@/constants";

// API Calls
export const signup = (payload: { email: string; password: string }) =>
  axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, payload);

export const login = (payload: { email: string; password: string }) =>
  axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, payload);

export const sendOTP = () =>
  axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP);

export const verifyOTP = (payload: { otp: string }) =>
  axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);

// Token Management
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

export const checkTokenExpiry = () => {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return;

  const now = Date.now();
  const saved = parseInt(timestamp, 10);
  const diffInHours = (now - saved) / (1000 * 60 * 60); // ms → hours

  if (diffInHours >= EXPIRY_HOURS) {
    logout();
  }
};

// Client Hook
export const useIsLoggedIn = (): boolean => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkTokenExpiry();
    const token = localStorage.getItem(TOKEN_KEY);
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn;
};
