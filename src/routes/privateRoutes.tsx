import Posts from "../pages/private/posts/Posts";
import  Categories  from "../pages/private/categories/Categories";
import Users from "../pages/private/users/Users";
import { DashboardLayout } from "../layouts/DashboardLayout";

import type { RouteObject } from "react-router-dom";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    element: <DashboardLayout />,
  children: [
    { path: "posts", element: <Posts /> },
    { path: "categories", element: <Categories /> },
    { path: "users", element: <Users /> },
  ],
};