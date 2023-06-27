import { FC, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { ProviderDropdown } from "@/components/providerDropdown";
import { ProviderContext } from "@/components/contexts/providerContexts";
import { useToast } from "@/components/ui/use-toast";
import type { providerFormValuesType } from "../formSchemas/providers";

type ThemeSwitchDropDownProps = {
  setTheme: (theme: string) => void;
};

const ThemeSwitchDropdown: FC<ThemeSwitchDropDownProps> = ({ setTheme }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon">
        <Icons.moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <Icons.sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme("light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

type Provider = { name: string; id: number };

type Props = { onLogout: () => void; logoutPending?: boolean };

export const Header: FC<Props> = ({ onLogout, logoutPending }) => {
  const { setTheme } = useTheme();
  const [providers, setProviders] = useState<Provider[]>([
    {
      name: "Keycloak Staging",
      id: 1,
    },
    { name: "Keycloak Production", id: 2 },
    { name: "Keycloak Local", id: 3 },
  ]);
  const { currentProvider = 1, setProvider } = useContext(ProviderContext);
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleChangeProvider = (id: number) => {
    if (currentProvider !== id) {
      setProvider(id);
      toast({ title: "New provider selected !" });
    }
  };

  const handleCreateProvider = (value: providerFormValuesType) => {
    setModalOpen(false);
    const newProviderId = providers.length + 1;
    setProviders([...providers, { name: value.name, id: newProviderId }]);
    handleChangeProvider(newProviderId);
  };

  return (
    <header className="border-y border-slate-300 fixed w-full h-[100px] backdrop-blur">
      <div className="container flex h-full items-center justify-between">
        <div className="w-[50px] h-[50px] relative">
          <Image src="/logo.png" alt="sass_logo" fill priority />
        </div>
        <div className="flex gap-x-2">
          <ProviderDropdown
            providers={providers}
            selectedProviderId={currentProvider}
            onChange={handleChangeProvider}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onCreateProvider={handleCreateProvider}
          />
          <ThemeSwitchDropdown setTheme={setTheme} />
          <Button variant="ghost" onClick={onLogout} disabled={logoutPending}>
            {logoutPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
};
