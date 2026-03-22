import { Input } from "~/components/ui/input";
import { useState, forwardRef } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const PasswordInput = forwardRef<HTMLInputElement, any>((props, ref) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col'>
      <div className="relative">
        <Input
          {...props}
          ref={ref} 
          className="pr-10"
          type={showPassword ? "text" : "password"}
        />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); 
            setShowPassword(true);
          }}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;
