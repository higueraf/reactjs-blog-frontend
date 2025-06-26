import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Register(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function from AuthContext

  const handleSubmit = async (): Promise<void> => {
    if (!email.includes("@") || username.trim() === "" || password.trim() === "") {
      alert("Nombre, correo y contraseña válidos son requeridos.");
      return;
    }

    try {
      const response = await axios.post(
        "https://nestjs-blog-backend-api.desarrollo-software.xyz/auth/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.data.success) {
        login({ username: username, email }); // save user data and token in context
        localStorage.setItem("token", response.data.data.access_token); // store token in localStorage
        navigate("/dashboard/posts");
      } else {
        alert("Error al registrarse. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud de registro", error);
      alert("Hubo un problema al registrarse.");
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <TextField
        label="Nombre de Usuario"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        Registrarse
      </Button>
    </Box>
  );
}
