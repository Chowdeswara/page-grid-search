import React from 'react';
import { SearchableDropdown } from './SearchableDropdown';

interface InputDropDownProps {
  label?: string;
  placeholder?: string;
  options?: any[];
  dropdownOptions?: string[];
  selectedOption?: string;
  onOptionChange?: (option: any) => void;
  value: any;
  onValueChange: (val: string) => void;
  fetchOptions?: (searchTerm: string, page: number, pageSize: number) => Promise<{ options: any[]; total: number; }>;
  apiPayload?: any;
  className?: string;
}

export const InputDropDown: React.FC<InputDropDownProps> = ({
  value,
  onValueChange,
  placeholder = "Select option...",
  apiPayload,
  className
}) => {
  return (
    <SearchableDropdown
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      apiPayload={apiPayload}
      className={className}
    />
  );
};

export default InputDropDown;