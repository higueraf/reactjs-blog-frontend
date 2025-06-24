import { Home } from "../pages/public/Home";
import { PostDetail } from "../pages/public/PostDetail";
import { PublicLayout } from "../layouts/PublicLayout";
import type { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "post/:id", element: <PostDetail /> },
  ],
};