// import axiosInstance from "./axiosInstance";

import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import store from "../redux/store";
import { } from "../redux/adminAuthSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.adminAuth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);