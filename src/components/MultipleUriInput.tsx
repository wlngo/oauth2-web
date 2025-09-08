import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Plus, X } from 'lucide-react'

interface MultipleUriInputProps {
  label: string
  value: string[]
  onChange: (uris: string[]) => void
  placeholder?: string
}

export function MultipleUriInput({ label, value, onChange, placeholder }: MultipleUriInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue])
      setInputValue('')
    }
  }

  const handleRemove = (uriToRemove: string) => {
    onChange(value.filter(uri => uri !== uriToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {/* Display existing URIs */}
      {value.length > 0 && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-2">已添加的 URI:</div>
          <div className="flex gap-2 flex-wrap">
            {value.map((uri, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 pr-1 cursor-pointer hover:bg-red-50 hover:border-red-300 group"
              >
                <span className="break-all">{uri}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleRemove(uri)}
                >
                  <X className="h-3 w-3 text-red-500 group-hover:text-red-700" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add new URI */}
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
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}