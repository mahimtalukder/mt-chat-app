"use client";
import { Card } from "@/components/ui/card";
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
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import MessageActionPopover from "./MessageActionPopover";
import { useTheme } from "next-themes";
import Emojipicker, {Theme} from "emoji-picker-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "This field cannot be empty" }),
});

function ChatInput() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<any>(null);

  const [ emojiPickerOpen, setEmojiPickerOpen ] = useState(false);
  const {theme} = useTheme();
  const [ cursorPosition, setCursorPosition ] = useState(0);

  const { chatId } = useChat();
  const { mutate: CreateMessage, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { content: "" },
  });

  const content = form.watch("content", "");

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    CreateMessage({
      chatId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
        textAreaRef.current?.focus();
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occurred"
        );
      });
  };

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
      setCursorPosition(selectionStart);
    }
  };

  const insertEmoji = (emoji: string) => {
    const newText = [
      content.substring(0, cursorPosition),
      emoji,
      content.substring(cursorPosition),
    ].join("")

    form.setValue("content", newText);
    setCursorPosition(cursorPosition + emoji.length);
  }
 
  useEffect(() => {
    const handleClickOuside = (event: MouseEvent) => {
      if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOuside);

    return () => {
      document.removeEventListener("mousedown", handleClickOuside);
    }
  },[])

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="absolute bottom-16" ref={emojiPickerRef}>
        <Emojipicker open={emojiPickerOpen} theme={theme as Theme} onEmojiClick={(emojiDetails) => {
          insertEmoji(emojiDetails.emoji)
          setEmojiPickerOpen(false)
          }} lazyLoadEmojis />
      </div>
      <div className="flex gap-2 items-end w-full">
        <MessageActionPopover setEmojiPickerOpen={setEmojiPickerOpen} />
        <Form {...form}>
          <form
            className="flex gap-2 items-end w-full"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={4}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="Type a message..."
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={pending} size={"icon"} type="submit">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}

export default ChatInput;
