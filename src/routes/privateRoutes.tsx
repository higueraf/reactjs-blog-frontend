/*import { PostList } from "../pages/private/Posts";
import { Categories } from "../pages/private/Categories";
import { Users } from "../pages/private/Users";*/
import { DashboardLayout } from "../layouts/DashboardLayout";

import type { RouteObject } from "react-router-dom";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    element: <DashboardLayout />,
    /*
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { path: "posts", element: <PostList /> },
    { path: "categories", element: <Categories /> },
    { path: "users", element: <Users /> },
  ],*/
};