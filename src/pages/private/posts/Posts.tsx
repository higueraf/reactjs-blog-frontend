
// pages/private/Posts.tsx
import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import PostFormDialog from "./PostFormDialog";

interface Post {
  id: string;
  title: string;
  summary?: string;
  content?: string;
}

export default function Posts(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Post | null>(null);

  const fetchPosts = (): void => {
    axios.get("https://nestjs-blog-backend-api.desarrollo-software.xyz/posts")
      .then(res => setPosts(res.data.data.items));
  }

  useEffect(fetchPosts, []);

  const filtrados = posts.filter(p =>
    p.title.toLowerCase().includes(filtro.toLowerCase())
  );

  const eliminar = (id: string): void => {
    if (confirm("¿Eliminar este post?")) {
      axios.delete(`https://nestjs-blog-backend-api.desarrollo-software.xyz/posts/${id}`)
        .then(fetchPosts);
    }
  }

  const abrirNuevo = (): void => {
    setEditando(null);
    setOpen(true);
  }

  const abrirEditar = (post: Post): void => {
    setEditando(post);
    setOpen(true);
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Posts</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button variant="contained" onClick={abrirNuevo}>
          Nuevo post
        </Button>
      </Box>

      <List>
        {filtrados.map((post) => (
          <ListItem key={post.id}>
            <ListItemText primary={post.title} secondary={post.summary} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => abrirEditar(post)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => eliminar(post.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <PostFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSaved={fetchPosts}
        post={editando}
      />
    </Box>
  );
}
  