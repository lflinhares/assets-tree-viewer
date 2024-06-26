import { useMemo, useState } from "react";
import { TreeCompany } from "../types";

export function useSearch({ tree }: { tree: TreeCompany | undefined }) {
  const [search, setSearch] = useState("");
  const [property, setProperty] = useState("name");

  function recursiveFilter(
    node: any,
    property: string,
    value: string
  ): TreeCompany[] {
    if (node[property]?.toLowerCase().includes(value.toLowerCase())) {
      return [{ ...node }];
    }

    let childrenMatches = [];
    if (node.children && node.children.length > 0) {
      childrenMatches = node.children.flatMap((child: any) =>
        recursiveFilter(child, property, value)
      );
    }

    if (childrenMatches.length > 0) {
      return [{ ...node, children: childrenMatches }];
    }

    return [];
  }

  const filteredTree = useMemo(() => {
    if (!tree) {
      return [];
    }
    if (!search) return tree.children;

    const newTree = recursiveFilter(tree, property, search);

    return newTree[0]?.children || [];
  }, [tree, search, property]);

  return { setSearch, search, setProperty, property, filteredTree };
}
