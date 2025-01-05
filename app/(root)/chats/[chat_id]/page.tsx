"use client";

import ChatContainer from "@/components/shared/chat/ChatContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";

type Props = {
  params: Promise<{ chat_id: Id<"chats"> }>; // params is a Promise
};

function ChatPage({ params }: Props) {
  const { chat_id } = React.use(params);

  const chat = useQuery(api.chat.get, { id: chat_id });

  return chat === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : chat === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Chat not found
    </p>
  ) : (
    <>
      <ChatContainer>
        <Header
          imageUrl={chat.isGroup ? undefined : chat.otherMember.imageurl || ""}
          name={chat.isGroup ? chat.name : chat.otherMember.username || ""}
        />
        <Body />
        <ChatInput />
      </ChatContainer>
    </>
  );
}

export default ChatPage;
