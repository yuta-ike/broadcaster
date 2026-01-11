import { defineRelations } from "drizzle-orm"
import {
  accountTable,
  labelTable,
  messageLabelTable,
  messageSponsorTable,
  messageTable,
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
    message: messageTable,
    targetSponsor: messageSponsorTable,
    targetLabel: messageLabelTable,
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
    message: {
      targetSponsors: r.many.sponsor({
        from: r.message.id.through(r.targetSponsor.messageId),
        to: r.sponsor.id.through(r.targetSponsor.sponsorId),
      }),
      targetLabels: r.many.label({
        from: r.message.id.through(r.targetLabel.messageId),
        to: r.label.id.through(r.targetLabel.labelId),
      }),
    },
  }),
)
