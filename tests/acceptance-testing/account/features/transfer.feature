Feature: Money transfer from an account to another

    @TranferMoneyFromAccountToAnother
    Scenario: A customer wants to transfer money to his friend
        Given Customers named Jack and Bob
            | customer | accountNumber |
            | Jack     | 12312312312   |
            | Bob      | 98797897897   |
        And They have a bank account with account numbers as shown below
            | customer | number      | balance | id        |
            | Jack     | 12312312312 | 1000    | fakeid123 |
            | Bob      | 98797897897 | 1000    | fakeid345 |
        And Jack wants to do a money transfer in the amount of 1000€ to his friend named Bob has shown below
            | label  | Participation in Anna's gift |
            | amount | 1000                         |
            | from   | 12312312312                  |
            | to     | 98797897897                  |
        When Jack does the money transfer
        Then Jack's and Bob's balances should be as shown below after receiving the transfer
            | customer | balance |
            | Jack     | 0       |
            | Bob      | 2000    |
