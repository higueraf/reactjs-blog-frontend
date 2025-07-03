import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Contenido {
  titulo: string;
  duracion: number;
  descripcion: string;
  tipo: string;
  enlace: string;
  dificultad: string;
  fecha_publicacion: string;
  completado: boolean;
  tiempo_estimado: string;
  video_id: string;
}

interface Curso {
  _id?: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha_inicio: string;
  fecha_fin: string;
  nivel: string;
  requisitos: string[];
  precio: number;
  instructor: { nombre: string; email: string };
  contenidos: Contenido[];
}

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Curso>({
    nombre: "",
    descripcion: "",
    categoria: "",
    fecha_inicio: "",
    fecha_fin: "",
    nivel: "",
    requisitos: [],
    precio: 0,
    instructor: { nombre: "", email: "" },
    contenidos: [],
  });

  const [contenidoTemp, setContenidoTemp] = useState<Contenido>(initContenido());
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (id) {
      axios.get(`https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos/${id}`).then((res) => {
        const curso = res.data.data;
        setFormData({
          ...curso,
          fecha_inicio: formatDate(curso.fecha_inicio),
          fecha_fin: formatDate(curso.fecha_fin),
          contenidos: curso.contenidos.map((c: any) => ({
            ...c,
            fecha_publicacion: formatDate(c.fecha_publicacion),
          })),
        });
      });
    }
  }, [id]);

  function formatDate(fecha: string): string {
    return fecha?.substring(0, 10);
  }

  function initContenido(): Contenido {
    return {
      titulo: "",
      duracion: 0,
      descripcion: "",
      tipo: "",
      enlace: "",
      dificultad: "",
      fecha_publicacion: "",
      completado: false,
      tiempo_estimado: "",
      video_id: "",
    };
  }

  function handleContenidoSubmit() {
    if (editIndex !== null) {
      const nuevos = [...formData.contenidos];
      nuevos[editIndex] = contenidoTemp;
      setFormData({ ...formData, contenidos: nuevos });
      setEditIndex(null);
    } else {
      setFormData({ ...formData, contenidos: [...formData.contenidos, contenidoTemp] });
    }
    setContenidoTemp(initContenido());
  }

  function handleEdit(index: number) {
    setContenidoTemp(formData.contenidos[index]);
    setEditIndex(index);
  }

  function handleRemove(index: number) {
    const nuevos = formData.contenidos.filter((_, i) => i !== index);
    setFormData({ ...formData, contenidos: nuevos });
    setEditIndex(null);
  }

  const cleanContenido = (contenido: any) => ({
  titulo: contenido.titulo,
  duracion: contenido.duracion,
  descripcion: contenido.descripcion,
  tipo: contenido.tipo,
  enlace: contenido.enlace,
  dificultad: contenido.dificultad,
  fecha_publicacion: contenido.fecha_publicacion,
  completado: contenido.completado,
  tiempo_estimado: contenido.tiempo_estimado,
  video_id: contenido.video_id,
});

const cleanFormData = {
  nombre: formData.nombre,
  descripcion: formData.descripcion,
  categoria: formData.categoria,
  fecha_inicio: formData.fecha_inicio,
  fecha_fin: formData.fecha_fin,
  nivel: formData.nivel,
  requisitos: formData.requisitos,
  precio: formData.precio,
  instructor: {
    nombre: formData.instructor.nombre,
    email: formData.instructor.email,
  },
  calificacion_promedio:  0,
  estado:  'Pendiente',
  contenidos: formData.contenidos.map(cleanContenido),
};

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (id) {
      await axios.put(`https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos/${id}`, cleanFormData);
      alert("Curso actualizado con éxito");
    } else {
      await axios.post(`https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos`, cleanFormData);
      alert("Curso creado con éxito");
    }
    navigate("/dashboard/courses");
  } catch (error) {
    console.error("Error saving course:", error);
    alert("Ocurrió un error al guardar el curso.");
  }
};


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? "Editar Curso" : "Crear Curso"}
      </Typography>

      <Tabs value={tab} onChange={(_, t) => setTab(t)}>
        <Tab label="Información General" />
        <Tab label="Contenidos" />
      </Tabs>

      <form onSubmit={onSubmit}>
        {tab === 0 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Categoría" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Fecha de Inicio" type="date" value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Fecha de Fin" type="date" value={formData.fecha_fin} onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nivel" value={formData.nivel} onChange={(e) => setFormData({ ...formData, nivel: e.target.value })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Requisitos" value={formData.requisitos.join(", ")} onChange={(e) => setFormData({ ...formData, requisitos: e.target.value.split(", ") })} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Precio" type="number" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Instructor Nombre" value={formData.instructor.nombre} onChange={(e) => setFormData({ ...formData, instructor: { ...formData.instructor, nombre: e.target.value } })} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Instructor Email" value={formData.instructor.email} onChange={(e) => setFormData({ ...formData, instructor: { ...formData.instructor, email: e.target.value } })} fullWidth required />
              </Grid>
            </Grid>
          </Box>
        )}

        {tab === 1 && (
          <Box mt={2}>
            <Typography variant="h6">{editIndex !== null ? "Editar Contenido" : "Añadir Contenido"}</Typography>
            <Grid container spacing={2}>
              {[
                ["Título", "titulo"],
                ["Duración", "duracion"],
                ["Descripción", "descripcion"],
                ["Tipo", "tipo"],
                ["Enlace", "enlace"],
                ["Dificultad", "dificultad"],
                ["Fecha de Publicación", "fecha_publicacion"],
                ["Tiempo Estimado", "tiempo_estimado"],
                ["Video ID", "video_id"],
              ].map(([label, key]) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <TextField
                    label={label}
                    type={key === "fecha_publicacion" ? "date" : key === "duracion" ? "number" : "text"}
                    value={(contenidoTemp as any)[key]}
                    onChange={(e) =>
                      setContenidoTemp({ ...contenidoTemp, [key]: key === "duracion" ? Number(e.target.value) : e.target.value })
                    }
                    fullWidth
                    InputLabelProps={key === "fecha_publicacion" ? { shrink: true } : undefined}
                  />
                </Grid>
              ))}
              <Grid size={{ xs: 12 }}>
                <Button onClick={handleContenidoSubmit} variant="contained">
                  {editIndex !== null ? "Actualizar Contenido" : "Añadir Contenido"}
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Duración</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.contenidos.map((contenido, index) => (
                    <TableRow key={index}>
                      <TableCell>{contenido.titulo}</TableCell>
                      <TableCell>{contenido.duracion} mins</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(index)} color="primary">Editar</Button>
                        <Button onClick={() => handleRemove(index)} color="error">Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
          {id ? "Actualizar Curso" : "Crear Curso"}
        </Button>
      </form>
    </Box>
  );
};

export default CourseForm;
