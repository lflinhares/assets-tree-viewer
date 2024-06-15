export interface Company {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Asset {
  id: string;
  name: string;
  parentId: string | null;
  locationId?: string | null;
  sensorType?: string;
  sensorId?: string;
  status?: string;
  gatewayId?: string;
}

export type AssetsDictionary = Record<string, Record<string, TreeAsset[]>>;

export type TreeAsset = Asset & {
  type: "asset" | "component";
  children: TreeAsset[];
};

export type TreeLocation = Location & {
  type: "location";
  children: TreeLocation[] | TreeAsset[];
};

export type TreeCompany = Company & { children: (TreeLocation | TreeAsset)[] };
