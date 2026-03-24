import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../services/api";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "customer",
        companyName: "",
        experienceYears: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(""); // Clear error on input change
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.password) {
            setError("Please fill in all required fields");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const userData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                phone: formData.phone,
                companyName: formData.companyName || undefined,
                experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined
            };

            await users.register(userData);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 w-full max-w-md text-center space-y-4">
                    <div className="text-5xl">✅</div>
                    <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
                    <p className="text-gray-600">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 w-full max-w-2xl space-y-6 animate-fade-in">
                <div className="text-center">
                    <img src="/scaffoldz-logo.png" alt="Scaffoldz Logo" className="w-48 h-auto mx-auto object-contain drop-shadow-lg" />
                    <p className="text-gray-500 mt-2 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Select Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        >
                            <option value="customer">Customer</option>
                            <option value="contractor">Contractor</option>
                            <option value="vendor">Vendor</option>
                            <option value="management">Management</option>
                        </select>
                    </div>

                    {/* Grid for Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="1234567890"
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Contractor/Management/Vendor specific fields */}
                    {(formData.role === "contractor" || formData.role === "management" || formData.role === "vendor") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="ABC Constructions"
                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>

                            {formData.role === "contractor" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Experience (Years)</label>
                                    <input
                                        type="number"
                                        name="experienceYears"
                                        value={formData.experienceYears}
                                        onChange={handleChange}
                                        placeholder="5"
                                        min="0"
                                        className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* Login Link */}
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-primary font-semibold hover:underline"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center text-xs text-gray-400 mt-6">
                    &copy; 2026 Scaffoldz Construction Platform
                </div>
            </div>
        </div>
    );
}

export default Signup;
