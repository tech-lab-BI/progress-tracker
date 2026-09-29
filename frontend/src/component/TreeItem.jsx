import { useState } from "react";
import ProgressBar from "./ProgressBar";

function calculateProgress(item) {
  if (item.type === "point") return item.done ? 100 : 0;
  if (!item.children.length) return 0;
  if (item.type === "task") return (item.children.filter((child) => child.done).length / item.children.length) * 100;
  return item.children.reduce((total, child) => total + calculateProgress(child), 0) / item.children.length;
}
export default function TreeItem({ item, onDelete, onPointToggle }) {
  const [expanded, setExpanded] = useState(true); const point = item.type === "point"; const children = item.children.length > 0;
  const remove = async () => { if (window.confirm(`Delete “${item.name}”?`)) await onDelete(item._id); };
  return <div className={`tree-item ${item.type}`}><div className="tree-row">
    {!point ? <button className="expand-button" onClick={() => setExpanded((value) => !value)} aria-label={`${expanded ? "Collapse" : "Expand"} ${item.name}`}>{children ? (expanded ? "⌄" : "›") : "·"}</button> : <input className="point-checkbox" type="checkbox" checked={Boolean(item.done)} onChange={() => onPointToggle(item._id)} aria-label={`Mark ${item.name} complete`} />}
    <span className={`item-icon ${item.type}`}>{item.type === "folder" ? "▣" : item.type === "task" ? "◈" : "•"}</span><span className="item-name">{item.name}</span>{!point && <ProgressBar progress={calculateProgress(item)} />}<button className="delete-button" onClick={remove} aria-label={`Delete ${item.name}`}>×</button>
  </div>{!point && expanded && children && <div className="tree-children">{item.children.map((child) => <TreeItem key={child._id} item={child} onDelete={onDelete} onPointToggle={onPointToggle} />)}</div>}</div>;
}
