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
import type { providerFormValuesType } from "@/formSchemas/providers";
import { useProviderConnect } from "@/services/providers";

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

type Props = { onLogout: () => void; logoutPending?: boolean };

export const Header: FC<Props> = ({ onLogout, logoutPending }) => {
  const { setTheme } = useTheme();
  const {
    currentProvider = 1,
    setProvider,
    providers,
    addProvider,
  } = useContext(ProviderContext);
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { trigger } = useProviderConnect();

  const handleChangeProvider = (id: number) => {
    if (currentProvider !== id) {
      setProvider(id);
      toast({ title: "New provider selected !" });
    }
  };

  const handleCreateProvider = async ({
    masterUsername: username,
    masterPassword: pwd,
    url,
    name,
  }: providerFormValuesType) => {
    const connectionResults = await trigger({
      username,
      pwd,
      url,
    });

    if (connectionResults?.error) {
      toast({
        title: "Adding provider errored",
        variant: "destructive",
        description: connectionResults.error,
      });
      return;
    }

    const newProviderId = providers.length + 1;
    addProvider({
      id: newProviderId,
      name,
      token: connectionResults?.access_token,
      url,
      username,
      pwd,
    });
    handleChangeProvider(newProviderId);

    setModalOpen(false);
  };

  return (
    <header className="border-y border-slate-300 fixed w-full h-[100px] backdrop-blur">
      <div className="container flex h-full items-center justify-between">
        <div className="w-[50px] h-[50px] relative">
          <Image
            src="/logo.png"
            alt="sass_logo"
            fill
            priority
            className="dark:grayscale"
          />
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
          <Button
            className="hidden md:block"
            variant="ghost"
            onClick={onLogout}
            disabled={logoutPending}
          >
            {logoutPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
};
