import React from "react";

export default function Select({
  name,
  label,
  value,
  error = "",
  onChange,
  children,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={"form-control" + (error ? " is-invalid" : "")}
      >
        {children}
      </select>
      <p className="invalid-feedback">{error}</p>
    </div>
  );
}
