// pages/private/Categories.tsx
import { useState, useEffect, type JSX } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import CategoryFormDialog from "./CategoryFormDialog";

interface Category {
  id: string;
  name: string;
}

export default function Categories(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetchCategories = (): void => {
    axios
      .get("https://nestjs-blog-backend-api.desarrollo-software.xyz/categories")
      .then((res) => setCategories(res.data.data.items));
  };

  useEffect(fetchCategories, []);

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filter.toLowerCase())
  );

  const remove = (id: string): void => {
    if (confirm("¿Eliminar esta categoría?")) {
      axios
        .delete(`https://nestjs-blog-backend-api.desarrollo-software.xyz/categories/${id}`)
        .then(fetchCategories);
    }
  };

  const openNew = (): void => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (cat: Category): void => {
    setEditing(cat);
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Categorías</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button variant="contained" onClick={openNew}>
          Nueva categoría
        </Button>
      </Box>

      <List>
        {filtered.map((cat) => (
          <ListItem key={cat.id}>
            <ListItemText primary={cat.name} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => openEdit(cat)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => remove(cat.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <CategoryFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSaved={fetchCategories}
        category={editing}
      />
    </Box>
  );
}
