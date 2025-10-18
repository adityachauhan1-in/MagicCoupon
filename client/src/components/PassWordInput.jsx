import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
// showPassword is a state variable that determines whether to show the password or not
  return (
    <div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
                 placeholder="Password"
          value={value}
          onChange={onChange}
          required
              minLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition placeholder-gray-400 pr-12"
        />
        <span
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600 transition"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

    
    
    
    </div>
  );
};

export default PasswordInput;
