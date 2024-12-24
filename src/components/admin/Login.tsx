import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { handleAdminLogin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { adminLogin } from "../../redux/adminAuthSlice"; 

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log(email, password);

      const response = await handleAdminLogin(email, password);
      console.log("Login successful:", response);

      dispatch(adminLogin({ accessToken: response.accessToken }));

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 max-w-md w-full shadow-lg rounded-lg">
        <h2 className="mb-3 text-xl font-semibold sm:mb-10 sm:text-2xl md:text-3xl text-center">
          Admin Login
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg h-12 focus:outline-gray-700 px-2 placeholder:font-normal placeholder:text-sm"
            placeholder="Enter Email"
            required
          />

          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg h-12 focus:outline-gray-700 px-3 placeholder:font-normal placeholder:text-sm"
              placeholder="Password"
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 py-2 md:py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
