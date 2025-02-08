import clsx from "clsx";
import React from "react";

interface RecordInputProps {
  type?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  id?: string;
  label?: string;
}

const RecordInput: React.FC<RecordInputProps> = ({
  placeholder,
  required,
  disabled,
  onChange,
  defaultValue,
  id,
  label,
  type = "text",
}) => {
  return (
    <div className="flex flex-col w-[90%] lg:w-[30vw] mb-2">
      <label
        className="mb-3 text-sm font-semibold text-slate-400 ml-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={clsx(
          "text-sm outline-none focus:ring-2 text-slate-700 ring-slate-200 ring-inset placeholder:font-medium px-6 py-4 border lg:border-2 border-slate-200 bg-slate-100 rounded-md w-full",
          disabled && "bg-zinc-300 text-zinc-100 placeholder:text-zinc-100"
        )}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default RecordInput;
