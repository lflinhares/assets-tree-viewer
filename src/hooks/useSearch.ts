import { useMemo, useState } from "react";

export function useSearch({ tree }: { tree: any | undefined }) {
  const [search, setSearch] = useState("");
  const [property, setProperty] = useState("name");

  function recursiveFilter(node: any, property: string, value: string): any[] {
    if (node[property].toLowerCase().includes(value.toLowerCase())) {
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

    return recursiveFilter(tree, property, search);
  }, [tree]);

  return { filteredTree, setSearch, setProperty };
}
