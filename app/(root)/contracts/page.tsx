"use client";
import ChatFallback from "@/components/shared/chat/ChatFallback";
import ChatItemList from "@/components/shared/item-list/ChatItemList";
import React from "react";
import AddContractDialog from "./_components/AddContractDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Requests from "./_components/Requests";

type Props = {};

const contractsPage = (props: Props) => {
  const requests = useQuery(api.requests.get);
  return (
    <>
      <ChatItemList title="Contracts" action={<AddContractDialog />}>
        {requests ? (
          requests.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No contracts are found
            </p>
          ) : (
            requests.map((request) => {
              return (
                <Requests
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageurl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ChatItemList>
      <ChatFallback />
    </>
  );
};

export default contractsPage;
