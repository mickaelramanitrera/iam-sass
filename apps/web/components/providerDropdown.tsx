import { FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addProviderFormSchema,
  type providerFormValuesType,
} from "@/formSchemas/providers";

import { Icons } from "@/components/icons";

type ProviderListing = { name: string; id: number };

type Props = {
  providers: ProviderListing[];
  selectedProviderId: number;
  onChange: (id: number) => void;
  onCreateProvider: (newProvider: providerFormValuesType) => Promise<void>;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

export const ProviderDropdown: FC<Props> = ({
  providers,
  selectedProviderId,
  onChange,
  modalOpen,
  setModalOpen,
  onCreateProvider,
}) => {
  const currentProvider =
    providers.find((provider) => provider.id === selectedProviderId) ||
    undefined;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Icons.add className="mr-2 h-4 w-4" />
                <span>Add a new provider</span>
              </DropdownMenuItem>
            </DialogTrigger>
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

      <AddProviderForm onFormSave={onCreateProvider} />
    </Dialog>
  );
};

const AddProviderForm: FC<{
  onFormSave: (val: providerFormValuesType) => Promise<void>;
}> = ({ onFormSave }) => {
  const form = useForm<z.infer<typeof addProviderFormSchema>>({
    resolver: zodResolver(addProviderFormSchema),
    resetOptions: { keepValues: false },
    defaultValues: {
      name: "",
      url: "",
      masterUsername: "",
      masterPassword: "",
      realmName: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (values: providerFormValuesType) => {
    try {
      setIsSubmitting(true);
      await onFormSave(values);
      form.reset();
    } catch (e: unknown) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a new provider</DialogTitle>
        <DialogDescription>
          Plug a keycloak instance and save it as a new provider
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Keycloak Prod environment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://prod.keycloak.acme.com/auth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="realmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Realm Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="mt-4" />
            <FormField
              control={form.control}
              name="masterUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="masterPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
