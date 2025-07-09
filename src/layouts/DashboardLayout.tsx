import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../context/AuthContext";  // Importar el hook useAuth para acceder al contexto

interface MenuItemType {
  text: string;
  path: string;
}

const menuItems: MenuItemType[] = [
  { text: "Cursos", path: "/dashboard/courses" },
  { text: "Posts", path: "/dashboard/posts" },
  { text: "Categorías", path: "/dashboard/categories" },
  { text: "Usuarios", path: "/dashboard/users" },
];

export default function DashboardLayout(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario desde el contexto
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserClick = (e: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{ width: 200, [`& .MuiDrawer-paper`]: { width: 200 } }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.text}>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box flexGrow={1}>
        <AppBar position="static" sx={{ bgcolor: "#222" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/022/791/223/small/blog-site-blogger-png.png"
                alt="logo"
                width="32"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              BlogApp Admin
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={handleUserClick}
              sx={{ cursor: "pointer" }}
            >
              <Avatar src="/user.png" />
              <Typography>{user?.username || "Usuario"}</Typography> {/* Aquí mostramos el nombre del usuario */}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Salir</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
