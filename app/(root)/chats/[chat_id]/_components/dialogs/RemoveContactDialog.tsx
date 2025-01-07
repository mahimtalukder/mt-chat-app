"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hook/useMutationState";
import { ConvexError } from "convex/values";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  chatId: Id<"chats">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const RemoveContactDialog = ({ chatId, open, setOpen }: Props) => {
    const {mutate: RemoveContact, pending} = useMutationState(api.contact.remove);

    const handleRemove = async () => {
        await RemoveContact({ chatId }).then(() =>{
            toast.success("Contact removed successfully");
        }).catch((err) => {
            toast.error(err instanceof ConvexError? err.data : "Unexpected error occurred");
        })
    };
  return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this contact?</AlertDialogTitle>
            <AlertDialogDescription> 
                This action cannot be undone. All messages will be lost and also this contact will be removed. All group chat will still work as normal.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={handleRemove}>
                Remove
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default RemoveContactDialog;
