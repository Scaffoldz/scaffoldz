import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    setError("");
    setOtpMessage("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await auth.generateOTP(email, password, role);
      setShowOtp(true);
      setOtpMessage(response.message || "OTP sent to your email successfully!");

      // If in development, show the OTP from response
      if (response.dev_otp) {
        setOtpMessage(`DEV MODE: Your OTP is ${response.dev_otp}`);
      }
    } catch (err) {
      setError(err.message || "Failed to generate OTP. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await auth.verifyOTP(email, otp);
      const actualRole = response.user.role;

      // Validate that the selected role matches the actual account role
      if (actualRole !== role) {
        const roleLabels = {
          customer: "Customer",
          contractor: "Contractor",
          vendor: "Vendor",
          management: "Management",
        };
        setError(
          `Selected role does not match your account role. Your account is registered as "${roleLabels[actualRole] || actualRole}".`
        );
        setOtp("");
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("userRole", actualRole);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("userName", response.user.fullName);
      localStorage.setItem("userEmail", response.user.email);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Redirect to the correct dashboard
      const dashboardRoutes = {
        customer: "/customer/dashboard",
        contractor: "/contractor/dashboard",
        vendor: "/vendor/dashboard",
        management: "/management/dashboard",
      };
      navigate(dashboardRoutes[actualRole] || "/");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp(""); // Clear OTP field on error
    } finally {
      setLoading(false);
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
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success/OTP Message */}
          {otpMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {otpMessage}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={showOtp || loading}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="customer">Customer</option>
              <option value="contractor">Contractor</option>
              <option value="vendor">Vendor</option>
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
              disabled={showOtp || loading}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={showOtp || loading}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-gray-700">One-Time Password</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={loading}
                className="w-full border border-accent p-3 rounded-md focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all placeholder:text-gray-400 bg-gray-50 disabled:cursor-not-allowed"
                autoFocus
              />
              <p className="text-xs text-gray-500">Check your email for the OTP code</p>
            </div>
          )}

          {!showOtp ? (
            <button
              onClick={handleGenerateOtp}
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Generate OTP"}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-md hover:bg-green-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setOtp("");
                  setError("");
                  setOtpMessage("");
                }}
                disabled={loading}
                className="w-full text-gray-600 text-sm hover:text-gray-800 transition-colors disabled:cursor-not-allowed"
              >
                ← Back to credentials
              </button>
            </div>
          )}
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline"
          >
            Create one
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 mt-6">
          &copy; 2026 Scaffoldz Construction Platform
        </div>
      </div>
    </div>
  );
}

export default Login;
