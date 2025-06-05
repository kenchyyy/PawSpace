/// <reference types="cypress" />

// Add the custom command implementation
Cypress.Commands.add('loginByGoogle', () => {
  // Adjust this to your app's actual auth logic:
  cy.setCookie('session', 'fake-session-token-for-testing');

  // Or, if you prefer localStorage auth:
  // cy.window().then(win => {
  //   win.localStorage.setItem('authToken', 'fake-token-for-testing');
  // });
});

// Extend Cypress namespace for TypeScript typings
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to bypass Google OAuth login by setting session/cookie.
       * Usage: cy.loginByGoogle()
       */
      loginByGoogle(): Chainable<void>;
    }
  }
}

export {};
