"use client";

import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import clsx from "clsx";

interface LabelledInputProps {
  id: string;
  type?: string;
  disabled: boolean;
  register: UseFormRegister<FieldValues>;
  placeholder: string;
  label: string;
}

const LabelledInput: React.FC<LabelledInputProps> = ({
  id,
  register,
  disabled,
  placeholder,
  label,
  type = "text",
}) => {
  return (
    <div className="flex flex-col text-gray-600">
      <label className="text-sm lg:text-base font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        className={clsx(
          "mt-2 lg:mt-3 px-4 lg:px-6 hover:cursor-text placeholder:text-sm text-sm lg:text-base lg:placeholder:text-base py-2.5 lg:py-3 border-2 rounded-lg border-gray-100 lg:border-gray-200 outline-none focus:ring-2 ring-inset focus:ring-inset focus:ring-sky-500",
          disabled && "bg-gray-300"
        )}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id, { required: true })}
      />
    </div>
  );
};

export default LabelledInput;
