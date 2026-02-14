const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                    {Icon && <Icon size={24} />}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
