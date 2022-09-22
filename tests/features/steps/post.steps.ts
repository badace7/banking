import { Given, Then, When, Before } from '@cucumber/cucumber';
import { expect } from 'chai';
import { TimelineService } from '../../../src/domain/timeline/timeline.service';
import MessageDomain from '../../../src/domain/message/Message.domain';
import TimelineDomain from '../../../src/domain/timeline/Timeline.domain';
import UserDomain from '../../../src/domain/user/User.domain';
import FakeTimelineRepository from '../../../src/infrastructure/FakeTimelineRepository';

/**
 * Scenario: A user wants to post a message on his timeline
 */
Before(function () {
  this.repository = new FakeTimelineRepository();
  this.service = new TimelineService(this.repository);
});

Given(/^A user named Alice$/, function (table) {
  this.user = new UserDomain(table.rowsHash());
});
Given(/^Alice has a timeline$/, function () {
  this.timeline = new TimelineDomain({
    owner: this.user.getName,
  });
});
Given(/^Alice wants to publish a message as shown below$/, function (table) {
  this.message = new MessageDomain(table.rowsHash());
});

When(/^Alice publish the message on her timeline$/, async function () {
  this.expect = await this.service.postAmessageOnAtimeline(this.message);
});

Then(
  /^The message is published on her timeline as shown below$/,
  async function (table) {
    this.value = new MessageDomain(table.rowsHash());

    expect(this.expect.getMessages[0]).to.eql(table.rowsHash());
  },
);

/**
 * Scenario: A user wants to view another user timeline
 */
Given(/^A user named Bob$/, function (table) {
  this.user = new UserDomain(table.rowsHash());
});
Given(/^Bob wants to view Alice timeline$/, async function (table) {
  this.authorOfTimeline = table.rowsHash().name;
  this.postedMessage = await this.service.postAmessageOnAtimeline(
    new MessageDomain({
      author: this.authorOfTimeline,
      message: 'Hello world !',
    }),
  );
});

When(/^Bob access to Alice timeline$/, async function () {
  this.expect = await this.service.getUserTimeline(this.authorOfTimeline);
});

Then(/^The timeline is displayed as shown below$/, async function (table) {
  this.message = new MessageDomain({
    author: table.rowsHash().owner,
    message: table.rowsHash().message,
  });

  this.value = new TimelineDomain({
    owner: table.rowsHash().owner,
    messages: [this.message],
  });

  expect(this.expect).to.eql(this.value);
});

/**
 * Scenario: A user wants to subscribe to another user timeline
 */
Given(/^A user named Charlie$/, function (table) {
  this.user = new UserDomain(table.rowsHash());
});
Given(
  /^Charlie wants to subscribe to Alice and Bob timelines as shown below$/,
  async function (table) {
    this.alice = new UserDomain({ name: table.rowsHash().user1 });
    this.bob = new UserDomain({ name: table.rowsHash().user2 });
    this.aliceTimeline = await this.service(this.alice.getName);
    this.bobTimeline = await this.service(this.bob.getName);
  },
);

When(/^Charlie subscribe to Alice and Bob timelines$/, async function () {
  this.subscription = this.service.subscribeToATimeLine(
    this.user.getName,
    this.alice.getName,
  );
});
