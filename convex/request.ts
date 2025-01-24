import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthenticated");
    }

    if (args.email === identity.email) {
      throw new ConvexError("Cannot send request to yourself");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("Receiver not found");
    }

    const requestAlreadySend = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (requestAlreadySend) {
      throw new ConvexError("Request alrady sent");
    }

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError("This user has already sent you a request");
    }

    const addedAsUser = await ctx.db.query("contacts").withIndex("by_user", (q) => q.eq("user", currentUser._id)).collect();
    const addedAsContact = await ctx.db.query("contacts").withIndex("by_contact", (q) => q.eq("contact", currentUser._id)).collect();

    // Check if the user is already in the contacts
    if (
      addedAsUser.some((user) => user.contact === receiver._id) ||
      addedAsContact.some((contact) => contact.user === receiver._id)
    ) {
      throw new ConvexError("This user is already in your contacts");
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const deny = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("There was an error to process this request");
    }

    await ctx.db.delete(args.id);
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("There was an error to process this request");
    }

    //create caht id
    const chatId = await ctx.db.insert("chats", {
      isGroup: false,
    });

    //add to contracts
    await ctx.db.insert("contacts", {
      user: currentUser._id,
      contact: request.sender,
      chatId,
    });

    //Add to the cahtMembers
    await ctx.db.insert("chatMembers", {
      memberId: currentUser._id,
      chatId,
    })
    await ctx.db.insert("chatMembers", {
      memberId: request.sender,
      chatId,
    })

    //delete the request
    await ctx.db.delete(args.id);
  },
})
