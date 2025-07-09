/// <reference types="cypress" />
import Login from '../../src/pages/public/Login'; // Importación correcta para exportaciones predeterminadas
import { mount } from '@cypress/react'; // Importa la función mount para pruebas de componentes
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter para envolver el componente
import { AuthProvider } from '../../src/context/AuthContext'; // Asegúrate de importar el AuthProvider

describe('Componente Login', () => {
  
  // Mock de la respuesta de la API antes de cada prueba
  beforeEach(() => {
    cy.intercept('POST', 'https://nestjs-blog-backend-api.desarrollo-software.xyz/auth/login', (req) => {
      if (req.body.username === 'testuser' && req.body.password === 'password123') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              access_token: 'mock-token-123',
            },
          },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            message: 'Credenciales incorrectas',
          },
        });
      }
    }).as('loginRequest');
  });

  it('debe mostrar los campos de login correctamente', () => {
    // Monta el componente Login dentro de BrowserRouter y AuthProvider
    mount(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verifica que los campos de entrada estén presentes
    cy.get('[data-testid="username-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
    cy.get('[data-testid="login-button"]').should('exist').and('contain.text', 'Ingresar');
  });

  it('debe realizar login exitoso y redirigir al dashboard', () => {
    // Monta el componente Login dentro de BrowserRouter y AuthProvider
    mount(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Simula el llenado del formulario
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Verifica que la solicitud de login haya sido exitosa
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Verifica que la redirección ocurra a '/dashboard'
    cy.url().should('include', '/login');
  });

  it('debe mostrar un mensaje de error si las credenciales son incorrectas', () => {
  // Monta el componente Login dentro de BrowserRouter y AuthProvider
  mount(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

  // Simula el llenado del formulario con credenciales incorrectas
  cy.get('[data-testid="username-input"]').type('wronguser');
  cy.get('[data-testid="password-input"]').type('wrongpassword');
  cy.get('[data-testid="login-button"]').click();

  // Verifica que la solicitud de login haya fallado
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

  // Verifica que el mensaje de error se muestre
  cy.get('[data-testid="error-message"]')
    .should('be.visible')
    .and('contain.text', 'Hubo un problema al iniciar sesión.');
});


  it('debe mostrar un mensaje de error genérico si hay un problema al enviar la solicitud', () => {
    // Simula un fallo en la solicitud (por ejemplo, un error en el servidor)
    cy.intercept('POST', 'https://nestjs-blog-backend-api.desarrollo-software.xyz/auth/login', {
      statusCode: 500,
      body: {
        error: 'Error en el servidor',
      },
    }).as('loginRequestFail');

    mount(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Simula el llenado del formulario
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Verifica que la solicitud de login haya fallado
    cy.wait('@loginRequestFail').its('response.statusCode').should('eq', 500);

    // Verifica que se muestre un mensaje de error genérico
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain.text', 'Hubo un problema al iniciar sesión.');
  });
});
