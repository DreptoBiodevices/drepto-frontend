export const ADMIN_CREDENTIALS = {
  email: (import.meta.env.VITE_ADMIN_EMAIL || 'Dreptoadmin@gmail.com').trim(),
  password: (import.meta.env.VITE_ADMIN_PASSWORD || 'Drepto2025').trim()
};

export const ADMIN_AUTH_KEY = 'adminAuth';