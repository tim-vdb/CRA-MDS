# CRA Solutions

Monorepo contenant l'application web et l'application mobile de gestion de CRA (Comptes Rendus d'Activité) pour freelances.

```
.
├── apps/
│   ├── web/        # Application Next.js
│   └── mobile/     # Application Expo (iOS / Android)
```

---

## Table des matières

- [Prérequis globaux](#prérequis-globaux)
- [Installation](#installation)
- [Application Web](#application-web)
  - [Stack technique](#stack-technique-web)
  - [Variables d'environnement](#variables-denvironnement-web)
  - [Configuration OAuth](#configuration-oauth-web)
  - [Base de données](#base-de-données)
  - [Lancer en développement](#lancer-en-développement-web)
  - [Scripts disponibles](#scripts-disponibles-web)
  - [Structure du projet](#structure-du-projet-web)
  - [Fonctionnalités](#fonctionnalités-web)
  - [Déploiement Vercel](#déploiement-vercel)
- [Application Mobile](#application-mobile)
  - [Stack technique](#stack-technique-mobile)
  - [Configuration OAuth Google (obligatoire)](#configuration-oauth-google-obligatoire)
  - [Configuration de l'URL API](#configuration-de-lurl-api)
  - [Tunnel de développement](#tunnel-de-développement)
  - [Lancer en développement](#lancer-en-développement-mobile)
  - [Scripts disponibles](#scripts-disponibles-mobile)
  - [Structure du projet](#structure-du-projet-mobile)
  - [Fonctionnalités](#fonctionnalités-mobile)
  - [Build de production](#build-de-production)
  - [Dépannage](#dépannage)

---

## Prérequis globaux

- Node.js 20+
- npm 10+
- Un compte [Neon](https://neon.tech) (base de données PostgreSQL serverless)
- Un compte [Resend](https://resend.com) (envoi d'emails)
- Un projet [Google Cloud](https://console.cloud.google.com) avec OAuth configuré

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/tim-vdb/CRA-MDS.git
cd CRA-MDS

# Installer toutes les dépendances (web + mobile)
npm install
```

---

# Application Web

## Stack technique (web)

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Base de données | PostgreSQL (Neon serverless) |
| ORM | Prisma 7 |
| Authentification | Better Auth 1.6 |
| Email | Resend |
| Déploiement | Vercel |
| Langage | TypeScript 5.9 |

## Variables d'environnement (web)

Créez un fichier `.env.local` dans `apps/web/` :

```env
# URL de base de l'application (sans slash final)
BASE_URL=http://localhost:3000

# Base de données PostgreSQL (format Neon)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Google OAuth
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM=no-reply@votre-domaine.com

# Environnement
NODE_ENV=development
```

## Configuration OAuth (web)

### Google OAuth

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez ou sélectionnez un projet
3. Activez l'**API Google Identity**
4. Allez dans **APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID**
5. Choisissez **Web application**
6. Ajoutez les **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/callback/google      ← développement
   https://votre-domaine.com/api/auth/callback/google  ← production
   ```
7. Copiez le **Client ID** → `GOOGLE_CLIENT_ID` et le **Client Secret** → `GOOGLE_CLIENT_SECRET`

### GitHub OAuth

1. Rendez-vous sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cliquez sur **New OAuth App**
3. Renseignez :
   - **Homepage URL** : `http://localhost:3000`
   - **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`
4. Copiez le **Client ID** → `GITHUB_CLIENT_ID` et générez un **Client Secret** → `GITHUB_CLIENT_SECRET`

## Base de données

```bash
cd apps/web

# Générer le client Prisma
npm run generate

# Pousser le schéma vers la base de données (développement)
npm run push

# Ouvrir Prisma Studio (interface visuelle)
npm run studio
```

**Schéma résumé :**

| Table | Description |
|---|---|
| `user` | Utilisateurs (email, nom, rôle) |
| `session` | Sessions actives |
| `account` | Comptes OAuth liés |
| `verification` | Tokens de vérification email |
| `clients` | Clients freelance (nom, société, TJM, jours max) |
| `activity` | Activités journalières (jours travaillés par client) |
| `invoice` | Factures générées depuis les activités |
| `client_invite` | Liens de partage client |

## Lancer en développement (web)

Suivez ces étapes dans l'ordre la première fois :

**1. Créer le fichier de variables d'environnement**

Créez `apps/web/.env.local` avec les variables listées dans la section [Variables d'environnement](#variables-denvironnement-web).

**2. Initialiser la base de données**

```bash
cd apps/web
npm run generate   # génère le client Prisma
npm run push       # pousse le schéma vers Neon
```

**3. Démarrer le serveur**

```bash
# Tout-en-un : génère Prisma + push DB + lance le dev + ouvre Prisma Studio
npm run all:local
```

Ou si la base est déjà initialisée :

```bash
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles (web)

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Vérifier le code avec ESLint |
| `npm run lint:fix` | Corriger automatiquement les erreurs ESLint |
| `npm run generate` | Générer le client Prisma |
| `npm run push` | Pousser le schéma Prisma vers la DB |
| `npm run migrate:prod` | Déployer les migrations en production |
| `npm run studio` | Ouvrir Prisma Studio |
| `npm run all:local` | Générer + push + dev + studio (tout-en-un local) |

## Structure du projet (web)

```
apps/web/src/
├── app/                    # Routes Next.js (App Router)
│   ├── (pages)/
│   │   └── (auth)/login/   # Page de connexion
│   ├── api/
│   │   ├── auth/[...all]/  # Handler Better Auth
│   │   ├── clients/
│   │   ├── activities/
│   │   └── users/
│   ├── clients/            # Pages détail client
│   ├── dashboard/
│   └── account/
├── back/                   # Couche backend (hors routes)
│   ├── services/           # Logique métier
│   └── repositories/       # Accès aux données (Prisma)
├── features/               # Fonctionnalités par domaine
│   ├── Clients/
│   ├── CRAS/
│   ├── Dashboard/
│   ├── Account/
│   └── Users/
├── components/
│   ├── ui/                 # Composants Radix UI / shadcn
│   └── ux/                 # Composants métier réutilisables
├── lib/
│   ├── auth.ts             # Config Better Auth (serveur)
│   ├── auth-client.ts      # Client auth (navigateur)
│   ├── prisma.ts           # Instance Prisma + adaptateur Neon
│   └── email.ts            # Service email Resend
└── prisma/
    ├── schema.prisma
    └── migrations/
```

## Fonctionnalités (web)

- **Authentification** — Email/mot de passe, Google OAuth, GitHub OAuth, vérification email
- **Clients** — Création, édition, archivage, suppression, partage par lien
- **Activités / CRA** — Saisie des jours travaillés par client et par date
- **Factures** — Génération depuis les activités, statuts (Brouillon, Émise, Payée, En retard), calcul TVA à 20 %
- **Tableau de bord** — Statistiques, graphiques Recharts, vue mensuelle
- **Export CSV** — Export des activités par client
- **Compte** — Modification du profil, changement d'email, suppression du compte
- **Mode sombre** — Thème clair/sombre

## Déploiement Vercel

1. Connectez votre dépôt GitHub à [Vercel](https://vercel.com)
2. Définissez le **Root Directory** sur `apps/web`
3. Ajoutez toutes les variables d'environnement dans les paramètres Vercel
4. Mettez `BASE_URL` à l'URL de votre domaine (ex : `https://cra-mds.vercel.app`)
5. La commande de build `npm run vercel-build` est détectée automatiquement (génère Prisma + build Next.js)

> En production, mettez à jour les URIs de redirection OAuth dans Google Cloud Console et GitHub avec votre domaine de production.

---

# Application Mobile

> **Important :** L'application mobile se connecte **uniquement via Google OAuth**. Vous devez configurer vos propres credentials Google Cloud avant de pouvoir vous authentifier. Suivez attentivement la section ci-dessous.

## Stack technique (mobile)

| Couche | Technologie |
|---|---|
| Framework | Expo ~54.0.0 |
| Runtime | React Native 0.81 |
| UI | React 19, NativeWind 4 (Tailwind pour RN) |
| Routing | Expo Router 6 (file-based) |
| Authentification | Better Auth + @better-auth/expo |
| Stockage local | Expo Secure Store (chiffré) |
| État serveur | TanStack Query 5 |
| Graphiques | react-native-gifted-charts |
| Langage | TypeScript 5.9 |

## Configuration OAuth Google (obligatoire)

L'app mobile délègue entièrement l'authentification à l'API de l'app web. Elle n'a donc pas de secrets OAuth propres — c'est le serveur web qui détient les credentials Google. En revanche, vous devez déclarer les urls de l'app mobile dans Google Cloud Console pour que Google accepte d'y rediriger l'utilisateur après connexion.

### Étape 1 — Créer un client OAuth dans Google Cloud Console

> Si vous avez déjà configuré le client OAuth pour l'app web, utilisez le même projet Google Cloud.

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez votre projet
3. Allez dans **APIs & Services > Credentials**
4. Cliquez sur votre client OAuth existant (type **Web application**), ou créez-en un nouveau

### Étape 2 — Déclarer l'URL du tunnel comme URI autorisée

En développement local, l'authentification passe par le tunnel Cloudflare (voir [Lancer en développement (mobile)](#lancer-en-développement-mobile)). Vous devez déclarer l'URL de callback du tunnel dans Google Cloud Console.

Dans la section **Authorized redirect URIs** de votre client OAuth, ajoutez :

```
https://xxxx.trycloudflare.com/api/auth/callback/google
```

Remplacez `xxxx` par le sous-domaine affiché dans votre terminal après `npm run tunnel`.

> **Important :** L'URL du tunnel change à chaque redémarrage de `npm run tunnel`. Vous devez mettre à jour cette URI dans Google Cloud Console à chaque nouvelle session de développement.

### Étape 3 — Vérifier les variables d'environnement côté serveur web

Le serveur web doit avoir ces variables configurées pour que l'OAuth Google fonctionne :

```env
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
BASE_URL=https://votre-domaine.com
```

### Flux d'authentification complet

```
Utilisateur → "Se connecter avec Google"
      ↓
Expo ouvre le navigateur système
      ↓
Google authentifie l'utilisateur
      ↓
Google redirige vers : https://xxxx.trycloudflare.com/api/auth/callback/google
      ↓
Le serveur web traite le callback et redirige vers l'app mobile
      ↓
Better Auth (@better-auth/expo) traite le token
      ↓
Session stockée dans Expo Secure Store (chiffré)
      ↓
Redirection vers les onglets principaux (ou page Clients si premier accès)
```

## Configuration de l'URL API

L'app mobile communique avec l'API de l'app web. L'URL par défaut est `https://cra-mds.vercel.app`.

Pour pointer vers votre propre instance, créez un fichier `.env` dans `apps/mobile/` :

```env
API_URL=https://votre-domaine.com
```

Ou modifiez directement [apps/mobile/app.config.ts](apps/mobile/app.config.ts) :

```ts
extra: {
  apiUrl: process.env.API_URL ?? "https://votre-domaine.com",
},
```

> En développement local, utilisez l'IP de votre machine plutôt que `localhost` : `http://192.168.x.x:3000`. Sur mobile, `localhost` pointe vers le téléphone lui-même, pas votre machine.

## Lancer en développement (mobile)

L'app mobile a besoin de joindre le serveur web depuis le téléphone physique. Comme `localhost` ne fonctionne pas sur mobile (il pointe vers le téléphone lui-même), il faut exposer le serveur web sur une URL publique via un tunnel Cloudflare.

Suivez ces étapes dans l'ordre :

**1. S'assurer que le serveur web tourne**

```bash
cd apps/web
npm run dev
# ou npm run all:local si c'est la première fois
```

**2. Ouvrir le tunnel** (dans un second terminal, depuis la racine du monorepo)

```bash
npm run tunnel
```

Le terminal affiche une URL publique de la forme `https://xxxx.trycloudflare.com`. Copiez-la.

> L'URL change à chaque redémarrage du tunnel — pensez à la mettre à jour à chaque fois.

**3. Mettre à jour la variable d'environnement mobile**

Créez ou modifiez `apps/mobile/.env` :

```env
API_URL=https://xxxx.trycloudflare.com
```

**4. Autoriser l'URL du tunnel dans Google Cloud Console**

L'OAuth passe par le serveur web. Google doit connaître la nouvelle URL du tunnel pour accepter les redirections. Dans votre client OAuth (Google Cloud Console > **APIs & Services > Credentials**), ajoutez dans **Authorized redirect URIs** :

```
https://xxxx.trycloudflare.com/api/auth/callback/google
```

> À refaire à chaque nouveau tunnel puisque l'URL change. Si vous utilisez toujours la même URL de production (Vercel), cette étape n'est nécessaire qu'en développement local.

**5. Démarrer l'app mobile**

```bash
# Depuis la racine du monorepo
npm run all:mobile

# Pour vider le cache (si des modules ne se résolvent pas)
npm run all:mobile -- --clear
```

Scannez le QR code avec **Expo Go** sur votre téléphone.

**En résumé — les 3 terminaux en dev mobile :**

| Terminal | Commande | Rôle |
|---|---|---|
| 1 | `cd apps/web && npm run dev` | Serveur Next.js |
| 2 | `npm run tunnel` (racine) | URL publique pour le mobile |
| 3 | `npm run all:mobile` (racine) | Serveur Expo |

## Scripts disponibles (mobile)

| Script | Description |
|---|---|
| `npm run all:mobile` | Démarrer le serveur Expo (depuis la racine) |
| `npm start` | Démarrer le serveur Expo (depuis apps/mobile) |
| `npm run android` | Lancer sur émulateur Android |
| `npm run ios` | Lancer sur simulateur iOS |
| `npm run web` | Aperçu web dans le navigateur |
| `npm run lint` | Vérifier le code avec ESLint |

## Structure du projet (mobile)

```
apps/mobile/
├── app/                        # Routes Expo Router (file-based)
│   ├── (auth)/
│   │   └── login.tsx           # Écran de connexion (Google OAuth)
│   ├── (tabs)/                 # Navigation principale par onglets
│   │   ├── dashboard.tsx       # Tableau de bord des activités
│   │   ├── cras.tsx            # Rapports d'activité
│   │   ├── clients.tsx         # Liste des clients
│   │   ├── account.tsx         # Profil utilisateur
│   │   └── _layout.tsx         # Configuration des 4 onglets
│   └── _layout.tsx             # Layout racine (garde d'auth + first-visit)
├── features/                   # Fonctionnalités par domaine
│   ├── auth/
│   ├── clients/
│   ├── dashboard/
│   ├── account/
│   ├── cras/
│   └── users/
├── components/
│   └── ui/                     # button, card, badge, input, separator, icon-symbol
├── lib/
│   ├── auth-client.ts          # Client Better Auth pour mobile
│   └── utils/api.ts            # Utilitaires HTTP
├── constants/
│   └── theme.ts                # Couleurs et thème
├── assets/
│   └── images/                 # Icônes, splash screen
├── app.json                    # Configuration Expo (statique)
└── app.config.ts               # Configuration Expo (dynamique, env vars)
```

## Fonctionnalités (mobile)

- **Connexion** — Google OAuth via tunnel Cloudflare en développement, via l'URL de production en prod
- **First visit** — Redirige vers la page Clients si aucun client n'existe encore, sinon vers le Dashboard
- **Tableau de bord** — Vue mensuelle des activités, graphiques, statistiques
- **Clients** — Liste, création, modification, archivage, suppression
- **CRA** — Récapitulatif mensuel par client (jours, facturé, théorique, écart)
- **Compte** — Profil utilisateur
- **Thème** — Détection automatique clair/sombre
- **Haptique** — Retour tactile sur les interactions

## Build de production

Pour générer un `.apk` (Android) ou un `.ipa` (iOS) distribuable via EAS :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer EAS (première fois)
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

Consultez la [documentation EAS Build](https://docs.expo.dev/build/introduction/) pour les détails.

## Dépannage

**Erreur `redirect_uri_mismatch` :**
L'URL du tunnel n'est pas déclarée dans les Authorized redirect URIs de votre projet Google Cloud, ou elle a changé depuis le dernier redémarrage du tunnel. Ajoutez `https://xxxx.trycloudflare.com/api/auth/callback/google` avec votre URL actuelle (voir [Étape 2](#étape-2--déclarer-lurl-du-tunnel-comme-uri-autorisée)).

**La connexion Google ne s'ouvre pas :**
Vérifiez que l'app web est déployée et accessible depuis l'URL configurée dans `app.config.ts`. L'initiation OAuth se fait côté serveur web.

**L'app ne récupère pas les données :**
En développement local, `localhost` ne fonctionne pas sur mobile — utilisez le tunnel (`npm run tunnel`) ou l'IP locale de votre machine (`http://192.168.x.x:3000`) dans `API_URL`.

**OAuth ne fonctionne pas avec Expo Go :**
Expo Go a des limitations sur les deep-links natifs. Si le problème persiste, utilisez un [development build](https://docs.expo.dev/develop/development-builds/introduction/) plutôt qu'Expo Go.
