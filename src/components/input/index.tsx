import { useEffect, useState } from "react";
import "./styles.css";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.png";

interface InputProps {
  onChange: (value: string) => any;
  icon?: boolean;
  label: string;
}

function Input({ onChange, icon, label }: InputProps) {
  const [value, setValue] = useState("");

  const debounceValue = useDebounce(value, 300);

  useEffect(() => {
    onChange(debounceValue);
  }, [debounceValue]);

  return (
    <label htmlFor={label} className="input-container">
      <input
        id={label}
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      {icon && <img src={SearchIcon} alt="Search Icon" />}
    </label>
  );
}

export default Input;
