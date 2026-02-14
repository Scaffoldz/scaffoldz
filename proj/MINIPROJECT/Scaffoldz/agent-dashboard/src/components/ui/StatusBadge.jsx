export default function StatusBadge({ status }) {
    const variants = {
        Active: 'bg-green-100 text-green-700 border-green-200',
        Paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${variants[status] || variants.Active}`}>
            {status}
        </span>
    );
}
