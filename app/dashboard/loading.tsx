import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardLoading = () => (
  <Container>
    <Skeleton className="w-[150px] h-[36px]" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(9)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="w-full h-[20px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Skeleton className="w-full h-[32px]" />
            </div>
            <p className="text-xs text-muted-foreground">
              <Skeleton className="w-full h-[32px] mt-2" />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </Container>
);

export default DashboardLoading;
