import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
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

// Site Settings
export const getSiteSettings = async () => {
  const res = await api.get("/settings/");
  return res.data;
};

export default api;