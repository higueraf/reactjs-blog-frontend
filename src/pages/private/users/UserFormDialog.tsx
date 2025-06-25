// components/UserFormDialog.tsx
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
  } from "@mui/material";
  import { useState, useEffect, type JSX } from "react";
  import axios from "axios";
  
  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
  }
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    user: User | null;
  }
  
  export default function UserFormDialog({ open, onClose, onSaved, user }: Props): JSX.Element {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    useEffect(() => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
      } else {
        setName("");
        setEmail("");
      }
    }, [user]);
  
    const handleSave = (): void => {
      const data = { email, password, username };
      const request = user
        ? axios.put(`https://nestjs-blog-backend-api.desarrollo-software.xyz/users/${user.id}`, data)
        : axios.post("https://nestjs-blog-backend-api.desarrollo-software.xyz/users", data);
  
      request.then(() => {
        onSaved();
        onClose();
      });
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{user ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  }