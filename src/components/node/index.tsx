import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AssetIcon from "../../assets/asset.png";
import ComponentIcon from "../../assets/component.png";
import LocationIcon from "../../assets/location.png";
import { Asset, Company, Location } from "../../types";
import "./styles.css";
import { UnitContext } from "../../contexts/unitContext";

export type NodeProps = {
  children: NodeProps[];
  type: "location" | "component" | "asset" | "company";
} & Asset &
  Company &
  Location;

function Node({ children, name, type, status }: NodeProps) {
  const { search } = useContext(UnitContext);
  const [close, setClose] = useState(true);
  const [initClosed, setInitClosed] = useState(true);

  const nodeIcon = useCallback((type: NodeProps["type"]) => {
    switch (type) {
      case "location":
        return LocationIcon;
      case "component":
        return ComponentIcon;
      case "asset":
        return AssetIcon;
      default:
        return "";
    }
  }, []);

  const recursiveRendering = useCallback(
    (node: any) => {
      if (node.children.length > 0 && !initClosed) {
        return node.children.map((child: any) => {
          return (
            <Node
              {...child}
              id={child.id}
              type={child.type}
              key={child.id}
              name={child.name}
              children={child.children}
            />
          );
        });
      }
    },
    [initClosed]
  );

  const hasChildren = useMemo(() => {
    return children.length > 0;
  }, [children]);

  useEffect(() => {
    if (hasChildren) {
      if (search) {
        setClose(false);
        setInitClosed(false);
      } else {
        setInitClosed(true);
        setClose(true);
      }
    }
  }, [search]);

  return (
    <div className={hasChildren ? "node-container" : "node-element"}>
      <div className="node-header">
        {hasChildren && (
          <button
            className="toggle"
            onClick={() => {
              if (initClosed) {
                setInitClosed(false);
              }

              setClose((close) => !close);
            }}
          >
            {close ? ">" : "v"}
          </button>
        )}

        {type !== "company" && (
          <img className="icon" src={nodeIcon(type)} alt={type} />
        )}

        <span className={type}>
          {name}{" "}
          {type === "component" && (
            <span className={`status-icon ${status}`}> </span>
          )}
        </span>
      </div>
      {hasChildren && (
        <div
          className={close ? "close-node" : ""}
          style={{ marginLeft: `10px` }}
        >
          {recursiveRendering({ children })}
        </div>
      )}
    </div>
  );
}

export default memo(Node);
