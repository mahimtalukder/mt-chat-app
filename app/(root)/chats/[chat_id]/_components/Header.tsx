import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";;
import { CircleArrowLeft, User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name?: string;
};

const Header = ({ imageUrl, name }: Props) => {
  return (
    <Card className="w-full flex flex-row rounded-lg items-center p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href={"/chats"} className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="h-8 w-8">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>
            {name?.substring(0, 1) || <User />}
          </AvatarFallback>
        </Avatar>
        <h2>{name}</h2>
      </div>
    </Card>
  );
};

export default Header;
