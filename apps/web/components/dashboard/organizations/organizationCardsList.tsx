import { FC, ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { KeycloakOrganizationObject } from "keycloak-lib";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const OrganizationCardsList: FC<{
  organizations?: KeycloakOrganizationObject[];
  loading?: boolean;
}> = ({ organizations = [], loading = false }) => {
  let cardsList: ReactElement[];
  if (loading) {
    cardsList = Object.keys(new Array(6).fill(6)).map((id) => (
      <OrganizationSheetButtonCard key={id} loading />
    ));
  } else {
    cardsList = organizations.map((org, id) => (
      <OrganizationSheetButtonCard
        key={id}
        title={org.name}
        content={org?.description}
      />
    ));
  }

  return <div className="my-6 grid gap-4 grid-cols-1">{cardsList}</div>;
};

export const OrganizationSheetButtonCard: FC<{
  title?: ReactElement | string;
  content?: ReactElement | string;
  loading?: boolean;
}> = ({ title, content, loading }) => {
  if (loading) {
    return (
      <Card className="hover:-translate-y-1 transition ease-in-out hover:bg-accent backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-5 w-[250px]" />
          </CardTitle>
          <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[150px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card
          className="hover:-translate-y-1 transition ease-in-out hover:bg-accent backdrop-blur"
          role="button"
          data-testid={"organization-sheet-button-card"}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{title || "(no title)"}</CardTitle>
            <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {content || <span className="italic">(no description)</span>}
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Organization Details</SheetTitle>
          <SheetDescription>(coming soon...)</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p>(coming soon...)</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
