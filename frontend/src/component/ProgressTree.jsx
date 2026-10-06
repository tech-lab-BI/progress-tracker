import { useEffect, useState } from "react";
import TreeItem from "./TreeItem";

export function buildTree(items) {
  const nodes = new Map(
    items.map((item) => [item._id, { ...item, children: [] }]),
  );
  const roots = [];
  nodes.forEach((node) => {
    const parent = node.parentId && nodes.get(node.parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  return roots;
}
export default function ProgressTree({
  items,
  onDelete,
  onRename,
  onPointToggle,
}) {
  const [expandedMap, setExpandedMap] = useState({});

  useEffect(() => {
    setExpandedMap((current) => {
      const next = {};
      Object.entries(current).forEach(([id, expanded]) => {
        if (items.some((item) => String(item._id) === String(id))) {
          next[id] = expanded;
        }
      });
      return next;
    });
  }, [items]);

  const toggleExpanded = (id) => {
    setExpandedMap((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const tree = buildTree(items);
  if (!tree.length)
    return (
      <div className="empty-state">
        <h2>Your tracker is ready</h2>
        <p>Start by adding a folder from the panel on the left.</p>
      </div>
    );
  return (
    <section className="progress-tree">
      {tree.map((item) => (
        <TreeItem
          key={item._id}
          item={item}
          expanded={Boolean(expandedMap[item._id])}
          expandedMap={expandedMap}
          onToggle={toggleExpanded}
          onDelete={onDelete}
          onRename={onRename}
          onPointToggle={onPointToggle}
        />
      ))}
    </section>
  );
}
