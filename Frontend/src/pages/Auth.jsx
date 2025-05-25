import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Auth() {
  const { login, register } = useAuthStore();
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!signupData.name || !signupData.email || !signupData.password) {
      return toast.error('All fields are required for registration');
    }
    const result = await register(signupData);
    if (result?.success) {
      toast.success(`Welcome ${signupData.name} 👋`);
    //   navigate('/');
      console.log(result)
    } else {
      toast.error(result?.message || 'Registration failed ❌');
    }
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      return toast.error('Email and password are required');
    }
    const result = await login(loginData);
    if (result?.success) {
      toast.success('Login successful 👌');
    //   navigate('/');
      console.log(result);
    } else {
      toast.error(result?.message || 'Login failed ❌');
    }
  };

  return (
    <div className="flex min-h-screen w-full ">
      {/* Signup */}
      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center px-8">
        <h2 className="text-[40px] font-semibold mb-2">
          Welcome to <span className="text-blue-600">BEWAKOOF</span>
        </h2>
        <p className="mb-4 text-3xl text-gray-600">Create your account</p>
        <input
          className="w-72 px-4 py-2 mb-3 border rounded"
          type="text"
          placeholder="Full Name"
          value={signupData.name}
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
        />
        <input
          className="w-72 px-4 py-2 mb-3 border rounded"
          type="email"
          placeholder="Email"
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
        />
        <input
          className="w-72 px-4 py-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleRegister}
        >
          Create My Account
        </button>
      </div>

      {/* OR */}
      <div className="flex flex-col items-center justify-center mx-4 relative">
        <div className="w-px h-64 bg-blue-600" />
        <div className="absolute text-blue-600 bg-white px-2 text-xl -rotate-90">OR</div>
      </div>

      {/* Login */}
      <div className="w-1/2 flex flex-col justify-center items-center px-8">
        <p className="mb-4 text-3xl text-gray-600">Login your account</p>
        <input
          className="w-72 px-4 py-2 mb-3 border rounded"
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <input
          className="w-72 px-4 py-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
