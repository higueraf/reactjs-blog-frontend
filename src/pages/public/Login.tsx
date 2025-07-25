import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    try {
      setError(null);
      const response = await axios.post(
        "https://nestjs-blog-backend-api.desarrollo-software.xyz/auth/login",
        { username, password }
      );

      if (response.data.success) {
        const { access_token } = response.data.data;
        const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
        const { username, email } = decodedToken;
        login({ username, email });
        localStorage.setItem("token", access_token);
        navigate("/dashboard");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud de login", error);
      setError("Hubo un problema al iniciar sesión.");
    }
  };

  return (
    <Box 
      p={4} 
      maxWidth="400px" 
      mx="auto"
      data-testid="login-page" // Añadido para las pruebas
    >
      <TextField
        label="Nombre de usuario"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ "data-testid": "username-input" }} // Añadido
      />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ "data-testid": "password-input" }} // Añadido
      />
      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleSubmit}
        data-testid="login-button" // Añadido
      >
        Ingresar
      </Button>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          data-testid="error-message" // Añadido
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
