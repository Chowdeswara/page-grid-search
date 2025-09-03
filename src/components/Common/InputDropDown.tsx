// Custom InputDropDown component with different interface
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface InputDropDownProps {
  label?: string;
  dropdownOptions: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const InputDropDown: React.FC<InputDropDownProps> = ({ 
  label, 
  dropdownOptions, 
  selectedOption, 
  onOptionChange, 
  value, 
  onValueChange, 
  className,
  placeholder 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <div className="flex gap-2">
        <Select value={selectedOption} onValueChange={onOptionChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {dropdownOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export { InputDropDown };
export type { InputDropDownProps };