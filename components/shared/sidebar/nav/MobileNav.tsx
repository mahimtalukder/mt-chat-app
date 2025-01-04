"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemaToggleButton } from "@/components/ui/theme-toggle-button";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useChat } from "@/hook/useChat";
import { useNavigation } from "@/hook/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import Link from "next/link";

const MobileNav = () => {
  const { isActive } = useChat();
  const path = useNavigation();

  if (isActive) {
    return null;
  }

  return (
    <Card className="fixed bottom-2 left-0 right-0 mx-auto max-w-screen-lg w-full flex items-center h-16 lg:hidden shadow-lg">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {path.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        size="icon"
                        variant={path.active ? "default" : "outline"}
                      >
                        {path.icon}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ThemaToggleButton />
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
