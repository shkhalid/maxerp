const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://maxerp.test",
        supportFile: "cypress/support/e2e.js",
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 15000,
        requestTimeout: 15000,
        responseTimeout: 15000,
        // Simplified configuration
        chromeWebSecurity: false,
        experimentalStudio: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
