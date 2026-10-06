import { useMemo } from "react";
import ProgressBar from "./ProgressBar";

function calculateItemProgress(item, items) {
  const children = items.filter(
    (entry) => String(entry.parentId) === String(item._id),
  );

  if (item.type === "point") return item.done ? 100 : 0;
  if (!children.length) return 0;

  const childProgress = children.map((child) =>
    calculateItemProgress(child, items),
  );
  return (
    childProgress.reduce((total, value) => total + value, 0) /
    childProgress.length
  );
}

export default function Analysis({ items = [] }) {
  const summary = useMemo(() => {
    const totalPoints = items.filter((item) => item.type === "point").length;
    const completedPoints = items.filter(
      (item) => item.type === "point" && item.done,
    ).length;
    const tasks = items.filter((item) => item.type === "task");
    const folders = items.filter((item) => item.type === "folder").length;
    const overall =
      totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    return {
      overall,
      completedPoints,
      totalPoints,
      completedTasks: completedPoints,
      totalTasks: totalPoints,
      folders,
    };
  }, [items]);

  if (!items.length) {
    return (
      <section className="analysis-panel empty-analysis">
        <h2>Analysis</h2>
        <p>Add a folder, task, or point to start tracking your momentum.</p>
      </section>
    );
  }

  return (
    <section className="analysis-panel">
      <div className="analysis-header">
        <h2>Analysis</h2>
      </div>

      <div className="analysis-summary">
        <div className="analysis-main">
          <p className="analysis-label">Overall percentage</p>

          {summary.totalPoints > 0 && (
            <div className="analysis-progress-meta">
              <span>
                {summary.completedPoints} / {summary.totalPoints} done
              </span>
            </div>
          )}

          <div className="capsule-wrapper">
            <div
              className="percentage-pointer"
              style={{ left: `${summary.overall}%` }}
            >
              <span>{summary.overall}%</span>
              <div className="pointer-arrow"></div>
            </div>

            <div className="capsule">
              <div
                className="capsule-fill"
                style={{ width: `${summary.overall}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
