Feature: Home Page
  As a visitor
  I want to see the portfolio homepage
  So that I can verify core UI elements

  Scenario: Visit home
    Given I open the homepage
    Then I should see "Skills" in the h2 header
    And I should see a link to "Generator"
