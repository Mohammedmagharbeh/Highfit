import * as React from "react"

const Button = ({ className, variant, size, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  // هذه هي الألوان التي يحتاجها كودك
  const variants = {
    hero: "bg-primary text-primary-foreground shadow hover:bg-primary/90 px-8 py-3 text-lg",
    heroOutline: "border border-primary text-primary bg-transparent hover:bg-secondary px-4 py-2"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
      {...props}
    />
  )
}

export { Button }