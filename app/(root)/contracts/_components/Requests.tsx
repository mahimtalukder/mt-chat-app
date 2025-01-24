import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hook/useMutationState";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ConvexError } from "convex/values";
import { Check, User, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
};

const Requests = ({ id, imageUrl, username, email }: Props) => {
  // Deny request
  const { mutate: denyRequest, pending: isDenying } = useMutationState(
    api.request.deny
  );

  // Accept request
  const { mutate: acceptRequest, pending: isAccepting } = useMutationState(
    api.request.accept
  );
  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imageUrl} alt={username} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          disabled={isDenying || isAccepting}
          onClick={() => {
            acceptRequest({ id })
              .then(() => {
                toast.success("Contact added successfully!");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Unexpected error occurred"
                );
              });
          }}
        >
          <Check />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          disabled={isDenying || isAccepting}
          onClick={() => {
            denyRequest({ id })
              .then(() => {
                toast.success("Request denied successfully");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Unexpected error occurred"
                );
              });
          }}
          variant={"destructive"}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Requests;
