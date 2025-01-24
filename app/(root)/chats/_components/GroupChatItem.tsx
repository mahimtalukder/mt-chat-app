import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"chats">;
  name?: string;
  lastMessageSenders?: string;
  lastMessageContent?: string;
  unseenCount? : number;
};

function GroupChatItem({
  id,
  name,
  lastMessageSenders,
  lastMessageContent,
  unseenCount,
}: Props) {
  return (
    <Link href={`/chats/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4 truncate justify-between">
        <div className="flex items-center gap-4 truncate">
          <Avatar>
            <AvatarFallback>
              {name?.charAt(0).toUpperCase() || <User />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name || "Group Chat"}</h4>
            {lastMessageSenders && lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">
                  {lastMessageSenders}
                  {":"}&nbsp;
                </p>
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-xs text-muted-foreground truncate">
                Start the chat
              </p>
            )}
          </div>
        </div>
        {unseenCount ? <Badge>{unseenCount}</Badge> : null}
      </Card>
    </Link>
  );
}

export default GroupChatItem;
