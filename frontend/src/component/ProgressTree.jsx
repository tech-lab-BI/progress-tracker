import TreeItem from "./TreeItem";

export function buildTree(items) {
  const nodes = new Map(items.map((item) => [item._id, { ...item, children: [] }])); const roots = [];
  nodes.forEach((node) => { const parent = node.parentId && nodes.get(node.parentId); if (parent) parent.children.push(node); else roots.push(node); });
  return roots;
}
export default function ProgressTree({ items, onDelete, onPointToggle }) {
  const tree = buildTree(items);
  if (!tree.length) return <div className="empty-state"><span>✦</span><h2>Your tracker is ready</h2><p>Start by adding a folder from the panel on the left.</p></div>;
  return <section className="progress-tree">{tree.map((item) => <TreeItem key={item._id} item={item} onDelete={onDelete} onPointToggle={onPointToggle} />)}</section>;
}
