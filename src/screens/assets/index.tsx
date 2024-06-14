import React, { useContext } from "react";
import { UnitContext } from "../../contexts/unitContext";
import TreeViewer from "../../components/tree-viewer";
import ScreenContainer from "../../components/screen-container";

import "./styles.css";
import Filters from "../../components/filters";

const Assets: React.FC = () => {
  const { unit } = useContext(UnitContext);

  return (
    <ScreenContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="title-container">
          <span className="title">Ativos</span>{" "}
          <span className="unit-name">/ {unit.name} Unit </span>
        </div>

        <Filters
          filters={[
            {
              name: "Sensor de Energia",
              property: "sensorType",
              value: "energy",
            },
            { name: "Crítico", property: "status", value: "alert" },
          ]}
        />
      </div>

      <TreeViewer />
    </ScreenContainer>
  );
};

export default Assets;
