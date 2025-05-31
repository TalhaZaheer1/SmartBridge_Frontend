import { useState } from "react";
import { register } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Form submitted:", form); // ✅ Log form data

  if (!form.name || !form.password || !form.phone) {
    toast.error("Please fill in all fields.");
    return;
  }
  if (form.email && !isValidEmail(form.email)) {
    toast.error("Enter a valid email address.");
    return;
  }

  setLoading(true);
  try {
    await register(form);
    toast.success("Registered successfully!.");
    navigate("/login")
    // navigate("/verify-otp", { state: { email: form.email } });
  } catch (err) {
    console.error("Registration error:", err); // ✅ Log backend error
    toast.error(err.response?.data?.message || "Registration failed.");
  } finally {
    setLoading(false);
  }
};


  const handleOAuth = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-md border rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 w-full md:w-1/2 p-10">
          <img
            src="/store-register.svg"
            alt="Register"
            className="max-w-xs"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Start your shopping journey with us.
          </p>

          {/* OAuth */}
          {/* <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center border rounded py-2 bg-white hover:bg-gray-50 text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button>
            <button
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center border rounded py-2 bg-white hover:bg-gray-50 text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/349375/github.svg"
                className="w-5 h-5 mr-2"
              />
              Sign up with GitHub
            </button>
          </div> */}

          {/* Role Selection */}
          <div className="flex gap-2 justify-center mb-4">
            {["store", "candidate"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                disabled={form.role === role}
                className={`px-4 py-1 text-sm rounded-full transition ${
                  form.role === role
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role === "store" ? "vendor" : "candidate"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email (not required)"
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
            />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-900 transition"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By signing up, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-sm text-center mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-black font-medium">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
