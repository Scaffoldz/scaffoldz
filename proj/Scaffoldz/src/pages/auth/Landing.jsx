import { Link } from 'react-router-dom';
import { HardHat, Briefcase, User } from 'lucide-react';

const Landing = () => {
    const roles = [
        { id: 'management', title: 'Management', icon: Briefcase, color: 'blue', desc: 'Oversee projects & contractors' },
        { id: 'contractor', title: 'Contractor', icon: HardHat, color: 'orange', desc: 'Update progress & manage tasks' },
        { id: 'customer', title: 'Customer', icon: User, color: 'green', desc: 'Track project status & budget' },
    ];

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 mb-8">Please select your role to continue</p>

            <div className="grid gap-4">
                {roles.map((role) => (
                    <Link
                        key={role.id}
                        to={`/login?role=${role.id}`}
                        className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-left"
                    >
                        <div className={`p-3 rounded-full bg-${role.color}-100 text-${role.color}-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                            <role.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{role.title}</h3>
                            <p className="text-sm text-gray-500">{role.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Landing;
