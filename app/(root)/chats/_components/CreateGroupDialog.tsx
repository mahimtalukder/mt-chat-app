"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hook/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { CirclePlusIcon, Contact, X } from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  members: z
    .string()
    .array()
    .min(1, { message: "Please select at least one group member" }),
});

const CreateGroupDialog = () => {
  const contracts = useQuery(api.contacts.get);

  const { mutate: CreateGroup, pending } = useMutationState(
    api.chat.createGroup
  );

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);

  const unselectedContracts = useMemo(() => {
    return contracts
      ? contracts.filter((contact) => !members.includes(contact._id))
      : [];
  }, [members.length, contracts?.length]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    await CreateGroup({
      members: values.members,
      name: values.name,
    })
      .then(() => {
        form.reset();
        toast.success("Group created successfully");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"icon"} variant={"outline"} asChild>
            <DialogTrigger>
              <CirclePlusIcon />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="block">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Add your contracts to create a new group!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Name...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>Contracts</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={unselectedContracts.length === 0}
                        >
                          <Button className="w-full" variant="outline">
                            Select
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {unselectedContracts.map((contact) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={contact._id}
                                className="flex items-center gap-2 w-full p-2"
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    form.setValue("members", [
                                      ...members,
                                      contact._id,
                                    ]);
                                  }
                                }}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={contact.imageurl}
                                    alt={contact.username}
                                  />
                                  <AvatarFallback>
                                    {contact.username.substring(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                                <h4 className="truncate">{contact.username}</h4>
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {members && members.length ? (
              <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                {contracts
                  ?.filter((contact) => members.includes(contact._id))
                  .map((contact) => {
                    return (
                      <div
                        key={contact._id}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={contact.imageurl}
                              alt={contact.username}
                            />
                            <AvatarFallback>
                              {contact.username.substring(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <X
                            className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                            onClick={() => {
                              form.setValue(
                                "members",
                                members.filter((id) => id !== contact._id)
                              );
                            }}
                          />
                        </div>
                        <p className="truncate text-sm">
                          {contact.username.split(" ")[0]}
                        </p>
                      </div>
                    );
                  })}
              </Card>
            ) : null}
            <DialogFooter>
              <Button disabled={pending} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
