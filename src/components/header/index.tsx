import { useContext } from "react";
import { UnitContext } from "../../contexts/unitContext";
import "./styles.css";
import Icon from "../../assets/Gold.png";
import TractianLogo from "../../assets/logo.png";

function Header() {
  const { units, unit: contextUnit, setUnit } = useContext(UnitContext);

  return (
    <header>
      <img src={TractianLogo} alt="Tractian Logo" />

      <div className="units-buttons-container">
        {units?.map((unit) => {
          return (
            <button
              key={unit.id}
              className={`unit-button  ${
                unit.id === contextUnit.id ? "selected-unit" : ""
              } `}
              onClick={() => {
                setUnit(unit);
              }}
            >
              <img src={Icon} alt="Icon" />
              {unit.name} Unit
            </button>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
