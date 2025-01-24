"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutationState } from "@/hook/useMutationState";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

const AddContractDialog = () => {
  const addContractFormSchema = z.object({
    email: z
      .string()
      .min(1, { message: "This field can't be empty" })
      .email({ message: "Invalid email address" }),
  });

  const { mutate: createRequest, pending } = useMutationState(
    api.request.create
  );

  const handleSubmit = async (
    values: z.infer<typeof addContractFormSchema>
  ) => {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset();
        toast.success("Add Request sent successfully");
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occurred"
        );
        console.error(err);
      });
  };

  const form = useForm<z.infer<typeof addContractFormSchema>>({
    resolver: zodResolver(addContractFormSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"icon"} variant={"outline"} asChild>
            <DialogTrigger>
              <UserRoundPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Contract</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contract</DialogTitle>
          <DialogDescription>
            Send an invitation to a user to join your contract.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="example@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContractDialog;
