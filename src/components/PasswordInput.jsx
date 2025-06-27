import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ name, placeholder, register, error, disabled }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        // --- FIX: Replaced dark-theme classes with light-theme classes ---
        className={`w-full p-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
        {...register(name)}
        disabled={disabled}
      />
      {/* Also ensure the eye icon has the correct light-theme color */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
        disabled={disabled}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
}