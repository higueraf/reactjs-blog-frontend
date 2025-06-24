import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";
import type { RouteObject } from "react-router-dom";

export const appRoutes: RouteObject[] = [publicRoutes, privateRoutes];