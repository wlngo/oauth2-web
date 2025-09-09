import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface QuickSelectOption {
  value: string
  label: string
  description: string
}

interface UnifiedInputComponentProps {
  label: string
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  quickSelectOptions?: QuickSelectOption[]
  quickSelectLabel?: string
}

export function UnifiedInputComponent({ 
  label, 
  value, 
  onChange, 
  placeholder,
  quickSelectOptions = [],
  quickSelectLabel = "常用选项"
}: UnifiedInputComponentProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue])
      setInputValue('')
    }
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove))
  }

  const handleQuickSelect = (optionValue: string) => {
    if (!value.includes(optionValue)) {
      onChange([...value, optionValue])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-3">{label}</label>
      
      {/* Current selected values */}
      {value.length > 0 && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-2">已选择的{label.replace(/\s*\*?\s*$/, '')}:</div>
          <div className="flex gap-2 flex-wrap">
            {value.map((item, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-red-50 hover:border-red-300"
                onClick={() => handleRemove(item)}
              >
                {item}
                <span className="ml-1 text-red-500">×</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add custom value */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim() || value.includes(inputValue.trim())}
            size="sm"
            variant="outline"
          >
            添加
          </Button>
        </div>
        
        {/* Quick select options */}
        {quickSelectOptions.length > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-2">{quickSelectLabel}:</div>
            <div className="flex gap-2 flex-wrap">
              {quickSelectOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={value.includes(option.value) ? "default" : "outline"}
                  onClick={() => handleQuickSelect(option.value)}
                  className="text-xs"
                  disabled={value.includes(option.value)}
                  title={option.description}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}