import ChatItemList from '@/components/shared/item-list/ChatItemList'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const chatsLayout = ({children}: Props) => {
  return (
    <>
      <ChatItemList title="Chats"></ChatItemList>
      {children}
    </>
  );
}

export default chatsLayout