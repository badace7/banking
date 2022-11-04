const options = [
  'tests/acceptance-testing/**/*', // feature filter
  '--require tests/acceptance-testing/**/steps/*.ts',
  '--require-module ts-node/register',
  'cucumber-js -f @cucumber/pretty-formatter',
  '--tags "not @wip and not @api"',
];

exports.account = options.join(' ');
