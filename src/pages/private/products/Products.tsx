// components/Products.tsx
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
  Paper,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import ProductFormDialog from "./ProductFormDialog";

interface Product {
  id: string;
  name: string;
  description: string;
  upc_code: string;
  ean_code: string;
  unit_price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  photo?: string;
}

export default function Products(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fetchProducts = (): void => {
    axios
      .get("https://nestjs-blog-backend-api.desarrollo-software.xyz/products")
      .then((res) => {
        setProducts(res.data.data.items);
        setFailedImages({}); // Reset failed images so updated ones can try again
      });
  };

  useEffect(fetchProducts, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const remove = (id: string): void => {
    if (confirm("¿Eliminar este producto?")) {
      axios
        .delete(`https://nestjs-blog-backend-api.desarrollo-software.xyz/products/${id}`)
        .then(fetchProducts);
    }
  };

  const openNew = (): void => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p: Product): void => {
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description,
      upc_code: p.upc_code,
      ean_code: p.ean_code,
      unit_price: p.unit_price,
      photo: p.photo,
      categoryId: p.category!.id,
    });
    setOpen(true);
  };

  const handleImageError = (id: string): void => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Productos</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button variant="contained" onClick={openNew}>
          Nuevo producto
        </Button>
      </Box>

      <List>
        {filtered.map((p) => (
          <ListItem key={p.id} alignItems="flex-start">
            <Paper elevation={1} sx={{ width: 100, height: 100, overflow: 'hidden', mr: 2 }}>
              {p.photo && !failedImages[p.id] ? (
                <img
                  src={`https://nestjs-blog-backend-api.desarrollo-software.xyz/uploads/products/${p.photo}`}
                  alt={p.name}
                  onError={() => handleImageError(p.id)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: '100%', height: '100%', bgcolor: '#f0f0f0' }}
                >
                  <Typography variant="caption">Sin imagen</Typography>
                </Box>
              )}
            </Paper>
            <ListItemText
              primary={p.name}
              secondary={`$${p.unit_price} | ${p.description}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => openEdit(p)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => remove(p.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <ProductFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSaved={fetchProducts}
        product={editing}
      />
    </Box>
  );
}
