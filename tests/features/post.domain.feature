Feature: Posting a message on a timeline

    @PostingAmessageOnAtimeline
    Scenario: A user wants to post a message on his timeline
        Given A user named Alice
            | name | Alice |
        And Alice has a timeline
        And Alice wants to publish a message as shown below
            | author  | Alice         |
            | message | Hello world ! |
        When Alice publish the message on her timeline
        Then The message is published on her timeline as shown below
            | author  | Alice         |
            | message | Hello world ! |


    @ReadingUsersTimeline
    Scenario: A user wants to view another user timeline
        Given A user named Bob
            | name | Bob |
        And Bob wants to view Alice timeline
            | name | Alice |
        When Bob access to Alice timeline
        Then The timeline is displayed as shown below
            | owner   | Alice         |
            | message | Hello world ! |

    @FollowingUsers
    Scenario: A user wants to subscribe to another user timelines
        Given A user named Charlie
            | name | Charlie |
        And Charlie wants to subscribe to Alice and Bob timelines as shown below
            | user1 | Alice |
            | user2 | Bob   |
        And Charlie subscribe to Alice and Bob timelines
        When Charlie display all subscribed timelines
        Then A timeline list is displayed as shown below