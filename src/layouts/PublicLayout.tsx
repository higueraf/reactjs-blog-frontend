import { Box } from "@mui/material";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Outlet } from "react-router-dom";
import type { JSX } from "react";

export function PublicLayout(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <PublicHeader />
      <Box flex="1">
        <Outlet />
      </Box>
      <PublicFooter />
    </Box>
  );
}