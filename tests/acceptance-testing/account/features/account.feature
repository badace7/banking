Feature: banking

    @Deposite
    Scenario: A customer wants to deposite 1000E
        Given A customer named Alice
            | name    | Alice      |
            | account | 1234567890 |
        And she wants to deposite 1000E
            | cash | 1000 |
        When Alice deposite 1000E
        Then The message is shown below
            | message | You have just deposited 1000E |
