
import React from 'react';

interface ChoiceGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  borderTop?: boolean;
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({ 
  label, 
  options, 
  value, 
  onChange,
  borderTop = false
}) => {
  return (
    <div className={`space-y-2 ${borderTop ? 'pt-2 border-t border-dashed border-gray-200' : ''}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              value === opt
                ? 'bg-primary text-white border border-primary shadow-sm'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
