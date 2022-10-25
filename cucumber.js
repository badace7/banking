const options = [
  'tests/cucumber/*', // feature filter
  '--require tests/cucumber/steps/*.ts',
  '--require-module ts-node/register',
  'cucumber-js -f @cucumber/pretty-formatter',
  '--tags "not @wip and not @api"',
];

exports.banking = options.join(' ');
