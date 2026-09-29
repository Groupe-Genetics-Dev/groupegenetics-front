# Groupe Genetics — Site vitrine

Site vitrine de **GENETICS** (solutions IT, sécurité électronique et transformation digitale), développé avec **Next.js 15** (App Router), **React 19**, **TypeScript** et **Tailwind CSS**.

- Une seule page responsive : Accueil, À propos, Nos solutions, Contact
- Bilingue **FR / EN** (bouton dans le menu, choix mémorisé dans le navigateur)
- Lien « Support » vers l'application `groupegenetics-admin`

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
| `NEXT_PUBLIC_SUPPORT_URL` | Lien « Support » du menu (connexion admin) | `http://localhost:3000/login` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (Open Graph) | `https://www.groupegenetics.com` |
| `FRONT_PORT` | Port hôte utilisé par Docker Compose | `3001` |

## 🏗️ Structure

```
app/
  layout.tsx        # Police Inter, métadonnées SEO, provider de langue
  page.tsx          # Assemble les sections
  globals.css       # Tailwind + classes utilitaires (boutons, sections)
components/
  Header.tsx        # Menu fixe + menu mobile + sélecteur FR/EN
  Hero.tsx          # Accueil
  About.tsx         # Qui sommes-nous, vision, mission, valeurs
  Solutions.tsx     # Les 3 pôles de services + bandeau CTA
  Contact.tsx       # Bureaux Sénégal / Gambie + e-mail
  Footer.tsx
lib/
  content.ts        # ✏️ TOUS les textes (FR + EN) et coordonnées
  i18n.tsx          # Gestion de la langue
  config.ts         # URL du support
public/
  logo.png
```

Pour modifier un texte, un numéro ou une adresse : éditer uniquement `lib/content.ts`.
