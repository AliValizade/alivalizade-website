import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// اضافه کردن توکن به هر درخواست
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.access) {
          config.headers.Authorization = `Bearer ${state.access}`;
        }
      } catch {
        // ignore
      }
    }
  }
  return config;
});

// Skills
export const getSkills = async () => {
  const res = await api.get("/skills/");
  return res.data;
};

// Experiences
export const getExperiences = async () => {
  const res = await api.get("/experiences/");
  return res.data;
};

// Educations
export const getEducations = async () => {
  const res = await api.get("/educations/");
  return res.data;
};

// Projects
export const getProjects = async () => {
  const res = await api.get("/projects/");
  return res.data;
};

// Courses
export const getCourses = async () => {
  const res = await api.get("/courses/");
  return res.data;
};

export const getCourseBySlug = async (slug: string) => {
  const res = await api.get(`/courses/${slug}/`);
  return res.data;
};

// Site Settings
export const getSiteSettings = async () => {
  const res = await api.get("/settings/");
  return res.data;
};

// Auth
export const register = async (data: {
  username: string;
  email: string;
  password1: string;
  password2: string;
}) => {
  const res = await api.post("/auth/registration/", data);
  return res.data;
};

export const login = async (data: { username: string; password: string }) => {
  const res = await api.post("/auth/login/", data);
  return res.data;
};

export const getUser = async () => {
  const res = await api.get("/auth/user/");
  return res.data;
};

export default api;