"use client";
import Uploader from "@/components/shared/Uploader";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useChat } from "@/hook/useChat";
import { useMutationState } from "@/hook/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { Images, Paperclip } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  toggle: (newState: boolean) => void;
  type: "image" | "file";
};

const uploadFileSchema = z.object({
  files: z
    .string()
    .array()
    .min(1, { message: "Please select at least one file" }),
});
const UploadFileDialog = ({ open, toggle, type }: Props) => {
  const form = useForm<z.infer<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      files: [],
    },
  });
  const { chatId } = useChat();

  const files = form.watch("files");

  const { mutate: CreateMessage, pending } = useMutationState(
    api.message.create
  );

  const handleSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
    CreateMessage({
      chatId,
      type,
      content: values.files,
    })
      .then(() => {
        form.reset();
        toggle(false);
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occurred"
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => toggle(open)}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          {type === "image" ? <Images /> : <Paperclip />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="sm:max-w-[425px">
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            {type === "image"
              ? "Upload images or videos"
              : "Upload images, video, audio and PDFs"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="files"
              render={() => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="py-4">
                        <Uploader
                          type={type}
                          onChange={(url) =>
                            form.setValue("files", [...files, ...url])
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button disabled={!files.length || pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
