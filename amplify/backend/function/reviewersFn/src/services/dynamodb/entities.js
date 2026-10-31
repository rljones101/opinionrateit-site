/**
 * Single-table design key conventions for the `reviewers-app` table.
 *
 * All entities share one table. The entity type is encoded in the PK/SK
 * prefixes (there is no separate `type` attribute), matching the pattern
 * established by UserService (USER#<id> / PROFILE, GSI1 EMAIL#<email>).
 *
 * Item layouts
 * ------------
 * User        PK=USER#<userId>           SK=PROFILE        GSI1PK=EMAIL#<email>   GSI1SK=USER#<userId>
 * Reviewer    PK=REVIEWER#<channelId>    SK=PROFILE        GSI1PK=REVIEWER        GSI1SK=REVIEWER#<channelId>
 * Video       PK=REVIEWER#<channelId>    SK=VIDEO#<videoId> GSI1PK=VIDEO          GSI1SK=VIDEO#<videoId>
 *
 * Access patterns this supports
 * -----------------------------
 * - Get a reviewer by channelId     -> GetItem PK=REVIEWER#<channelId>, SK=PROFILE
 * - List all reviewers              -> Query GSI1 where GSI1PK=REVIEWER
 * - List a channel's videos         -> Query PK=REVIEWER#<channelId> AND begins_with(SK, 'VIDEO#')
 * - Get a single video by videoId   -> Query GSI1 where GSI1PK=VIDEO AND GSI1SK=VIDEO#<videoId>
 * - List / search all videos        -> Query GSI1 where GSI1PK=VIDEO (filter client-side for search)
 */

const ENTITY = {
  USER: 'USER',
  REVIEWER: 'REVIEWER',
  VIDEO: 'VIDEO'
}

const keys = {
  // --- Reviewer ---
  reviewerPK: (channelId) => `REVIEWER#${channelId}`,
  reviewerSK: () => 'PROFILE',
  reviewerGSI1PK: () => 'REVIEWER',
  reviewerGSI1SK: (channelId) => `REVIEWER#${channelId}`,

  // --- Published video ---
  // Videos are stored under their reviewer's partition so "videos by channel"
  // is a single efficient Query against the base table.
  videoPK: (channelId) => `REVIEWER#${channelId}`,
  videoSK: (videoId) => `VIDEO#${videoId}`,
  videoSKPrefix: () => 'VIDEO#',
  videoGSI1PK: () => 'VIDEO',
  videoGSI1SK: (videoId) => `VIDEO#${videoId}`
}

module.exports = { ENTITY, keys }
