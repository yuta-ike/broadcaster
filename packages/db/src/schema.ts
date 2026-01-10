import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

export const sponsorTable = pgTable("sponsors", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  readableId: text().notNull().unique(),
  slackChannelId: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const sponsorSlackUserTable = pgTable("sponsor_slack_users", {
  slackUserId: text().primaryKey().notNull(),
  sponsorId: uuid()
    .references(() => sponsorTable.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
})

export const sponsorLabelTable = pgTable(
  "sponsor_labels",
  {
    sponsorId: uuid()
      .references(() => sponsorTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    labelId: uuid()
      .references(() => labelTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [unique().on(t.sponsorId, t.labelId)],
)

export const labelTable = pgTable("labels", {
  id: uuid().primaryKey().defaultRandom(),
  label: text().unique().notNull(),
  color: text().notNull(),
  order: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const messageTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  message: text().notNull(),
  addMention: boolean().notNull(),
  scheduledAt: timestamp(),
  sendImmediately: boolean().notNull(),
  sentAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const messageSponsorTable = pgTable(
  "message_sponsors",
  {
    messageId: uuid()
      .references(() => messageTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    sponsorId: uuid()
      .references(() => sponsorTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [unique().on(t.messageId, t.sponsorId)],
)

export const messageLabelTable = pgTable(
  "message_labels",
  {
    messageId: uuid()
      .references(() => messageTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    labelId: uuid()
      .references(() => labelTable.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [unique().on(t.messageId, t.labelId)],
)

// Auth
export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const sessionTable = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const accountTable = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verificationTable = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)
