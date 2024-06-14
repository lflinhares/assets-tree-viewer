import React, { useContext } from "react";
import Node, { NodeProps } from "../node";
import { UnitContext } from "../../contexts/unitContext";
import "./styles.css";
import Input from "../input";

const TreeViewer: React.FC = () => {
  const { search, tree, setSearch, setProperty } = useContext(UnitContext);

  return (
    <div className="tree-container">
      <Input
        onChange={(value) => {
          setProperty("name");
          setSearch(value);
        }}
        icon
      />

      {tree?.map((node: NodeProps) => {
        return (
          <Node
            {...node}
            id={node.id}
            key={node.id}
            children={node.children}
            name={node.name}
            type={node.type}
          />
        );
      })}

      {tree.length === 0 &&
        (search ? (
          <span className="no-results">
            A busca não gerou nenhum resultado.
          </span>
        ) : (
          <span className="no-results"> Carregando... </span>
        ))}

      {/*   {tree?.[unit.id]?.children.map((node: any) => {
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
