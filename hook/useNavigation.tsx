import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BookUser, Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathName = usePathname();
  const requestCount = useQuery(api.requests.count);

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
        count: requestCount,
      },
    ],
    [pathName, requestCount]
  );

  return paths;
};
