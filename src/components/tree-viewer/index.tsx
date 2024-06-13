import React, { useContext } from "react";
import Node from "../node";
import { UnitContext } from "../../contexts/unitContext";
import "./styles.css";
import { useSearch } from "../../hooks/useSearch";
import Input from "../input";

const TreeViewer: React.FC = () => {
  const { tree, unit } = useContext(UnitContext);

  const { filteredTree, setProperty, setSearch } = useSearch({
    tree: tree?.[unit.id],
  });

  return (
    <div className="tree-container">
      <Input
        onChange={(value) => {
          setSearch(value);
        }}
        icon
      />

      {filteredTree?.map((node: any) => {
        return (
          <Node
            id={node.id}
            key={node.id}
            children={node.children}
            name={node.name}
            type={node.type}
          />
        );
      })}

      {/* 
      {tree?.[unit.id]?.children.map((node: any) => {
        return (
          <Node
            id={node.id}
            key={node.id}
            children={node.children}
            name={node.name}
            type={node.type}
          />
        );
      })} */}
    </div>
  );
};

export default TreeViewer;
