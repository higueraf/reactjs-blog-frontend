import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Curso {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha_inicio: string;
  fecha_fin: string;
  nivel: string;
  requisitos: string[];
  precio: number;
  instructor: { nombre: string; email: string };
}

const CoursesList: React.FC = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [cursos, setCursos] = useState<Curso[]>([]);

  // Cargar cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos?page=1&limit=20');
        setCursos(response.data.data.items);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Navegar al formulario de edición
  const handleEdit = (curso: Curso): void => {
    navigate(`/dashboard/course-form/${curso._id}`);
  };

  // Navegar al formulario de nuevo curso
  const newCourse = (): void => {
    navigate("/dashboard/course-form");
  };

  // Eliminar un curso
  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        await axios.delete(`https://nestjs-blog-backend-api.desarrollo-software.xyz/cursos/${id}`);
        setCursos(cursos.filter((curso) => curso._id !== id)); // Eliminar el curso de la lista local
        alert('Curso eliminado con éxito');
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lista de Cursos
      </Typography>

      {/* Botón para nuevo curso */}
      <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={newCourse}>
          Nuevo Curso
        </Button>
      </div>

      {/* Tabla de cursos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Fecha de Inicio</TableCell>
              <TableCell>Fecha de Fin</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{curso.descripcion}</TableCell>
                <TableCell>{curso.categoria}</TableCell>
                <TableCell>{curso.fecha_inicio}</TableCell>
                <TableCell>{curso.fecha_fin}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(curso)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(curso._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CoursesList;
