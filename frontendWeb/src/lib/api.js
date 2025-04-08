import { apiFetch } from "./apiFetch";

// 🔐 Utilisateur (auth)
export async function fetchUserProfile() {
  return await apiFetch("/users/profile");
}

export async function updateUserProfile(data) {
  return await apiFetch("/users/profile", {
    method: "PUT",
    body: data
  });
}

// 📄 Documents
export async function uploadUserDocument(formData) {
  return await apiFetch("/documents/upload", {
    method: "POST",
    body: formData,
    isFormData: true
  });
}

export async function downloadUserDocument(type) {
  return await apiFetch(`/documents/download/${type}`, {
    method: "GET"
  });
}

// 🔔 Notifications
export async function fetchNotifications() {
  return await apiFetch("/notifications");
}

export async function registerUser(data) {
    return await apiFetch("/users/register", {
      method: "POST",
      body: data
    });
  }

  export async function loginUser(credentials) {
    return await apiFetch("/users/login", {
      method: "POST",
      body: credentials
    });
  }

// ➕ Ajoute d’autres fonctions spécifiques ici au besoin...
