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
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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
  const { id } = useParams<{ id: string }>(); // Obtenemos el id del curso de la URL
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
  const [contenidoTemp, setContenidoTemp] = useState<Contenido>({
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
  });

  // Estado para manejar las pestañas
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (id) {
      // Si el id está presente, es un formulario de edición
      const fetchCourse = async () => {
        try {
          const response = await axios.get(
            `https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos/${id}`
          );
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching course:", error);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // Si hay un id, se actualiza el curso
        await axios.put(
          `https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos/${id}`,
          formData
        );
        alert("Curso actualizado con éxito");
      } else {
        // Si no hay id, se crea un nuevo curso
        await axios.post(
          `https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos`,
          formData
        );
        alert("Curso creado con éxito");
      }
      navigate("/dashboard/courses"); // Redirige a la lista de cursos después de guardar
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const addContenido = () => {
    setFormData({
      ...formData,
      contenidos: [...formData.contenidos, contenidoTemp],
    });
    setContenidoTemp({
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
    });
  };

  const removeContenido = (index: number) => {
    setFormData({
      ...formData,
      contenidos: formData.contenidos.filter((_, i) => i !== index),
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? "Editar Curso" : "Crear Curso"}
      </Typography>

      {/* Tabs */}
      <Tabs value={value} onChange={handleChange} aria-label="course form tabs">
        <Tab label="Información General" />
        <Tab label="Contenidos" />
      </Tabs>

      {/* Formulario de Curso */}
      <form onSubmit={onSubmit}>
        {value === 0 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Categoría"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Fecha de Inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_inicio: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Fecha de Fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_fin: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nivel"
                  value={formData.nivel}
                  onChange={(e) =>
                    setFormData({ ...formData, nivel: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Requisitos"
                  value={formData.requisitos.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requisitos: e.target.value.split(", "),
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: Number(e.target.value) })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Instructor Nombre"
                  value={formData.instructor.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: {
                        ...formData.instructor,
                        nombre: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Instructor Email"
                  value={formData.instructor.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: {
                        ...formData.instructor,
                        email: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Formulario de Contenidos */}
        {value === 1 && (
          <Box mt={2}>
            <Typography variant="h6">Añadir Contenido</Typography>
            <TextField
              label="Título"
              value={contenidoTemp.titulo}
              onChange={(e) =>
                setContenidoTemp({ ...contenidoTemp, titulo: e.target.value })
              }
            />
            <TextField
              label="Duración"
              type="number"
              value={contenidoTemp.duracion}
              onChange={(e) =>
                setContenidoTemp({
                  ...contenidoTemp,
                  duracion: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Descripción"
              value={contenidoTemp.descripcion}
              onChange={(e) =>
                setContenidoTemp({
                  ...contenidoTemp,
                  descripcion: e.target.value,
                })
              }
            />
            <TextField
              label="Tipo"
              value={contenidoTemp.tipo}
              onChange={(e) =>
                setContenidoTemp({ ...contenidoTemp, tipo: e.target.value })
              }
            />
            <TextField
              label="Enlace"
              value={contenidoTemp.enlace}
              onChange={(e) =>
                setContenidoTemp({ ...contenidoTemp, enlace: e.target.value })
              }
            />
            <TextField
              label="Dificultad"
              value={contenidoTemp.dificultad}
              onChange={(e) =>
                setContenidoTemp({
                  ...contenidoTemp,
                  dificultad: e.target.value,
                })
              }
            />
            <TextField
              label="Fecha de Publicación"
              type="date"
              value={contenidoTemp.fecha_publicacion}
              onChange={(e) =>
                setContenidoTemp({
                  ...contenidoTemp,
                  fecha_publicacion: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Tiempo Estimado"
              value={contenidoTemp.tiempo_estimado}
              onChange={(e) =>
                setContenidoTemp({
                  ...contenidoTemp,
                  tiempo_estimado: e.target.value,
                })
              }
            />
            <TextField
              label="Video ID"
              value={contenidoTemp.video_id}
              onChange={(e) =>
                setContenidoTemp({ ...contenidoTemp, video_id: e.target.value })
              }
            />
            <Button variant="contained" color="primary" onClick={addContenido}>
              Añadir Contenido
            </Button>
          </Box>
        )}

        {/* Tabla de Contenidos */}
        {value === 1 && (
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
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeContenido(index)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          {id ? "Actualizar Curso" : "Crear Curso"}
        </Button>
      </form>
    </Box>
  );
};

export default CourseForm;
