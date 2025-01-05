import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .order("desc")
      .collect();

    const messagesWithUser = await Promise.all(
      messages.map(async (message) => {
        const messageSender = await ctx.db.get(message.senderId);
        if (!messageSender) {
          throw new ConvexError("Message sender could not be found");
        }

        return {
          message,
          senderImage: messageSender.imageurl,
          sendarName: messageSender.username,
          isCurrentUser: messageSender._id === currentUser._id,
        };
      })
    );

    return messagesWithUser;
  },
});
