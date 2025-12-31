import { APIError, type BetterAuthPlugin, type User } from "better-auth"
import { checkEmailDomain } from "./check-email-domain.js"

export interface UserWithRole extends User {
  verified?: boolean | undefined
}

type Option = {
  whitelistDomains: string[]
}

export const verifiedPlugin = (option: Option) =>
  ({
    id: "verifiedPlugin",
    schema: {
      user: {
        fields: {
          verified: {
            type: "boolean",
          },
        },
      },
    },
    init: () => {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                before: async (user) => {
                  return {
                    data: {
                      verified: checkEmailDomain(
                        user.email,
                        option.whitelistDomains,
                      ),
                      ...user,
                    } as User,
                  }
                },
              },
            },
            session: {
              create: {
                before: async (session, context) => {
                  if (context == null) {
                    return
                  }
                  const user =
                    (await context.context.internalAdapter.findUserById(
                      session.userId,
                    )) as UserWithRole | null
                  if (user == null || user.verified !== true) {
                    throw new APIError("FORBIDDEN")
                  }
                },
              },
            },
          },
        },
      }
    },
  }) satisfies BetterAuthPlugin
