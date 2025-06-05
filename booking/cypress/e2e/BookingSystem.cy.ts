describe('Full User Journey E2E Test', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    // Landing page tests
    it('loads the landing page successfully', () => {
        cy.contains('Pawspace').should('be.visible');
    });

    it('shows the hero section', () => {
        cy.get('h1').contains('Pawspace').should('be.visible');
        cy.contains("Your best friend's new best friend!").should('be.visible');
    });

    it('has a functional Explore Our Services button', () => {
        cy.contains('Explore Our Services').should('be.visible').click();
        cy.url().should('include', '/login');
    });

    it('displays services section', () => {
        cy.contains('Our Services').scrollIntoView();
        cy.contains('Boarding Services').should('be.visible');
        cy.contains('Grooming Services').should('be.visible');
    });

    it('displays gallery images', () => {
        cy.contains('Our Gallery').should('be.visible');
        cy.get('img[alt^="Gallery image"]').should('have.length.at.least', 1);
    });

    it('shows contact information', () => {
        cy.contains('Contact Us').scrollIntoView();
        cy.contains('Address').should('be.visible');
        cy.contains('Phone').should('be.visible');
        cy.contains('Email').should('be.visible');
    });

    it('displays footer with social links', () => {
        cy.contains('Pawspace ©').should('be.visible');
        cy.get('a[href*="facebook.com"]').should('exist');
        cy.get('a[href*="instagram.com"]').should('exist');
    });
});

describe('Login Page Navigation and UI', () => {
    it('redirects to login page with Google sign-in button when Explore Our Services is clicked', () => {
        cy.visit('/');
        cy.contains('Explore Our Services').click();
        cy.url().should('include', '/login');
        cy.contains('Sign in with Google').should('be.visible');
    });
});