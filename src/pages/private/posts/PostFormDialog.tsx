
// components/PostFormDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState, useEffect, type JSX } from "react";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  summary?: string;
  content?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  post: Post | null;
}

export default function PostFormDialog({ open, onClose, onSaved, post }: Props): JSX.Element {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSummary(post.summary || "");
      setContent(post.content || "");
    } else {
      setTitle("");
      setSummary("");
      setContent("");
    }
  }, [post]);

  const handleSave = (): void => {
    const data = { title, summary, content };
    const req = post
      ? axios.put(`https://nestjs-blog-backend-api.desarrollo-software.xyz/posts/${post.id}`, data)
      : axios.post("https://nestjs-blog-backend-api.desarrollo-software.xyz/posts", data);

    req.then(() => {
      onSaved();
      onClose();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{post ? "Editar post" : "Nuevo post"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Resumen"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          fullWidth
        />
        <TextField
          label="Contenido"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
  