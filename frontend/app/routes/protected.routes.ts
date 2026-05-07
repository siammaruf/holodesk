import { route } from "react-router-dom";

export const protectedRoutes = [
  { path: "/app", element: "pages/dashboard/index.tsx" },
  { path: "/play/:id", element: "pages/play/detail.tsx" },
  { path: "/editor/:id", element: "pages/editor/detail.tsx" },
  { path: "/manage/:id", element: "pages/manage/detail.tsx" },
];
