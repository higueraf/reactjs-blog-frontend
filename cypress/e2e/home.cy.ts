/// <reference types="cypress" />

describe('Pruebas E2E para la página Home', () => {
  // Mock de datos para las pruebas
  const mockPosts = [
    {
      id: 1,
      title: 'Post de prueba 1',
      summary: 'Resumen del post de prueba 1',
      content: 'Contenido completo del post de prueba 1'
    },
    {
      id: 2,
      title: 'Post de prueba 2',
      content: 'Contenido completo del post de prueba 2 sin resumen'
    }
  ];

  beforeEach(() => {
    // 1. Mock de la API para GET /posts
    cy.intercept(
      'GET', 
      'https://nestjs-blog-backend-api.desarrollo-software.xyz/posts?page=1&limit=2',
      {
        statusCode: 200,
        body: {
          data: {
            items: mockPosts,
            total: 2
          }
        },
        delay: 500 // Pequeño retardo para simular red
      }
    ).as('getPosts');

    // 2. Mock para GET /posts/:id
    cy.intercept(
      'GET', 
      'https://nestjs-blog-backend-api.desarrollo-software.xyz/posts/*',
      (req) => {
        const postId = parseInt(req.url.split('/').pop() || '0');
        const post = mockPosts.find(p => p.id === postId);
        
        if (post) {
          req.reply({
            statusCode: 200,
            body: { data: post }
          });
        } else {
          req.reply({
            statusCode: 404,
            body: { error: 'Post no encontrado' }
          });
        }
      }
    ).as('getPostDetail');

    // 3. Visitar la página
    cy.visit('http://localhost:5173/');
    
    // 4. Esperar a que se carguen los posts
    cy.wait('@getPosts', { timeout: 10000 });
  });

  it('debe mostrar el título "Últimos posts"', () => {
    cy.get('h4').contains('Últimos posts').should('be.visible');
  });

  it('debe mostrar tarjetas de los posts', () => {
    // Verificar que se muestran todas las tarjetas
    cy.get('.MuiCard-root').should('have.length', mockPosts.length);
    
    // Verificar que los títulos están visibles
    cy.contains(mockPosts[0].title).should('be.visible');
    cy.contains(mockPosts[1].title).should('be.visible');
  });

  it('debe redirigir al detalle del post al hacer clic en "Leer más"', () => {
    // Hacer clic en el primer botón "Leer más"
    cy.contains('.MuiButton-root', 'Leer más').first().click();
    
    // Verificar la redirección
    cy.url().should('include', '/post/1');
    
    // Verificar que se cargó el detalle
    cy.contains(mockPosts[0].title).should('be.visible');
  });

  it('debe mostrar contenido cortado cuando no hay resumen', () => {
    // El segundo post no tiene resumen
    cy.get('.MuiCard-root')
      .eq(1)
      .within(() => {
        cy.get('.MuiTypography-body2')
          .should('contain', mockPosts[1].content?.slice(0, 100))
          .should('contain', '...');
      });
  });

  it('debe manejar el error cuando falla la carga de posts', () => {
    // Sobrescribir el mock para simular error
    cy.intercept(
      'GET', 
      'https://nestjs-blog-backend-api.desarrollo-software.xyz/posts?page=1&limit=2',
      {
        statusCode: 500,
        body: { error: 'Error del servidor' }
      }
    ).as('getPostsError');

    // Recargar la página para forzar el error
    cy.reload();
    cy.wait('@getPostsError');

    // Verificar que no hay posts visibles
    cy.get('.MuiCard-root').should('not.exist');
  });
});