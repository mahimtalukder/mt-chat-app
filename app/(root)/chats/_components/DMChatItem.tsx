import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel'
import { AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

type Props = {
  id: Id<"chats">;
  imageurl?: string;
  username?: string;
};

function DMChatItem({ id, imageurl, username }: Props) {
  return (
    <Link href={`/chats/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4 truncate">
        <div className="flex items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={imageurl} alt={username} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{username}</h4>
            <p className="text-xs text-muted-foreground truncate">Start the chat</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default DMChatItem