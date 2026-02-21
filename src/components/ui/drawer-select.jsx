import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from 'lucide-react';

export function DrawerSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  triggerClassName,
  label 
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const selectedOption = options.find(opt => opt.value === value);

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button 
          className={triggerClassName}
          style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
        >
          <span className="text-left flex-1">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 opacity-50"
          >
            <path
              d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{label || placeholder}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onValueChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                value === opt.value
                  ? 'bg-[#FF6F61] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}