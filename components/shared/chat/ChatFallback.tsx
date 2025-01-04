import { Card } from '@/components/ui/card'
import React from 'react'


const ChatFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
        Select/start a chat to getting started!
    </Card>
  )
}

export default ChatFallback