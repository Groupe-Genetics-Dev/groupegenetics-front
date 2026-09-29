// Valeurs intégrées au build (variables NEXT_PUBLIC_*)

// Lien "Support" du menu : espace client (connexion / création de compte)
export const SUPPORT_URL = "/support/login"

// API groupegenetics-api : formulaire de contact, connexion et création de compte
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Tableau de bord administrateur (groupegenetics-admin) : les admins y sont redirigés après connexion
export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000"
