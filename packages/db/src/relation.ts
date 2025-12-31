import { defineRelations } from "drizzle-orm"
import {
  accountTable,
  labelTable,
  sessionTable,
  sponsorLabelTable,
  sponsorSlackUserTable,
  sponsorTable,
  userTable,
  verificationTable,
} from "./schema.js"

export const relations = defineRelations(
  {
    sponsor: sponsorTable,
    slackUser: sponsorSlackUserTable,
    sponsorLabel: sponsorLabelTable,
    label: labelTable,
    user: userTable,
    session: sessionTable,
    account: accountTable,
    verification: verificationTable,
  },
  (r) => ({
    sponsor: {
      slackUsers: r.many.slackUser({
        from: r.sponsor.id,
        to: r.slackUser.sponsorId,
      }),
      labels: r.many.label({
        from: r.sponsor.id.through(r.sponsorLabel.sponsorId),
        to: r.label.id.through(r.sponsorLabel.labelId),
      }),
    },
  }),
)
