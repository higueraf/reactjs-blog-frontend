// pages/private/Users.tsx
import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import UserFormDialog from "./UserFormDialog";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Users(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<User | null>(null);

  const fetchUsers = (): void => {
    axios.get("https://nestjs-blog-backend-api.desarrollo-software.xyz/users")
        .then((res) => setUsers(res.data.data.items));
  };

  useEffect(fetchUsers, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  const remove = (id: string): void => {
    if (confirm("¿Eliminar este usuario?")) {
      axios.delete(`https://nestjs-blog-backend-api.desarrollo-software.xyz/users/${id}`).then(fetchUsers);
    }
  };

  const openNew = (): void => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (user: User): void => {
    setEditing(user);
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Usuarios</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button variant="contained" onClick={openNew}>Nuevo usuario</Button>
      </Box>

      <List>
        {filtered.map((u) => (
          <ListItem key={u.id}>
            <ListItemText primary={u.name} secondary={u.email} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => openEdit(u)}><Edit /></IconButton>
              <IconButton onClick={() => remove(u.id)}><Delete /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <UserFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSaved={fetchUsers}
        user={editing}
      />
    </Box>
  );
}