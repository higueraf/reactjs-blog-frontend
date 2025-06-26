import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function from AuthContext

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await axios.post(
        "https://nestjs-blog-backend-api.desarrollo-software.xyz/auth/login",
        {
          username: username,
          password,
        }
      );

      if (response.data.success) {
        const { access_token } = response.data.data;
        const decodedToken = JSON.parse(atob(access_token.split('.')[1])); // Decodificar el JWT
        const { username, email } = decodedToken; // Extraer username y email
        login({ username, email }); // Guardar datos del usuario y token en el contexto
        localStorage.setItem("token", access_token); // Almacenar el token en localStorage
        navigate("/dashboard"); // Redirigir al dashboard
      } else {
        alert("Error al iniciar sesión. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud de login", error);
      alert("Hubo un problema al iniciar sesión.");
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <TextField
        label="Nombre de usuario"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button fullWidth variant="contained" onClick={handleSubmit}>
        Ingresar
      </Button>
    </Box>
  );
}
