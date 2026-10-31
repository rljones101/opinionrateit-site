/**
 * Single-table design key conventions for the `reviewers-app` table.
 *
 * All entities share one table. The entity type is encoded in the PK/SK
 * prefixes (there is no separate `type` attribute), matching the pattern
 * established by UserService (USER#<id> / PROFILE, GSI1 EMAIL#<email>).
 *
 * Item layouts
 * ------------
 * User        PK=USER#<userId>           SK=PROFILE          GSI1PK=EMAIL#<email>    GSI1SK=USER#<userId>
 * Reviewer    PK=REVIEWER#<channelId>    SK=PROFILE          GSI1PK=REVIEWER         GSI1SK=REVIEWER#<channelId>
 * Video       PK=REVIEWER#<channelId>    SK=VIDEO#<videoId>  GSI1PK=VIDEO            GSI1SK=VIDEO#<videoId>
 * Review      PK=VIDEO#<videoId>         SK=REVIEW#<reviewId> GSI1PK=CHANNEL#<channelId> GSI1SK=REVIEW#<reviewId>
 *
 * Access patterns this supports
 * -----------------------------
 * - Get a reviewer by channelId     -> GetItem PK=REVIEWER#<channelId>, SK=PROFILE
 * - List all reviewers              -> Query GSI1 where GSI1PK=REVIEWER
 * - List a channel's videos         -> Query PK=REVIEWER#<channelId> AND begins_with(SK, 'VIDEO#')
 * - Get a single video by videoId   -> Query GSI1 where GSI1PK=VIDEO AND GSI1SK=VIDEO#<videoId>
 * - List / search all videos        -> Query GSI1 where GSI1PK=VIDEO (filter client-side for search)
 * - List a video's reviews          -> Query PK=VIDEO#<videoId> AND begins_with(SK, 'REVIEW#')
 * - Count a channel's reviews        -> Query GSI1 where GSI1PK=CHANNEL#<channelId>
 */

const ENTITY = {
  USER: 'USER',
  REVIEWER: 'REVIEWER',
  VIDEO: 'VIDEO',
  REVIEW: 'REVIEW'
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
  videoGSI1SK: (videoId) => `VIDEO#${videoId}`,

  // --- Review ---
  // Reviews live under their video's partition so "reviews by video" is a
  // single Query, and are indexed on GSI1 by channel for channel-wide counts.
  reviewPK: (videoId) => `VIDEO#${videoId}`,
  reviewSK: (reviewId) => `REVIEW#${reviewId}`,
  reviewSKPrefix: () => 'REVIEW#',
  reviewGSI1PK: (channelId) => `CHANNEL#${channelId}`,
  reviewGSI1SK: (reviewId) => `REVIEW#${reviewId}`
}

module.exports = { ENTITY, keys }
