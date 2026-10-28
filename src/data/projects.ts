export type Project = {
  topic: string;
  title: string;
  description: string;
  tech: string[];
  url: string;
  status?: "In progress";
  date: string;
};

// Add a project by adding one object. The page sorts by `date`, newest first.
// {
//   topic: "Computer Vision",
//   title: "vision-api",
//   description: "A FastAPI service that detects objects in uploaded images with a fine-tuned YOLO model.",
//   tech: ["Python", "FastAPI", "PyTorch", "OpenCV", "Docker"],
//   url: "https://github.com/amiralicv/vision-api",
//   status: "In progress",
//   date: "YYYY-MM-DD"
// },
export const projects: Project[] = [
  {
    topic: "Backend API",
    title: "weather-data-api",
    description: "A FastAPI service that serves weather data through a REST API.",
    tech: ["Python", "FastAPI"],
    url: "https://github.com/amiralicv/weather-data-api",
    status: "In progress",
    date: "2026-10-14",
  },
];
