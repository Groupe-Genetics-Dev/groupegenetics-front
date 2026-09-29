// Valeurs intégrées au build (variables NEXT_PUBLIC_*)

// Lien "Support" du menu : page de connexion de groupegenetics-admin
export const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL || "/support/login"

// API groupegenetics-api, utilisée par le formulaire de contact (POST /contact/send-email)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const WELQO_URL = "https://welqo.sn"
