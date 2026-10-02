import { useCallback, useEffect, useState } from "react";
import Sidebar from "./component/Sidebar";
import ProgressTree from "./component/ProgressTree";
import { createItem, deleteItem, getItems, updateItem } from "./service/apiCall";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getItems());
    } catch (requestError) {
      setError(requestError.message || "Unable to load your progress items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);
  const handleCreate = async (item) => {
    await createItem(item);
    await refreshItems();
  };
  const handleDelete = async (id) => {
    await deleteItem(id);
    await refreshItems();
  };
  const handlePointToggle = async (id) => {
    const point = items.find((item) => item._id === id);
    if (!point) return;
    const done = !point.done;
    setError("");
    setItems((all) => all.map((item) => item._id === id ? { ...item, done } : item));
    try {
      const saved = await updateItem(id, { done });
      setItems((all) => all.map((item) => item._id === id ? saved : item));
    } catch (requestError) {
      setItems((all) => all.map((item) => item._id === id ? { ...item, done: point.done } : item));
      setError(requestError.message || "Unable to save this point.");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar items={items} onCreate={handleCreate} />
      <main className="main-content">
        <header className="page-heading">
          <p className="eyebrow">Workspace</p>
          <h1>Progress tracker</h1>
          <p>Build momentum, one completed point at a time.</p>
        </header>
        {error && <div className="status-message error-message">{error}</div>}
        {loading ? (
          <div className="status-message">Loading your tracker…</div>
        ) : (
          <ProgressTree
            items={items}
            onDelete={handleDelete}
            onPointToggle={handlePointToggle}
          />
        )}
      </main>
    </div>
  );
}

export default App;
