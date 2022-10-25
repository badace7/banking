Feature: banking

    @Login
    Scenario: A user wants to login on banking system
        Given A user named Alice that she want to login to the banking system
            | accountNumber | 12345677890098765 |
            | accountCode   | 012345            |
        When Alice enters her credentials and submit it
        Then The message is shown below
            | message | You have successfully logged in |
