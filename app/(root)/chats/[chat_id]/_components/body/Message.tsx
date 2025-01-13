import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  fromCurentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  seen?: React.ReactNode;
  type: string;
};

function Message({
  fromCurentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  seen,
  type,
}: Props) {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:MM");
  };
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurentUser,
          "order-2 items-start": !fromCurentUser,
        })}
      >
        <div className={cn("px-4 py-2 rounded-lg max-w-[70%]",{
            "bg-primary text-primary-foreground": fromCurentUser,
            "bg-secondary text-secondary-foreground": !fromCurentUser,
            "rounded-br-none": !lastByUser && fromCurentUser,
            "rounded-bl-none": !lastByUser && !fromCurentUser,
        })}>
            {type === "text" ? <p className="text-wrap break-words whitespace-pre-wrap break-all">{content}</p> : null}
            <p className={cn("text-xs w-full my-1",{
                "text-primary-foreground justify-end": fromCurentUser,
                "text-secondary-foreground justify-start": !fromCurentUser,
            })}>{formatTime(createdAt)}</p>
        </div>
        {seen}
      </div>
      <Avatar className={cn("relative w-8 h-8",{
        "order-2": fromCurentUser,
        "order-1": !fromCurentUser,
        "invisible": lastByUser
      })}>
        <AvatarImage src={senderImage} />
        <AvatarFallback>
            {senderName.substring(0,1)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export default Message;
