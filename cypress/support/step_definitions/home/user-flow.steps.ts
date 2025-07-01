/// <reference types="cypress" />
/// <reference types="@badeball/cypress-cucumber-preprocessor" />

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

// Clean up before each test
beforeEach(() => {
  cy.clearLocalStorage();
  // Set viewport to desktop size to ensure navigation is visible
  cy.viewport(1280, 720);
  // Clean up backend user file using Cypress task
  cy.task("deleteUserFile");
});

// Navigation steps
Given("I visit the homepage", () => {
  cy.visit("/");
});

When("I click the login button", () => {
  cy.get('[data-testid="login-button"]').first().click();
});

When("I navigate to the home page", () => {
  // Force click to bypass any modal overlays
  cy.get('a[href="/"]').first().click({ force: true });
});

When("I navigate back to the editor", () => {
  // Force click to bypass any modal overlays
  cy.get('a[href="/edit"]').first().click({ force: true });
});

// Authentication steps
Then("I should see the login modal", () => {
  cy.get('[role="dialog"]', { timeout: 10000 }).should("be.visible");
});

When(
  "I create a new account with username {string} and password {string}",
  (username: string, password: string) => {
    // Wait for modal to be fully loaded and visible
    cy.get('[role="dialog"]').should("be.visible");

    // Use more generic selectors since HeroUI inputs might be complex
    cy.get('[data-testid="username-input"] input').type(username);
    cy.get('[data-testid="password-input"] input').type(password);

    // Find and click the submit button
    cy.get('[role="dialog"] button[type="submit"]').click();
  },
);

When(
  "I log in with username {string} and password {string}",
  (username: string, password: string) => {
    // Wait for modal to be fully loaded and visible
    cy.get('[role="dialog"]').should("be.visible");

    // Use more generic selectors since HeroUI inputs might be complex
    cy.get('[data-testid="username-input"] input').clear().type(username);
    cy.get('[data-testid="password-input"] input').clear().type(password);

    // Find and click the submit button
    cy.get('[role="dialog"] button[type="submit"]').click();
  },
);

Then("I should be logged in and see the portfolio editor", () => {
  cy.url().should("include", "/edit");
  cy.contains("Portfolio Edit Page").should("be.visible");
  cy.get('[role="dialog"]').should("not.exist");
});

When("I log out", () => {
  cy.get('[data-testid="logout-button"]').click();
});

Then("I should be redirected to the home page", () => {
  cy.url().should("not.include", "/edit");
  cy.url().should("match", /\/$|\/index\.html$/);
});

// Portfolio editing steps
When(
  "I update my portfolio with name {string} and title {string}",
  (name: string, title: string) => {
    // Wait for the editor page to load
    cy.contains("Portfolio Edit Page").should("be.visible");

    // Clear and type new name
    cy.get('input[name="name"]').clear().type(name);

    // Clear and type new title
    cy.get('input[name="title"]').clear().type(title);
  },
);

When(
  "I add a new skill {string} with level {int}",
  (skillName: string, level: number) => {
    // Click on Skills tab
    cy.get('[data-key="skills"]').click();

    // Wait for skills section to be visible
    cy.contains("Add New Skill").should("be.visible");

    // Add new skill
    cy.get('input[name="name"]').last().type(skillName);
    cy.get('input[name="level"]').clear().type(level.toString());
    cy.contains("Add Skill").click();
  },
);

When("I update my bio to {string}", (bio: string) => {
  // Make sure we're on the basic information tab
  cy.get('[data-key="basic"]').click();

  // Update bio
  cy.get('textarea[name="bio"]').clear().type(bio);
});

When("I save the changes", () => {
  cy.contains("Save Changes").click();
});

Then("I should see the success message", () => {
  cy.contains("Your portfolio data has been saved successfully!").should(
    "be.visible",
  );
  cy.get("button").contains("OK").click();
  // Wait for modal to disappear
  cy.contains("Your portfolio data has been saved successfully!").should(
    "not.exist",
  );
});

// Portfolio verification steps
Then("I should see my updated portfolio with name {string}", (name: string) => {
  cy.contains(name).should("be.visible");
});

Then("I should see {string} as my title", (title: string) => {
  cy.contains(title).should("be.visible");
});

Then("I should see {string} in my skills list", (skillName: string) => {
  cy.contains("Skills").should("be.visible");
  cy.contains(skillName).should("be.visible");
});

Then("I should see my updated bio in the portfolio", () => {
  cy.contains(
    "Experienced full-stack developer passionate about clean code",
  ).should("be.visible");
});
