/**
 * Reusable Button component with different variants
 * @param {string} variant - 'primary' | 'secondary' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} type - Button type (button/submit/reset)
 * @param {boolean} disabled - Whether button is disabled
 */
export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  // Base styles
  const baseStyles =
    "font-medium rounded-md transition duration-200 flex items-center justify-center";

  // Variant styles
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  };

  // Size styles
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
