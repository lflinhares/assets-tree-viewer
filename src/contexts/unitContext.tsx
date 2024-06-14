import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useTree } from "../hooks/useTree";
import { useRequest } from "../hooks/useRequest";
import { Company } from "../types";
import { useSearch } from "../hooks/useSearch";

interface UnitContextState {
  units: Company[] | undefined;
  unit: Company;
  setUnit: (unit: Company) => void;
  tree: any;
  setProperty: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  property: string;
  search: string;
}

export const UnitContext = createContext<UnitContextState>({
  units: [],
  unit: {} as Company,
  setUnit: () => {},
  tree: [],
  setProperty: () => {},
  property: "",
  setSearch: () => {},
  search: "",
});

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState({} as Company);
  const { data: companies, request: requestCompanies } =
    useRequest<Company[]>();
  const { tree } = useTree({ companies });
  const { filteredTree, property, setProperty, search, setSearch } = useSearch({
    tree: tree?.[unit.id],
  });

  useEffect(() => {
    requestCompanies("https://fake-api.tractian.com/companies");
  }, []);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setUnit(companies[0]);
    }
  }, [companies]);

  return (
    <UnitContext.Provider
      value={{
        units: companies,
        unit,
        setUnit,
        search,
        tree: filteredTree,
        setProperty,
        setSearch,
        property,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}
