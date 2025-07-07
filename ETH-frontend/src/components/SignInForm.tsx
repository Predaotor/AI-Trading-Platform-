import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simple mock login for now
      console.log('Login attempt:', formData);
      setMessage('Login successful! Redirecting...');
      
      // Mock successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full rounded-lg bg-black/20 backdrop-blur-xl border border-purple-500/20 p-8 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Sign In
          </h2>
          <p className="text-purple-300 mt-2">Welcome back to CryptoBot Pro</p>
        </div>

        <form onSubmit={handleSubmit}>
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-purple-600 hover:bg-purple-700 py-3 text-white font-medium transition-colors"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-purple-300">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-purple-400 hover:text-purple-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignInForm };
