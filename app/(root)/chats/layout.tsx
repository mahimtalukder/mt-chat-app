"use client";
import ChatItemList from "@/components/shared/item-list/ChatItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMChatItem from "./_components/DMChatItem";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import GroupChatItem from "./_components/GroupChatItem";

type Props = React.PropsWithChildren<{}>;

const chatsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.get);
  return (
    <>
      <ChatItemList title="Chats" action={<CreateGroupDialog />}>
        {chats ? (
          chats.length === 0 ? (
            <p className="h-full w-full flex items-center justify-center">
              No chats found
            </p>
          ) : (
            chats.map((chat) => {
              return chat.chat.isGroup ? (
                <GroupChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  name={chat.chat.name || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSenders={chat.lastMessage?.sender}
                  unseenCount={chat.unseenCount}
                />
              ) : (
                <DMChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  imageurl={chat.otherMembers?.imageurl || ""}
                  username={chat.otherMembers?.username || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSenders={chat.lastMessage?.sender}
                  unseenCount={chat.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ChatItemList>
      {children}
    </>
  );
};

export default chatsLayout;
