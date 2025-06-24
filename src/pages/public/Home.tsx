import { useEffect, useState, type JSX } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  summary?: string;
  content?: string;
}

export function Home(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://nestjs-blog-backend-api.desarrollo-software.xyz/posts?page=1&limit=2")
      .then((res) => setPosts(res.data.data.items))
      .catch(() => setPosts([]));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Últimos posts</Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.summary || post.content?.slice(0, 100) + "..."}
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