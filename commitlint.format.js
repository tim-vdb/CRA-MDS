// commitlint.format.js
module.exports = ({ results }) => {
  let output = '\n🚨 Message de commit invalide !\n\n';

  const errors = results[0]?.errors || [];
  const header = results[0]?.input || '';

  if (errors.length === 0) return '';

  // Détection spéciale : si le header contient des parenthèses mais pas de deux-points
  const hasParentheses = /\([^)]+\)/.test(header);
  const hasColon = header.includes(':');
  const missingColon = hasParentheses && !hasColon;

  // On regroupe les erreurs courantes pour les expliquer mieux
  const hasTypeError = errors.some(
    (e) => e.name === 'type-empty' || e.name === 'type-enum'
  );
  const hasScopeError = errors.some((e) => e.name === 'scope-empty');
  const hasSubjectError = errors.some((e) => e.name === 'subject-empty');
  const hasColonError =
    missingColon ||
    errors.some((e) => e.name === 'subject-case' || e.message.includes(':'));

  // Si les deux-points manquent, c'est la cause principale des autres erreurs
  if (missingColon) {
    output +=
      '❌ Il manque les ":" après le scope → format attendu: type(scope): sujet\n';
    output += '   Exemple: chore(husky): description ou chore(husky): -\n\n';
  } else {
    if (hasTypeError) {
      output +=
        '❌ Le type est manquant ou invalide (doit être feat, fix, hotfix, chore, perf, style, refactor, docs, etc.)\n';
    }
    if (hasScopeError) {
      output +=
        '❌ Le scope est obligatoire et ne doit pas être vide → ex: (footer), (auth)\n';
    }
    if (hasSubjectError) {
      output += '✖ La description après ":" ne peut pas être vide\n';
    }
    if (hasColonError) {
      output += '✖ Il manque les ":" après le scope\n';
    }
  }

  // Si on n'a pas reconnu l'erreur, on fallback sur les messages par défaut
  if (!hasTypeError && !hasScopeError && !hasSubjectError && !hasColonError) {
    errors.forEach((error) => {
      output += `✖ ${error.message}\n`;
    });
  }

  output += '\n✅ Exemples de commits valides :\n';
  output += '   feat(footer): ajouter le nouveau pied de page\n';
  output += "   fix(header): corriger l'alignement du menu\n";
  output +=
    '   hotfix(header): corriger un problème critique (ex: crash, blocage, etc.)\n';
  output +=
    '   chore(deps): mettre à jour tailwind - (ex: maintenance, mise à jour de dépendances, config, scripts, etc.)\n';
  output += '   refactor(auth): simplifier la logique de session\n';
  output += '   perf(navbar): optimiser le rendu des liens\n';
  output +=
    '   style(navbar): changements de formatage (sans impact sur le code)\n';
  output += '   docs(readme): mettre à jour les instructions\n';
  output += '   test(navbar): ajouter des tests pour la fonctionnalité\n\n';

  output +=
    '💡 Astuce : pour des sujets vides, utilise au moins un caractère après ":" → feat(footer): -\n';

  return output;
};
