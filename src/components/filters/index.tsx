import React, { useCallback, useContext } from "react";
import { UnitContext } from "../../contexts/unitContext";
import "./styles.css";
import Energy from "../../assets/energy.png";
import Alert from "../../assets/alert.png";

export type Filter = {
  name: string;
  property: string;
  value: string;
};

function Filters({ filters }: { filters: Filter[] }) {
  const { setSearch, setProperty, property } = useContext(UnitContext);

  const icon = useCallback((value: string) => {
    switch (value) {
      case "energy":
        return Energy;
      case "alert":
        return Alert;
      case "default":
        throw new Error("No icon found");
    }
  }, []);

  return (
    <div className="filters">
      {filters.map((filter) => {
        return (
          <button
            className={`filter-button ${
              property === filter.property ? "filter-active" : ""
            }`}
            onClick={() => {
              if (property === filter.property) {
                setProperty("name");
                setSearch("");
                return;
              }

              setProperty(filter.property);
              setSearch(filter.value);
            }}
          >
            <img src={icon(filter.value)} alt={`${filter.name} filter`} />
            {filter.name}
          </button>
        );
      })}
    </div>
  );
}

export default Filters;
