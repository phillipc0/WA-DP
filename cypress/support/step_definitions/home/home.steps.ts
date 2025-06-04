/// <reference types="cypress" />
/// <reference types="@badeball/cypress-cucumber-preprocessor" />

import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the homepage", () => {
  cy.visit("/");
});

Then("I should see {string} in the h2 header", (text: string) => {
  cy.get("h2").contains(text);
});

Then("I should see a link to {string}", (label: string) => {
  cy.get("a").contains(label);
});
