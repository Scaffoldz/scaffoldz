import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const role = searchParams.get('role') || 'management';

    useEffect(() => {
        // Pre-fill email based on selected role for demo convenience
        if (role === 'management') setEmail('admin@scaffoldz.com');
        else if (role === 'contractor') setEmail('bob@build.com');
        else if (role === 'customer') setEmail('charlie@client.com');
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            if (user.role === 'management') navigate('/management');
            else if (user.role === 'contractor') navigate('/contractor');
            else if (user.role === 'customer') navigate('/customer');
            else navigate('/');
        } catch (err) {
            setError('Invalid credentials. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center capitalize">
                {role} Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="name@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm text-gray-500 hover:text-blue-600"
                >
                    Change Role
                </button>
            </div>
        </div>
    );
};

export default Login;
