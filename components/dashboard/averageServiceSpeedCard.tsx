"use client";

import { CardInfo } from "@/components/dashboard/cardInfo";
import { useServiceStats } from "@/services/status";
import { Icons } from "@/components/icons";

export const AverageServiceSpeedCard = () => {
  const { speed, isLoading, isValidating } = useServiceStats();
  const getServiceSpeedContent = () => {
    if (isLoading) {
      return <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />;
    }

    if (isValidating) {
      return (
        <div className="flex flex-row items-center text-slate-800">
          {speed} cnx/s <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
        </div>
      );
    }

    return `${speed || 0} cnx/s`;
  };

  return (
    <CardInfo
      title="Average service speed"
      content={getServiceSpeedContent()}
      icon="radioTower"
      subContent={`${(speed * 1.78).toFixed(2)}s since last issue`}
      loading={isLoading}
    />
  );
};
