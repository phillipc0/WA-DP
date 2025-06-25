Feature: Complete User Flow
  As a user
  I want to create an account, customize my portfolio, and view the changes
  So that I can manage my developer portfolio effectively

  Scenario: Complete user authentication and portfolio customization flow
    Given I visit the homepage
    When I click the login button
    Then I should see the login modal
    When I create a new account with username "testuser" and password "testpass123"
    Then I should be logged in and see the portfolio editor
    When I update my portfolio with name "Jane Smith" and title "Senior Developer"
    And I add a new skill "Python" with level 95
    And I save the changes
    Then I should see the success message
    When I navigate to the home page
    Then I should see my updated portfolio with name "Jane Smith"
    And I should see "Senior Developer" as my title
    And I should see "Python" in my skills list
    When I navigate back to the editor
    And I log out
    Then I should be redirected to the home page
    When I click the login button
    Then I should see the login modal
    When I log in with username "testuser" and password "testpass123"
    Then I should be logged in and see the portfolio editor
    When I update my bio to "Experienced full-stack developer passionate about clean code"
    And I save the changes
    When I navigate to the home page
    Then I should see my updated bio in the portfolio
    When I navigate back to the editor
    And I log out
    Then I should be redirected to the home page