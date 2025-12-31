// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_AuthedChannelChannelIndex_getConfig } from './pages/(authed)/channel/[channel]/index';
// prettier-ignore
import type { getConfig as File_AuthedLabelsLabelIdDelete_getConfig } from './pages/(authed)/labels/[labelId]/delete';
// prettier-ignore
import type { getConfig as File_AuthedLabelsLabelIdEdit_getConfig } from './pages/(authed)/labels/[labelId]/edit';
// prettier-ignore
import type { getConfig as File_AuthedLabelsAssign_getConfig } from './pages/(authed)/labels/assign';
// prettier-ignore
import type { getConfig as File_AuthedLabelsIndex_getConfig } from './pages/(authed)/labels/index';
// prettier-ignore
import type { getConfig as File_AuthedMessageSend_getConfig } from './pages/(authed)/message/send';
// prettier-ignore
import type { getConfig as File_AuthedSponsorsSponsorIdDelete_getConfig } from './pages/(authed)/sponsors/[sponsorId]/delete';
// prettier-ignore
import type { getConfig as File_AuthedSponsorsSponsorIdEdit_getConfig } from './pages/(authed)/sponsors/[sponsorId]/edit';
// prettier-ignore
import type { getConfig as File_AuthedSponsorsIndex_getConfig } from './pages/(authed)/sponsors/index';
// prettier-ignore
import type { getConfig as File_AuthedSponsorsNew_getConfig } from './pages/(authed)/sponsors/new';

// prettier-ignore
type Page =
| ({ path: '/channel/[channel]' } & GetConfigResponse<typeof File_AuthedChannelChannelIndex_getConfig>)
| ({ path: '/labels/[labelId]/delete' } & GetConfigResponse<typeof File_AuthedLabelsLabelIdDelete_getConfig>)
| ({ path: '/labels/[labelId]/edit' } & GetConfigResponse<typeof File_AuthedLabelsLabelIdEdit_getConfig>)
| ({ path: '/labels/assign' } & GetConfigResponse<typeof File_AuthedLabelsAssign_getConfig>)
| ({ path: '/labels' } & GetConfigResponse<typeof File_AuthedLabelsIndex_getConfig>)
| { path: '/labels/new'; render: 'dynamic' }
| ({ path: '/message/send' } & GetConfigResponse<typeof File_AuthedMessageSend_getConfig>)
| { path: '/signout'; render: 'dynamic' }
| ({ path: '/sponsors/[sponsorId]/delete' } & GetConfigResponse<typeof File_AuthedSponsorsSponsorIdDelete_getConfig>)
| ({ path: '/sponsors/[sponsorId]/edit' } & GetConfigResponse<typeof File_AuthedSponsorsSponsorIdEdit_getConfig>)
| ({ path: '/sponsors' } & GetConfigResponse<typeof File_AuthedSponsorsIndex_getConfig>)
| ({ path: '/sponsors/new' } & GetConfigResponse<typeof File_AuthedSponsorsNew_getConfig>)
| { path: '/'; render: 'dynamic' }
| { path: '/signin'; render: 'dynamic' };

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
