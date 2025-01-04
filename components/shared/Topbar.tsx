import React from 'react'
import { Card } from '../ui/card'
import Image from "next/image";
type Props = {
    size?: number;
    title?: string;
}

const Topbar = ({ size = 50, title }: Props) => {
  return (
    <Card className="flex justify-start items-center w-full p-4">
      <Image
        src="/logo.svg"
        alt="Loading..."
        width={size}
        height={size}
        className="w-auto h-auto"
      />
      <h1 className="text-4xl font-extrabold tracking-tight ml-2">{title}</h1>
    </Card>
  );
};

export default Topbar