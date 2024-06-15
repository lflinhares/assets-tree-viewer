import { Children, useEffect, useMemo, useState } from "react";
import { useRequest } from "./useRequest";
import {
  Asset,
  Company,
  Location,
  AssetsDictionary,
  TreeAsset,
  TreeLocation,
  TreeCompany,
} from "../types";

export function useTree({ companies }: { companies: Company[] | undefined }) {
  const { request: requestLocations } = useRequest<Location[]>();

  const { request: requestAssets } = useRequest<Asset[]>();

  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<Record<string, Location[]>>({});
  const [assets, setAssets] = useState<AssetsDictionary>({});

  function recursiveLocationChildren(
    locations: Location[],
    location: Location,
    company: Company,
    assets: AssetsDictionary
  ) {
    return locations.reduce((acc: TreeLocation[], sublocation) => {
      if (sublocation.parentId === location.id) {
        const locationAssets = assets[company.id][sublocation.id];
        const children = recursiveLocationChildren(
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

  const tree = useMemo((): Record<string, TreeCompany> | undefined => {
    if (loading) {
      return;
    }

    if (!companies || !locations || !assets) {
      return;
    }

    return companies.reduce(
      (
        acc: Record<string, TreeCompany>,
        company: Company
      ): Record<string, TreeCompany> => {
        const companyLocations = locations[company.id];

        const tree = companyLocations?.reduce(
          (acc: (TreeAsset | TreeLocation)[], location) => {
            if (!location.parentId) {
              const children = [
                ...recursiveLocationChildren(
                  companyLocations,
                  location,
                  company,
                  assets
                ),
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
          },
          []
        );

        acc[company.id] = {
          ...company,
          children: [...tree, ...(assets[company.id]["none"] || [])],
        };

        return acc;
      },
      {}
    );
  }, [loading]);

  function recursiveAssetsChildren(assets: Asset[], parent: Asset) {
    return assets.reduce((acc: TreeAsset[], asset) => {
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

  function organizeAssets(assets: Asset[]): Record<string, TreeAsset[]> {
    const organizedAssets = assets.reduce(
      (acc: Record<string, TreeAsset[]>, asset) => {
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
      },
      {}
    );

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
