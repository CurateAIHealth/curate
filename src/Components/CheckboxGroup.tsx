'use client'

import { useState, useEffect } from "react";

 export const CheckboxGroup= ({
  label,
  options,
  selected,
  editable,
  onChange,
  multiple = false,
}: {
  label: any;
  options: any[];
  selected: any;
  editable: any;
  onChange: (val: any) => void;
  multiple?: any;
})=> {
  const [otherValue, setOtherValue] = useState("");


  useEffect(() => {
    if (multiple) {
      const otherItem = Array.isArray(selected)
        ? selected.find((s) => !options.includes(s))
        : null;
      setOtherValue(otherItem || "");
    } else {
      if (selected && !options.includes(selected)) {
        setOtherValue(selected);
      }
    }
  }, [selected, options, multiple]);

  const handleSelect = (option: string) => {
    if (multiple) {
      const current = Array.isArray(selected) ? selected.filter((x) => x !== "Other" && !otherValue.includes(x)) : [];
      if ((selected || []).includes(option)) {
        onChange(current.filter((x) => x !== option));
        if (option === "Other") setOtherValue("");
      } else {
        onChange([...current, option]);
      }
    } else {
      onChange(option);
      if (option !== "Other") setOtherValue("");
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherValue(value);

    if (multiple) {
     
      const current = (selected || []).filter((x:any) => x !== "Other" && x !== otherValue);
      onChange(value ? [...current, value] : current);
    } else {
      onChange(value);
    }
  };

  const isOtherSelected = multiple
    ? Array.isArray(selected) && (selected.includes("Other") || selected.some((v) => v === otherValue))
    : selected === "Other" || (selected && !options.includes(selected));

  return (
    <div className="mb-3">
      <label className="block text-gray-800  font-bold text-md mb-1">{label}</label>
      {editable ? (
        <div className="flex gap-4 flex-wrap">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-1 text-gray-700">
              <input
                type="checkbox"
                checked={
                  multiple
                    ? Array.isArray(selected) && selected.includes(opt)
                    : selected === opt
                }
                onChange={() => handleSelect(opt)}
              />
              {opt}
            </label>
          ))}

        
          {isOtherSelected && (
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Please specify..."
              value={otherValue}
              onChange={handleOtherChange}
            />
          )}
        </div>
      ) : (
        <p className="text-gray-800 min-h-[24px]">
          {multiple
            ? Array.isArray(selected) && selected.length > 0
              ? selected.join(", ")
              : "—"
            : selected || "—"}
        </p>
      )}
    </div>
  );
}
