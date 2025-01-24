import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useChat = () => {
  const params = useParams();
  const chatId = useMemo(() => {
    return params?.chat_id || ("" as string);
  }, [params?.chat_id]);

  const isActive = useMemo(() => 
    !!chatId
  , [chatId]);

    return { chatId, isActive };
};
