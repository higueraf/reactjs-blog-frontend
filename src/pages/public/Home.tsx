import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  summary?: string;
  content?: string;
}

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Asegurarse de que error pueda ser string o null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          'https://nestjs-blog-backend-api.desarrollo-software.xyz/posts?page=1&limit=2'
        );
        setPosts(response.data.data.items);
        setError(null); // Resetear error en caso de que la API funcione correctamente
      } catch (err) {
        setError('Error al cargar los posts'); // Asignar un mensaje de error adecuado
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false); // Terminar el estado de carga
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <CircularProgress />; // Mientras se cargan los posts, mostrar el CircularProgress
  if (error) return <Alert severity="error" data-testid="error-message">{error}</Alert>; // Mostrar el error si falla la carga

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Últimos posts</Typography>
      
      {posts.map(post => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.summary || post.content?.slice(0, 100) + "..." }
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => navigate(`/post/${post.id}`)}>
              Leer más
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
