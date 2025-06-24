import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  content: string;
}

export function PostDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect((): void => {
    axios.get(`https://nestjs-blog-backend-api.desarrollo-software.xyz/posts/${id}`)
      .then(res => setPost(res.data.data))
      .catch(() => navigate("/"));
  }, [id]);

  if (!post) return <p>Cargando...</p>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>{post.title}</Typography>
      <Typography variant="body1" paragraph>{post.content}</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        ← Volver
      </Button>
    </Box>
  );
}