"use client";

import { CardInfo } from "@/components/dashboard/cardInfo";
import { useResources } from "@/services/resources";
import { Icons } from "@/components/icons";

export const ResourcesCard = () => {
  const { totalResources, isLoading, isValidating } = useResources();
  const getResourcesContent = () => {
    const formattedResourcesNumber =
      totalResources?.toLocaleString("fr-FR") || "0";

    if (isLoading) {
      return <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />;
    }

    if (isValidating) {
      return (
        <div className="flex flex-row items-center text-gray-500">
          {formattedResourcesNumber}
          <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
        </div>
      );
    }

    return `${formattedResourcesNumber || 0}`;
  };

  return (
    <CardInfo
      title="Total resources"
      content={getResourcesContent()}
      icon="boxes"
      subContent={`+${((totalResources || 0) * 9.78).toFixed(
        2
      )}% from last month`}
      loading={isLoading}
      link={undefined}
    />
  );
};
