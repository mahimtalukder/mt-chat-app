import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
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

    const contactship = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("user", currentUser._id))
      .collect();
    const usership = await ctx.db
      .query("contacts")
      .withIndex("by_contact", (q) => q.eq("contact", currentUser._id))
      .collect();

    const contactships = [...contactship, ...usership];

    const contacts = await Promise.all(
      contactships.map(async (contactship) => {
        const contact = await ctx.db.get(
          contactship.user === currentUser._id
            ? contactship.contact
            : contactship.user
        );

        if (!contact) {
          throw new ConvexError("Contact not found");
        }

        return contact;
      })
    );

    return contacts;
  },
});

