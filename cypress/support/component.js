// Importa comandos personalizados si los tienes
import './commands'
import { mount } from 'cypress/react'

// Configuración global para pruebas de componentes
Cypress.Commands.add('mount', mount)

beforeEach(() => {
  cy.log('Configuración global para pruebas de componentes')
})