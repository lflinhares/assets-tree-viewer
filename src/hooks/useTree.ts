import { Children, useEffect, useMemo, useState } from "react";
import { useRequest } from "./useRequest";

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
  parentId?: string | null;
  locationId?: string | null;
  sensorType?: string;
  sensorId?: string;
  status?: string;
  gatewayId?: string;
}

export function useTree() {
  const { data: companies, request: requestCompanies } =
    useRequest<Company[]>();

  const { request: requestLocations } = useRequest<Location[]>();

  const { request: requestAssets } = useRequest<Asset[]>();

  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<Record<string, Location[]>>({});
  const [assets, setAssets] = useState<
    Record<string, Record<string, Asset[] | Asset>>
  >({});

  function recursiveLocation(
    locations: Location[],
    location: Location,
    company: Company,
    assets: Record<string, Record<string, Asset[] | Asset>>
  ) {
    return locations.reduce((acc: any, sublocation) => {
      if (sublocation.parentId === location.id) {
        const locationAssets = assets[company.id][sublocation.id];
        const children = recursiveLocation(
          locations,
          sublocation,
          company,
          assets
        );

        acc.push({
          ...sublocation,
          type: "location",
          children: children.length > 0 ? children : locationAssets || [],
        });
      }

      return acc;
    }, []);
  }

  const tree = useMemo(() => {
    if (loading) {
      return;
    }

    if (!companies || !locations || !assets) {
      return [];
    }

    return companies.map((company) => {
      const companyLocations = locations[company.id];

      const tree = companyLocations?.reduce((acc: any, location) => {
        if (!location.parentId) {
          const children = [
            ...recursiveLocation(companyLocations, location, company, assets),
          ];

          acc.push({
            ...location,
            type: "location",

            children:
              children.length > 0
                ? children
                : assets[company.id][location.id] || [],
          });
        }

        return acc;
      }, []);

      return {
        ...company,
        children: [...tree, ...((assets[company.id]["none"] as Asset[]) || [])],
      };
    });
  }, [loading]);

  useEffect(() => {
    requestCompanies("https://fake-api.tractian.com/companies");
  }, []);

  function recursiveAssetsChildren(assets: Asset[], parent: Asset) {
    return assets.reduce((acc: any, asset) => {
      if (asset.id && asset.parentId === parent.id) {
        acc.push({
          ...asset,
          type: asset.sensorType ? "component" : "asset",
          children: recursiveAssetsChildren(assets, asset),
        });
      }
      return acc;
    }, []);
  }

  function organizeAssets(assets: Asset[]): Record<string, Asset[] | Asset> {
    const organizedAssets = assets.reduce((acc: any, asset) => {
      if (asset.sensorType && !asset.parentId && !asset.locationId) {
        if (!acc["none"]) {
          acc["none"] = [];
        }
        acc["none"] = [
          ...acc["none"],
          {
            ...asset,
            type: asset.sensorType ? "component" : "asset",
            children: recursiveAssetsChildren(assets, asset),
          },
        ];
      }

      if (asset.locationId) {
        if (!acc[asset.locationId]) {
          acc[asset.locationId] = [];
        }

        acc[asset.locationId] = [
          ...acc[asset.locationId],
          {
            ...asset,
            type: asset.sensorType ? "component" : "asset",
            children: recursiveAssetsChildren(assets, asset),
          },
        ];
      }
      return acc;
    }, {});

    return organizedAssets;
  }

  useEffect(() => {
    if (companies) {
      setLoading(true);

      Promise.all(
        companies.map(async (company: { id: string; name: string }) => {
          const locations = await requestLocations(
            `https://fake-api.tractian.com/companies/${company.id}/locations`
          );

          setLocations((prev) => ({ ...prev, [company.id]: locations }));

          const assets = await requestAssets(
            `https://fake-api.tractian.com/companies/${company.id}/assets`
          );

          const organizedAssets = organizeAssets(assets);

          setAssets((prev) => ({ ...prev, [company.id]: organizedAssets }));
        })
      ).finally(() => setLoading(false));
    }
  }, [companies]);

  return { tree };
}
