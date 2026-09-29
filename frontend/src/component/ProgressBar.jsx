export default function ProgressBar({ progress }) {
  const value = Math.round(progress);
  return <div className="progress-display"><div className="progress-bar" aria-label={`${value}% complete`}><span style={{ width: `${value}%` }} /></div><span className="progress-value">{value}%</span></div>;
}
