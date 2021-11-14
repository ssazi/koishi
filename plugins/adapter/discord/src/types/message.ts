import { Application, Channel, ChannelType, Component, GuildMember, integer, Internal, MessageInteraction, Reaction, snowflake, Sticker, StickerItem, timestamp, User } from '.'

/** https://discord.com/developers/docs/resources/channel#message-object-message-structure */
export interface Message {
  /** id of the message */
  id: snowflake
  /** id of the channel the message was sent in */
  channel_id: snowflake
  /** id of the guild the message was sent in */
  guild_id?: snowflake
  /** the author of this message (not guaranteed to be a valid user, see below) */
  author: User
  /** member properties for this message's author */
  member?: Partial<GuildMember>
  /** contents of the message */
  content: string
  /** when this message was sent */
  timestamp: timestamp
  /** when this message was edited (or null if never) */
  edited_timestamp?: timestamp
  /** whether this was a TTS message */
  tts: boolean
  /** whether this message mentions everyone */
  mention_everyone: boolean
  /** users specifically mentioned in the message */
  mentions: User[]
  /** roles specifically mentioned in this message */
  mention_roles: snowflake[]
  /** channels specifically mentioned in this message */
  mention_channels?: ChannelMention[]
  /** any attached files */
  attachments: Attachment[]
  /** any embedded content */
  embeds: Embed[]
  /** reactions to the message */
  reactions?: Reaction[]
  /** used for validating a message was sent */
  nonce?: integer | string
  /** whether this message is pinned */
  pinned: boolean
  /** if the message is generated by a webhook, this is the webhook's id */
  webhook_id?: snowflake
  /** type of message */
  type: integer
  /** sent with Rich Presence-related chat embeds */
  activity?: MessageActivity
  /** sent with Rich Presence-related chat embeds */
  application?: Partial<Application>
  /** if the message is a response to an Interaction, this is the id of the interaction's application */
  application_id?: snowflake
  /** data showing the source of a crosspost, channel follow add, pin, or reply message */
  message_reference?: MessageReference
  /** message flags combined as a bitfield */
  flags?: integer
  /** the message associated with the message_reference */
  referenced_message?: Message
  /** sent if the message is a response to an Interaction */
  interaction?: MessageInteraction
  /** the thread that was started from this message, includes thread member object */
  thread?: Channel
  /** sent if the message contains components like buttons, action rows, or other interactive components */
  components?: Component[]
  /** sent if the message contains stickers */
  sticker_items?: StickerItem[]
  /** Deprecated the stickers sent with the message */
  stickers?: Sticker[]
}

/** https://discord.com/developers/docs/resources/channel#message-object-message-types */
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
}

/** https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
export interface MessageActivity {
  /** type of message activity */
  type: integer
  /** party_id from a Rich Presence event */
  party_id?: string
}

/** https://discord.com/developers/docs/resources/channel#message-object-message-activity-types */
export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}

/** https://discord.com/developers/docs/resources/channel#message-object-message-flags */
export enum MessageFlag {
  /** this message has been published to subscribed channels (via Channel Following) */
  CROSSPOSTED = 1 << 0,
  /** this message originated from a message in another channel (via Channel Following) */
  IS_CROSSPOST = 1 << 1,
  /** do not include any embeds when serializing this message */
  SUPPRESS_EMBEDS = 1 << 2,
  /** the source message for this crosspost has been deleted (via Channel Following) */
  SOURCE_MESSAGE_DELETED = 1 << 3,
  /** this message came from the urgent message system */
  URGENT = 1 << 4,
  /** this message has an associated thread, with the same id as the message */
  HAS_THREAD = 1 << 5,
  /** this message is only visible to the user who invoked the Interaction */
  EPHEMERAL = 1 << 6,
  /** this message is an Interaction Response and the bot is "thinking" */
  LOADING = 1 << 7,
}

/** https://discord.com/developers/docs/resources/channel#message-reference-object-message-reference-structure */
export interface MessageReference {
  /** id of the originating message */
  message_id?: snowflake
  /** id of the originating message's channel */
  channel_id?: snowflake
  /** id of the originating message's guild */
  guild_id?: snowflake
  /** when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true */
  fail_if_not_exists?: boolean
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-structure */
export interface Embed {
  /** title of embed */
  title?: string
  /** type of embed (always "rich" for webhook embeds) */
  type?: string
  /** description of embed */
  description?: string
  /** url of embed */
  url?: string
  /** timestamp of embed content */
  timestamp?: timestamp
  /** color code of the embed */
  color?: integer
  /** footer information */
  footer?: EmbedFooter
  /** image information */
  image?: EmbedImage
  /** thumbnail information */
  thumbnail?: EmbedThumbnail
  /** video information */
  video?: EmbedVideo
  /** provider information */
  provider?: EmbedProvider
  /** author information */
  author?: EmbedAuthor
  /** fields information */
  fields?: EmbedField[]
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure */
export interface EmbedThumbnail {
  /** source url of thumbnail (only supports http(s) and attachments) */
  url: string
  /** a proxied url of the thumbnail */
  proxy_url?: string
  /** height of thumbnail */
  height?: integer
  /** width of thumbnail */
  width?: integer
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure */
export interface EmbedVideo {
  /** source url of video */
  url?: string
  /** a proxied url of the video */
  proxy_url?: string
  /** height of video */
  height?: integer
  /** width of video */
  width?: integer
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure */
export interface EmbedImage {
  /** source url of image (only supports http(s) and attachments) */
  url: string
  /** a proxied url of the image */
  proxy_url?: string
  /** height of image */
  height?: integer
  /** width of image */
  width?: integer
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure */
export interface EmbedProvider {
  /** name of provider */
  name?: string
  /** url of provider */
  url?: string
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure */
export interface EmbedAuthor {
  /** name of author */
  name: string
  /** url of author */
  url?: string
  /** url of author icon (only supports http(s) and attachments) */
  icon_url?: string
  /** a proxied url of author icon */
  proxy_icon_url?: string
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure */
export interface EmbedFooter {
  /** footer text */
  text: string
  /** url of footer icon (only supports http(s) and attachments) */
  icon_url?: string
  /** a proxied url of footer icon */
  proxy_icon_url?: string
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure */
export interface EmbedField {
  /** name of the field */
  name: string
  /** value of the field */
  value: string
  /** whether or not this field should display inline */
  inline?: boolean
}

/** https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure */
export interface Attachment {
  /** attachment id */
  id: snowflake
  /** name of file attached */
  filename: string
  /** the attachment's media type */
  content_type?: string
  /** size of file in bytes */
  size: integer
  /** source url of file */
  url: string
  /** a proxied url of file */
  proxy_url: string
  /** height of file (if image) */
  height?: integer
  /** width of file (if image) */
  width?: integer
  /** whether this attachment is ephemeral */
  ephemeral?: boolean
}

/** https://discord.com/developers/docs/resources/channel#channel-mention-object-channel-mention-structure */
export interface ChannelMention {
  /** id of the channel */
  id: snowflake
  /** id of the guild containing the channel */
  guild_id: snowflake
  /** the type of channel */
  type: ChannelType
  /** the name of the channel */
  name: string
}

export interface MessageCreateEvent extends Message {}

export interface MessageUpdateEvent extends Message {}

/** https://discord.com/developers/docs/topics/gateway#message-delete-message-delete-event-fields */
export interface MessageDeleteEvent {
  /** the id of the message */
  id: snowflake
  /** the id of the channel */
  channel_id: snowflake
  /** the id of the guild */
  guild_id?: snowflake
}

/** https://discord.com/developers/docs/topics/gateway#message-delete-bulk-message-delete-bulk-event-fields */
export interface MessageDeleteBulkEvent {
  /** the ids of the messages */
  ids: snowflake[]
  /** the id of the channel */
  channel_id: snowflake
  /** the id of the guild */
  guild_id?: snowflake
}

declare module './gateway' {
  interface GatewayEvents {
    /** message was created */
    MESSAGE_CREATE: MessageCreateEvent
    /** message was edited */
    MESSAGE_UPDATE: MessageUpdateEvent
    /** message was deleted */
    MESSAGE_DELETE: MessageDeleteEvent
    /** multiple messages were deleted at once */
    MESSAGE_DELETE_BULK: MessageDeleteBulkEvent
  }
}

declare module './internal' {
  interface Internal {
    /** https://discord.com/developers/docs/resources/channel#get-channel-messages */
    getChannelMessages(channel_id: snowflake): Promise<Message[]>
    /** https://discord.com/developers/docs/resources/channel#get-channel-message */
    getChannelMessage(channel_id: snowflake, message_id: snowflake): Promise<Message>
    /** https://discord.com/developers/docs/resources/channel#create-message */
    createMessage(channel_id: snowflake, data: Partial<Message>): Promise<Message>
    /** https://discord.com/developers/docs/resources/channel#crosspost-message */
    crosspostMessage(channel_id: snowflake, message_id: snowflake): Promise<Message>
    /** https://discord.com/developers/docs/resources/channel#edit-message */
    editMessage(channel_id: snowflake, message_id: snowflake, data: Partial<Message>): Promise<Message>
    /** https://discord.com/developers/docs/resources/channel#delete-message */
    deleteMessage(channel_id: snowflake, message_id: snowflake): Promise<void>
    /** https://discord.com/developers/docs/resources/channel#bulk-delete-messages */
    bulkDeleteMessages(channel_id: snowflake, message_ids: snowflake[]): Promise<void>
  }
}

Internal.define({
  '/channels/{channel.id}/messages': {
    GET: 'getChannelMessages',
    POST: 'createMessage',
  },
  '/channels/{channel.id}/messages/{message.id}': {
    GET: 'getChannelMessage',
    PATCH: 'editMessage',
    DELETE: 'deleteMessage',
  },
  '/channels/{channel.id}/messages/{message.id}/crosspost': {
    POST: 'crosspostMessage',
  },
  '/channels/{channel.id}/messages/bulk-delete': {
    POST: 'bulkDeleteMessages',
  },
})
