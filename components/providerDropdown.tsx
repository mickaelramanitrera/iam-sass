import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

type ProviderListing = { name: string; id: number };

type Props = {
  providers: ProviderListing[];
  selectedProviderId: number;
  onChange: (id: number) => void;
};

export const ProviderDropdown: FC<Props> = ({
  providers,
  selectedProviderId,
  onChange,
}) => {
  const currentProvider =
    providers.find((provider) => provider.id === selectedProviderId) ||
    undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="font-medium">Provider </span>
          <Icons.chevronRight className="w-3 h-3 mx-2" />
          <span>{currentProvider?.name}</span>
          <span>
            <Icons.chevronDown className="w-4 h-4 ml-2" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.add className="mr-2 h-4 w-4" />
            <span>Add a new provider</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Available providers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {providers.map((provider, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => {
                onChange(provider.id);
              }}
            >
              {provider.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
