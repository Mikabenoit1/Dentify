export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = options.isFormData
    ? { Authorization: `Bearer ${token}` }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

  const response = await fetch(`http://localhost:4000/api${path}`, {
    ...options,
    headers,
    body: options.isFormData ? options.body : JSON.stringify(options.body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur serveur");
  }

  return await response.json();
}
