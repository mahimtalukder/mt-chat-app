import { BookUser, Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathName = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Chats",
        href: "/chats",
        icon: <Inbox />,
        active: pathName.startsWith("/chats"),
      },
      {
        name: "Contracts",
        href: "/contracts",
        icon: <BookUser />,
        active: pathName === "/contracts",
      },
    ],
    [pathName]
  );

  return paths;
};
