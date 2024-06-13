import React, { createContext, useEffect, useState } from "react";
import { useTree } from "../hooks/useTree";
import { useRequest } from "../hooks/useRequest";
import { Company } from "../types";

interface UnitContextState {
  units: Company[] | undefined;
  unit: Company;
  setUnit: (unit: Company) => void;
  tree: any;
}

export const UnitContext = createContext<UnitContextState>({
  units: [],
  unit: {} as Company,
  setUnit: () => {},
  tree: [],
});

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState({} as Company);
  const { data: companies, request: requestCompanies } =
    useRequest<Company[]>();
  const { tree } = useTree({ companies });

  useEffect(() => {
    requestCompanies("https://fake-api.tractian.com/companies");
  }, []);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setUnit(companies[0]);
    }
  }, [companies]);

  return (
    <UnitContext.Provider value={{ units: companies, unit, setUnit, tree }}>
      {children}
    </UnitContext.Provider>
  );
}
