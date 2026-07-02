export default function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h2>{value}</h2>
        {description && <p className="stat-desc">{description}</p>}
      </div>

      {Icon && (
        <div className="stat-icon">
          <Icon size={26} />
        </div>
      )}
    </div>
  );
}