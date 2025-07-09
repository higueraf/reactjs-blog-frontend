/// <reference types="cypress" />
import { Home } from "../../src/pages/public/Home"; // Importación correcta para exportaciones nombradas
import { mount } from "@cypress/react"; // Importa la función mount para pruebas de componentes
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter para envolver el componente

describe("Componente Home", () => {
  // Mock de la respuesta de la API antes de cada prueba
  beforeEach(() => {
    cy.intercept("GET", "**/posts?page=1&limit=2", {
      statusCode: 200,
      body: {
        data: {
          items: [
            { id: 1, title: "Post 1", summary: "Resumen del post 1" },
            { id: 2, title: "Post 2", summary: "Resumen del post 2" },
          ],
        },
      },
    }).as("fetchPosts");
  });

  it('debe mostrar el título "Últimos posts"', () => {
    // Monta el componente Home dentro de BrowserRouter
    mount(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verifica que el título "Últimos posts" esté en la página
    cy.contains("Últimos posts").should("exist");
  });

  it("debe mostrar las tarjetas de los posts", () => {
    mount(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verifica que se muestren al menos dos tarjetas de post
    cy.get(".MuiCard-root").should("have.length", 2);
  });

  it('debe redirigir a la página de detalle del post al hacer clic en "Leer más"', () => {
    mount(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Simula un clic en el primer botón "Leer más"
    cy.get(".MuiButtonBase-root").first().click();

    // Verifica que la URL cambie para reflejar el detalle del post
    cy.url().should("include", "/post/1");
  });

  it("debe mostrar un mensaje de error si no se puede cargar los posts", () => {
    // Simula un fallo en la API (como si hubiera un error al cargar los posts)
    cy.intercept("GET", "**/posts?page=1&limit=2", {
      statusCode: 500,
      body: { error: "Error interno del servidor" },
    }).as("fetchPostsFail");

    // Monta el componente Home dentro de BrowserRouter
    mount(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verifica que el mensaje de error esté presente en la página
    cy.get('[data-testid="error-message"]') // Espera que el mensaje de error sea visible
      .should("be.visible")
      .and("contain.text", "Error al cargar los posts"); // Verifica que el texto sea correcto
  });
});
