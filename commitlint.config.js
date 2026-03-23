module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: './commitlint.format.js',
  rules: {
    // Types de commit autorisés (inclut hotfix en plus des types conventionnels)
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'hotfix', // Type personnalisé pour les corrections critiques
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'init',
      ],
    ],

    // Scope obligatoire et non vide (comme tu voulais avant)
    'scope-empty': [2, 'never'],

    // On assouplit la règle pour autoriser un sujet vide
    'subject-empty': [0], // 0 = on désactive complètement la règle

    // Optionnel : si tu veux quand même un sujet, mais autoriser vide, tu peux mettre niveau warning au lieu d'error
    // 'subject-empty': [1, 'never'],  // 1 = warning seulement, pas blocage
  },
};
