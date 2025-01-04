import ChatFallback from "@/components/shared/chat/ChatFallback";
import ChatItemList from "@/components/shared/item-list/ChatItemList";
import React from 'react'

type Props = {}

const contractsPage = (props: Props) => {
  return (
    <>
      <ChatItemList title="Contracts">Contracts</ChatItemList>
      <ChatFallback />
    </>
  );
}

export default contractsPage