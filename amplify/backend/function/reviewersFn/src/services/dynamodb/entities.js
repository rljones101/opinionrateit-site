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
  reviewGSI1SK: (reviewId) => `REVIEW#${reviewId}`,

  // --- Per-user entities (all under the user's partition) ---
  // Bookmark: one per (user, video). Deterministic SK enforces uniqueness.
  bookmarkPK: (userId) => `USER#${userId}`,
  bookmarkSK: (videoId) => `BOOKMARK#${videoId}`,
  bookmarkSKPrefix: () => 'BOOKMARK#',

  // Watch history: one per (user, video).
  watchPK: (userId) => `USER#${userId}`,
  watchSK: (videoId) => `WATCH#${videoId}`,
  watchSKPrefix: () => 'WATCH#',

  // Preferences: a single item per user.
  preferencesPK: (userId) => `USER#${userId}`,
  preferencesSK: () => 'PREFERENCES',

  // Activity: many per user, time-ordered via a timestamp in the SK.
  activityPK: (userId) => `USER#${userId}`,
  activitySK: (timestamp, activityId) => `ACTIVITY#${timestamp}#${activityId}`,
  activitySKPrefix: () => 'ACTIVITY#',

  // --- Review interactions ---
  // Likes live under the review's partition; deterministic SK per user
  // enforces one-like-per-user (replaces the Mongo unique compound index).
  likePK: (reviewId) => `REVIEWLIKE#${reviewId}`,
  likeSK: (userId) => `USER#${userId}`,
  likeSKPrefix: () => 'USER#',

  // Replies live under the review's partition, time-ordered.
  replyPK: (reviewId) => `REVIEWREPLY#${reviewId}`,
  replySK: (timestamp, replyId) => `REPLY#${timestamp}#${replyId}`,
  replySKPrefix: () => 'REPLY#'
}

module.exports = { ENTITY, keys }
