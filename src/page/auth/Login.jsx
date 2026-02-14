import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate(`/${role}/dashboard`);
    } else {
      alert("Please fill in all fields (Mock Login)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md space-y-8 animate-fade-in border border-gray-100">
        <div className="text-center">
          <h1 className="text-4xl mb-2">🏗️</h1>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Scaffoldz
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
              <option value="customer">Customer</option>
              <option value="contractor">Contractor</option>
              <option value="management">Management</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 mt-6">
          &copy; 2026 Scaffoldz Construction Platform
        </div>
      </div>
    </div>
  );
}

export default Login;
