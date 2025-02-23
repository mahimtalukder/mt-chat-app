"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { CirclePlus, Smile } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import UploadFileDialog from "../dialogs/UploadFileDialog";

type Props = {
  setEmojiPickerOpen: (value: SetStateAction<boolean>) => void;
};

const MessageActionPopover = ({ setEmojiPickerOpen }: Props) => {
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
  return (
    <Popover>
      <PopoverContent className="w-full mb-1 flex flex-col gap-2">
        <UploadFileDialog
          open={uploadFileDialogOpen}
          toggle={(newState) => {
            setUploadFileDialogOpen(newState);
          }}
          type="file"
        />

        <UploadFileDialog
          open={imageUploadDialogOpen}
          toggle={(newState) => {
            setImageUploadDialogOpen(newState);
          }}
          type="image"
        />
        <PopoverClose asChild>
          <Button
            variant={"outline"}
            onClick={() => {
              setEmojiPickerOpen(true);
            }}
            size={"icon"}
          >
            <Smile />
          </Button>
        </PopoverClose>
      </PopoverContent>
      <PopoverTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <CirclePlus />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};

export default MessageActionPopover;
