import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Table
  users: defineTable({
    username: v.string(),
    imageurl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  // Request Table (User to User)
  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),

  // Contacts Table
  contacts: defineTable({
    user: v.id("users"),
    contact: v.id("users"),
    chatId: v.id("chats"),
  })
    .index("by_user", ["user"])
    .index("by_contact", ["contact"])
    .index("by_chatid", ["chatId"]),
  
  // Chat Table
  chats: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages"))
  }),

  //Chat mambers
  chatMembers: defineTable({
    memberId: v.id("users"),
    chatId: v.id("chats"),
    lastSeenMessage: v.optional(v.id("messages")),
  }).index("by_memberId", ["memberId"]).index("by_chatId", ["chatId"]).index("by_memberId_chatId", ["memberId", "chatId"]),

  // Message Table
  messages: defineTable({
    senderId: v.id("users"),
    chatId: v.id("chats"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_chatId", ["chatId"]),
});
