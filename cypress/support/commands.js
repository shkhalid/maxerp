// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to login as a specific user role
 * @param {string} role - 'employee' or 'manager'
 */
Cypress.Commands.add("loginAs", (role = "employee") => {
    const credentials = {
        employee: {
            email: "employee@company.com",
            password: "password",
        },
        manager: {
            email: "manager@company.com",
            password: "password",
        },
    };

    const { email, password } = credentials[role];

    cy.visit("/login");
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for redirect to dashboard
    cy.url().should("include", "/dashboard");
});

/**
 * Custom command to fill leave request form
 * @param {Object} formData - Leave request form data
 */
Cypress.Commands.add("fillLeaveForm", (formData) => {
    // Wait for page to load completely
    cy.get("button").contains("Request Leave").should("be.visible");

    // Open the leave request dialog
    cy.get("button").contains("Request Leave").click();

    // Wait for dialog to open
    cy.get('[data-testid="leave-form-dialog"]').should("be.visible");

    // Fill form fields
    if (formData.leaveType) {
        cy.get('button[role="combobox"]').click();
        cy.get('[data-testid="leave-type-option"]')
            .contains(formData.leaveType)
            .click();
    }

    if (formData.startDate) {
        cy.get('input[id="startDate"]').clear().type(formData.startDate);
    }

    if (formData.endDate) {
        cy.get('input[id="endDate"]').clear().type(formData.endDate);
    }

    if (formData.reason) {
        cy.get('input[id="reason"]').clear().type(formData.reason);
    }
});

/**
 * Custom command to submit leave request form
 */
Cypress.Commands.add("submitLeaveForm", () => {
    cy.get('button[type="submit"]').contains("Submit Request").click();
});

/**
 * Custom command to wait for API response
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 */
Cypress.Commands.add("waitForApi", (method, url) => {
    cy.intercept(method, url).as("apiCall");
    cy.wait("@apiCall");
});
