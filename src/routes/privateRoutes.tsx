import Posts from "../pages/private/posts/Posts";
import  Categories  from "../pages/private/categories/Categories";
import Users from "../pages/private/users/Users";
import DashboardLayout from "../layouts/DashboardLayout";

import type { RouteObject } from "react-router-dom";
import PrivateRoute  from "./PrivateRoute";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "posts", element: <Posts /> },
    { path: "categories", element: <Categories /> },
    { path: "users", element: <Users /> },
  ],
};