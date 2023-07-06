"use client";

import { CardInfo } from "@/components/dashboard/cardInfo";
import { useServiceStats } from "@/services/status";
import { Icons } from "@/components/icons";

export const ActiveConnectionsCard = () => {
  const { activeConnections, isLoading, isValidating } = useServiceStats();
  const getActiveConnectionsContent = () => {
    const formattedActiveConnections =
      activeConnections?.toLocaleString("fr-FR") || "0";

    if (isLoading) {
      return <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />;
    }

    if (isValidating) {
      return (
        <div className="flex flex-row items-center text-gray-500">
          {formattedActiveConnections}
          <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
        </div>
      );
    }

    return `${formattedActiveConnections || 0}`;
  };

  return (
    <CardInfo
      title="Active connections"
      content={getActiveConnectionsContent()}
      icon="plug"
      subContent={`+${((activeConnections || 0) * 1.78).toFixed(
        2
      )}% from last month`}
      loading={isLoading}
      link="/dashboard/settings"
    />
  );
};
