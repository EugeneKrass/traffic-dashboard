/**
 * Loading spinner component
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} text - Optional loading text
 */
export const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-b-2 border-blue-600`}
      ></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};
