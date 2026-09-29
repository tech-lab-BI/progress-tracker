import { useMemo, useState } from "react";

const labels = { folder: "Folder", task: "Task", point: "Point" };
const parentCandidates = (type, items) => items.filter((item) => type === "folder" ? item.type === "folder" : type === "task" ? item.type === "folder" : item.type === "task");

function getItemPath(item, itemsById) {
  const path = [item.name];
  let parent = item.parentId && itemsById.get(String(item.parentId));
  while (parent) {
    path.unshift(parent.name);
    parent = parent.parentId && itemsById.get(String(parent.parentId));
  }
  return path.join(" / ");
}

export default function Sidebar({ items, onCreate }) {
  const [type, setType] = useState("folder"); const [name, setName] = useState(""); const [parentId, setParentId] = useState(""); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");
  const parents = useMemo(() => {
    const itemsById = new Map(items.map((item) => [String(item._id), item]));
    return parentCandidates(type, items).map((item) => ({ ...item, path: getItemPath(item, itemsById) }));
  }, [type, items]);
  const chooseType = (next) => { setType(next); setParentId(""); setError(""); };
  const submit = async (event) => {
    event.preventDefault(); const value = name.trim();
    if (!value) return setError("Give this item a name first.");
    if (type !== "folder" && !parentId) return setError(`Choose a parent ${type === "task" ? "folder" : "task"}.`);
    setSubmitting(true); setError("");
    try { await onCreate({ name: value, type, parentId: parentId || null, done: type === "point" ? false : undefined }); setName(""); setParentId(""); }
    catch (requestError) { setError(requestError.message || "Could not add this item."); }
    finally { setSubmitting(false); }
  };
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark">✓</span><span>Trackly</span></div>
    <div className="sidebar-copy"><h2>Add to your plan</h2><p>Create folders, tasks, and the small points that move them forward.</p></div>
    <div className="type-tabs">{Object.keys(labels).map((key) => <button key={key} type="button" className={type === key ? "active" : ""} onClick={() => chooseType(key)}>Add {labels[key]}</button>)}</div>
    <form className="item-form" onSubmit={submit}>
      <label>{labels[type]} name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name this item" maxLength="100" /></label>
      <label>Parent {type === "folder" && <span className="optional">(optional)</span>}<select value={parentId} onChange={(event) => setParentId(event.target.value)}><option value="">{type === "folder" ? "Root level" : parents.length ? `Select a ${type === "task" ? "folder" : "task"}` : `Add a ${type === "task" ? "folder" : "task"} first`}</option>{parents.map((parent) => <option value={parent._id} key={parent._id}>{parent.path}</option>)}</select></label>
      {error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={submitting} type="submit">{submitting ? "Adding…" : `Add ${labels[type]}`}</button>
    </form>
  </aside>;
}
