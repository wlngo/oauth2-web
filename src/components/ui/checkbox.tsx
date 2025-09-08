import * as React from "react"

interface CheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function Checkbox({ id, checked, onChange, children, disabled = false, className = "" }: CheckboxProps) {
  return (
    <label 
      htmlFor={id}
      className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer absolute w-full h-full opacity-0 cursor-pointer"
        />
        <span className="w-5 h-5 rounded border-2 border-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 5.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </label>
  )
}