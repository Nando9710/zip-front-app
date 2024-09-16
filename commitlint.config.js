module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'docs',
        'feat',
        'fix',
        'refactor',
        'revert',
        'style',
        'test',
        'ci',
        'perf'
      ]
    ]
  }
};
