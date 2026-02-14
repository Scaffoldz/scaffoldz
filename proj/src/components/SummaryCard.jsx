function SummaryCard({ icon: Icon, title, value, color = 'primary' }) {
    return (
        <div className="summary-card glass-card">
            <div className={`summary-card-icon ${color}`}>
                <Icon size={24} />
            </div>
            <div className="summary-card-content">
                <p className="summary-card-title">{title}</p>
                <h3 className="summary-card-value">{value}</h3>
            </div>
        </div>
    )
}

export default SummaryCard
