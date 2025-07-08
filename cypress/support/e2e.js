import './commands';
import '@cypress/code-coverage/support'; // Si usas code coverage

// Configuración global para pruebas E2E
beforeEach(() => {
  cy.log('Iniciando prueba E2E');
});