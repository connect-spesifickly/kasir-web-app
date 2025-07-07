import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (props.onChange) {
      props.onChange(e);
    }
  };
  return (
    <div className="relative">
      <Input
        type={!showPassword ? "text" : "password"}
        className={cn(`pr-10 ${className}`)}
        ref={ref}
        value={inputValue}
        onChange={handleInputChange}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-0 inset-y-0 pr-3 flex items-center"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
