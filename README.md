# Groupe Genetics — Site vitrine

Site vitrine de **GENETICS** (www.groupegenetics.com), reconstruit à l'identique avec **Next.js 15** (App Router), **React 19**, **TypeScript**, **Tailwind CSS** et **shadcn/ui**.

- Même interface que le site en ligne : Accueil, Qui sommes-nous, Services IT (cartes dépliables), popup Welqo, bandeau cookies, formulaire de contact, footer
- Responsive : versions dédiées mobile / tablette / desktop
- Bilingue **FR / EN**
- Le formulaire de contact envoie les messages via l'API `groupegenetics-api` (`POST /contact/send-email`)
- **Espace support** relié à l'API : connexion (`/support/login` → `POST /auth/login`), création de compte (`/support/register` → `POST /users/create-user`) et espace client (`/support` → `GET /users/me`)

## ⚡ Démarrage rapide

### 🐳 Avec Docker (recommandé)

Prérequis : Docker + Docker Compose v2.

```bash
cp .env.example .env
docker compose up -d --build
```

- Site : http://localhost:3001
- Les variables `NEXT_PUBLIC_*` sont intégrées au build : après modification, relancer `docker compose up -d --build`.
- Arrêter : `docker compose down`.

### 💻 En local (sans Docker)

Prérequis : Node.js 20+ (22 recommandé).

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Build de production : `npm run build && npm start`.

## ⚙️ Variables d'environnement

| Variable | Rôle | Défaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de `groupegenetics-api` (formulaire de contact, connexion et création de compte) | `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (balises de partage) | `https://www.groupegenetics.com` |
| `FRONT_PORT` | Port hôte utilisé par Docker Compose | `3001` |

## 🏗️ Structure

```
app/
  layout.tsx          # Police Inter, métadonnées SEO
  page.tsx            # Page d'accueil
  support/
    login/page.tsx    # Connexion
    register/page.tsx # Création de compte
    page.tsx          # Espace client (après connexion)
  globals.css
components/
  HomePage.tsx        # Toute la page (navigation, sections, popups, footer)
  CookieBanner.tsx
  support/AuthLayout.tsx  # Mise en page connexion / inscription
  ui/                 # Composants shadcn/ui (button, card, dialog, input, label, textarea)
lib/
  translations.ts     # ✏️ Textes FR / EN
  auth.ts             # Appels à l'API (connexion, inscription, profil) + jeton
  config.ts           # URLs (support, API)
public/
  logo.png
tailwind.config.ts    # Couleurs de la charte (primary, accent, genetics-dark-blue, genetics-gold)
```
