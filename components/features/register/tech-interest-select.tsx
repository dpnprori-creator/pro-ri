"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const techOptions = [
  { value: "robotika", label: "Robotika" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "iot", label: "IoT" },
  { value: "programming", label: "Programming" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "computer-vision", label: "Computer Vision" },
  { value: "embedded-system", label: "Embedded System" },
  { value: "drone-technology", label: "Drone Technology" },
  { value: "3d-printing", label: "3D Printing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "data-analytics", label: "Data Analytics" },
];

interface TechInterestSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function TechInterestSelect({
  selectedValues,
  onChange,
  error,
}: TechInterestSelectProps) {
  const [values, setValues] = useState<string[]>(selectedValues);

  const toggleValue = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <Label>
        Minat Teknologi <span className="text-pri-red">*</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {techOptions.map((option) => {
          const isSelected = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-all duration-200",
                isSelected
                  ? "bg-pri-red/20 border-pri-red text-white shadow-sm shadow-pri-red/20"
                  : "border-white/20 text-pri-silver hover:text-white hover:border-white/40 hover:bg-white/5"
              )}
            >
              {option.label}
              {isSelected && (
                <span className="ml-1.5 text-xs opacity-70">✓</span>
              )}
            </button>
          );
        })}
      </div>
      {values.length > 0 && (
        <p className="text-xs text-pri-silver">
          {values.length} dipilih
        </p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
