const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/items`;

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed (${response.status}). Please try again.`);
  if (response.status === 204 || !response.headers.get("content-type")?.includes("application/json")) return null;
  return response.json();
}

export const getItems = () => request(API_URL);
export const createItem = (item) => request(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
export const deleteItem = (id) => request(`${API_URL}/${id}`, { method: "DELETE" });
