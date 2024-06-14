import React from "react";
import "./styles.css";

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen-container">
      <div className="screen-inner-container">{children}</div>
    </div>
  );
}

export default ScreenContainer;
