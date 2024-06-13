import { useEffect, useState } from "react";
import "./styles.css";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.png";

interface InputProps {
  onChange: (value: string) => any;
  icon?: boolean;
}

function Input({ onChange, icon }: InputProps) {
  const [value, setValue] = useState("");

  const debounceValue = useDebounce(value, 300);

  useEffect(() => {
    onChange(debounceValue);
  }, [debounceValue]);

  return (
    <div className="input-container">
      <input
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      {icon && <img src={SearchIcon} alt="Search Icon" />}
    </div>
  );
}

export default Input;
