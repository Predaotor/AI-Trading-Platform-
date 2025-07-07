import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simple mock registration for now
      console.log('Registration attempt:', formData);
      setMessage('Registration successful! Redirecting to Sign In...');
      
      // Mock successful registration
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full rounded-lg bg-black/20 backdrop-blur-xl border border-purple-500/20 p-8 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Sign Up
          </h2>
          <p className="text-purple-300 mt-2">Create your CryptoBot Pro account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-purple-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-purple-500/30 bg-black/20 text-white p-3 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-purple-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              className="w-full rounded-md border border-purple-500/30 bg-black/20 text-white p-3 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-purple-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full rounded-md border border-purple-500/30 bg-black/20 text-white p-3 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-purple-600 hover:bg-purple-700 py-3 text-white font-medium transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
        )}

        {/* Link to Sign In */}
        <div className="mt-6 text-center">
          <p className="text-purple-300">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };
