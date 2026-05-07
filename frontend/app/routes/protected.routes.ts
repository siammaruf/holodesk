import { route, index } from "@react-router/dev/routes";

export const protectedRoutes = [
  index("pages/dashboard/index.tsx"),
  route("profile", "pages/dashboard/profile.tsx"),
  route("users", "pages/dashboard/users/index.tsx"),
  route("users/create", "pages/dashboard/users/create.tsx"),
];