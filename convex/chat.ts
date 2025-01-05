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

    const chat = await ctx.db.get(args.id);

    if (!chat) {
      throw new ConvexError("Chat could not be found");
    }

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chat._id)
      )
      .unique();
      

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    const allChatMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .collect();

    if (!chat.isGroup) {
      const otherMemberships = allChatMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];

      const otherMembersDetails = await ctx.db.get(otherMemberships.memberId);

      return {
        ...chat,
        otherMember: {
          ...otherMembersDetails,
          lastSeenMessageId: otherMemberships.lastSeenMessage
        },
        otherMembers: null
      };
    }
  },
});
