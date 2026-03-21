import { Input } from "~/components/ui/input";
import { useState } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";

const PasswordInput = ({...props}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col'>
      <div className="relative">
        <Input
        {...props}
        type={showPassword ? "text" : "password"}
          className="pr-10"
          placeholder="**********"

        />
        <button
          type="button"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
          {showPassword ? <FaEyeSlash /> : <FaEye/> }
        </button>
      </div>
    </div>
  )
}

export default PasswordInput;