// components/ProductFormDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect, type JSX } from "react";
import axiosInstance from "../../../api/axios";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  upc_code: string;
  ean_code: string;
  unit_price: number;
  categoryId: string;
  photo?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  product: Product | null;
}

export default function ProductFormDialog({
  open,
  onClose,
  onSaved,
  product,
}: Props): JSX.Element {
  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    upc_code: "",
    ean_code: "",
    unit_price: 0,
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axiosInstance.get("/categories")
      .then((res) => setCategories(res.data.data.items));
  }, []);

  useEffect(() => {
    setForm(product ?? {
      name: "",
      description: "",
      upc_code: "",
      ean_code: "",
      unit_price: 0,
      categoryId: "",
    });
    setFile(null);
  }, [product]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setForm({ ...form, categoryId: e.target.value });
  };

  const handleSave = async (): Promise<void> => {
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, String((form as any)[key]));
    }
    if (file) formData.append("photo", file);

    const endpoint = product
      ? `/products/${product.id}`
      : "/products";

    const method = product ? axiosInstance.put : axiosInstance.post;
    await method(endpoint, formData);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
      <DialogContent sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth />
        <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} fullWidth />
        <TextField label="UPC Code" name="upc_code" value={form.upc_code} onChange={handleChange} fullWidth />
        <TextField label="EAN Code" name="ean_code" value={form.ean_code} onChange={handleChange} fullWidth />
        <TextField label="Precio" name="unit_price" type="number" value={form.unit_price} onChange={handleChange} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={form.categoryId}
            onChange={handleSelectChange}
            label="Categoría"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" component="label">
          Seleccionar Imagen
          <input
            type="file"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
        </Button>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
