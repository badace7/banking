const common = [
  'tests/acceptance-testing/**/features/*.{feature,feature.md}', // feature filter
  '--require tests/acceptance-testing/**/steps/*.ts',
  '--require-module ts-node/register',
  'cucumber-js -f @cucumber/pretty-formatter',
  '--tags "not @wip and not @api"',
].join(' ');

module.exports = {
  default: common,
};
