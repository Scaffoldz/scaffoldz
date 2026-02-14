import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleGenerateOtp = (e) => {
    e.preventDefault();
    if (email && password) {
      setShowOtp(true);
      alert("Mock OTP sent: 1234");
    } else {
      alert("Please enter email and password");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (otp === "1234") {
      // Store role for identifying user session
      localStorage.setItem("userRole", role);
      navigate(`/${role}/dashboard`);
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Scaffoldz
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
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
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-gray-700">One-Time Password</label>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-accent p-3 rounded-md focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all placeholder:text-gray-400 bg-gray-50"
              />
            </div>
          )}

          {!showOtp ? (
            <button
              onClick={handleGenerateOtp}
              className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
            >
              Generate OTP
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full bg-green-700 text-white font-bold py-3 rounded-md hover:bg-green-800 transition-all shadow-sm active:scale-[0.98]"
            >
              Verify & Login
            </button>
          )}
        </form>

        <div className="text-center text-xs text-gray-400 mt-6">
          &copy; 2026 Scaffoldz Construction Platform
        </div>
      </div>
    </div>
  );
}

export default Login;
