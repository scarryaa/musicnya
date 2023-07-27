/* eslint-disable @typescript-eslint/no-namespace */

/**Use the MusicKit namespace to configure MusicKit on the Web and access the singleton instance.
 *
 * It is also a global variable on the window object, and a namespace for other utils and enums.
 * @see MusicKit Docs: [Configuring MusicKit on the Web](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?path=/story/get-started--page#configuring-musickit-on-the-web)
 * @see {@link MusicKitInstance} for the configured instance.*/
declare module MusicKit {
  /**The MusicKitConfiguration object is passed to the MusicKit.configure() method above and supports the following properties. */

  /**A set of configuration parameters for your app during the authorization flow.
   * @see MusicKit Docs: [Authorization Flow](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?path=/story/user-authorization--page) */
  interface App {
    /**The name of your application during the authorization flow. */
    name: string;
    /**Current build number or version of your app. */
    build?: string;
    /**A URL to the image used to represent your application during the authorization flow.
     *
     * Ideally this image has a square aspect ratio and is 152px by 152px (2x image content to support Retina Displays).
     *
     * Display dimensions are 76px by 76px. */
    icon?: string;
    version?: string;
  }

  /**The MusicKitConfiguration object is passed to the MusicKit.configure() method above and supports the following properties. */
  interface MusicKitConfiguration {
    /**A developer token to use with MusicKit JS. */
    developerToken: string;
    /**A set of configuration parameters for your app.
     * @see {@link App} */
    app: App;
    /**Can be used to target a bit rate for playback. Otherwise MusicKit will do its best to determine a proper bit rate.
     *
     * Can be changed later on the instance.
     * @see {@link MusicKitInstance.bitrate} */
    bitrate?: PlaybackBitrate;
    /**This is the value used for the {{storefrontId}} token in the path argument of the Passthrough API method, which helps create reusable URL
     * templates by abstracting the storefront.
     *
     * If not set, the storefrontId will use the authenticated user’s storefront, which is likely ideal in most situations.
     * @see {@link MusicKitInstance.storefrontId}*/
    storefrontId?: string;
    sourceType?: number;
    suppressErrorDialog?: boolean;
  }

  // Methods

  /**Configures a MusicKit instance.
   * @param config A {@link MusicKitConfiguration MusicKitConfiguration} object.
   * @returns A Promise that resolves with the configured {@link MusicKitInstance}. */
  function configure(config: MusicKitConfiguration): Promise<MusicKitInstance>;

  /**Access the configured MusicKit Instance singleton.
   * @returns the singleton {@link MusicKitInstance}, or undefined if the instance has not been configured.
   *
   * NOTE: {@link MusicKit.configure()} must have been called first for the singleton instance to have been created. Otherwise this will return undefined. */
  export function getInstance(): MusicKitInstance;

  /**Takes an artwork object, which is common in Apple Music API Responses.
   * @param artwork The Artwork object.
   * @param width The desired artwork width*.
   * @param height The desired artwork height*.
   * @returns A URL that can be used as the source for an image or picture tag, etc.
   * @see Apple Music API: [Artwork Object](https://developer.apple.com/documentation/applemusicapi/artwork)
   * @see MusicKit Docs: [MusicKitAPI and the Passthrough API Method](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?id=reference-javascript-api--page) */
  function formatArtworkURL(
    artwork: Artwork,
    width?: number,
    height?: number,
  ): string;

  // Enums

  /**The playback bit rate of the music player.
   *
   * Used in the {@link configure()} method, or set directly on the {@link MusicKitInstance} as the bitrate property. */
  const enum PlaybackBitrate {
    /**The bit rate is 256 kbps. */
    HIGH = 256,
    /**The bit rate is 64 kbps. */
    STANDARD = 64,
  }

  /**The playback states of the music player. */
  const enum PlaybackStates {
    /**This value indicates that the player has not attempted to start playback. */
    none = 0,
    /**This value indicates that loading of the MediaItem has begun. */
    loading = 1,
    /**This value indicates that the player is currently playing media. */
    playing = 2,
    /**This value indicates that playback has been paused. */
    paused = 3,
    /**This value indicates that plaback has been stopped. */
    stopped = 4,
    /**This value indicates that playback of the MediaItem has ended. */
    ended = 5,
    /**This value indicates that the player has started a seek operation. */
    seeking = 6,
    /**This value indicates that playback is delayed pending the completion of another operation. */
    waiting = 7,
    /**This value indicates that the player is trying to fetch media data but data has not been received yet. */
    stalled = 8,
    /**This value indicates that playback of all MediaItems in the queue has ended. */
    completed = 9,
  }

  /**Possible values for the repeat mode for the music player. */
  const enum PlayerRepeatMode {
    /**The current queue will be repeated. */
    all = "all",
    /**No repeat mode specified. */
    none = "none",
    /**The current MediaItem will be repeated. */
    one = "one",
  }

  /**Possible values for the shuffle mode for the music player. */
  const enum PlayerShuffleMode {
    /**The queue will not be shuffled. */
    off = 0,
    /**The queue will shuffle songs. */
    songs = 1,
  }

  interface SeekSeconds {
    BACK: number;
    FORWARD: number;
  }

  /**he MusicKit instance is a singleton, meaning there is only one instance for the runtime of your application.
   *
   * It can be accessed as the resolved value of {@link MusicKit.configure()} or the return value of {@link MusicKit.getInstance()} after configuration. */
  export class MusicKitInstance {
    /**Used to call the Apple Music API.
     * @see Apple Music API: {@link [Accessing Music Content](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?path=/story/accessing-music-content--page)} */
    api: MusicKitAPI;
    /**The bit rate for the media player. The bit rate is set automatically based on the client, but can be overridden by the app to a value from the enum MusicKit.PlaybackBitrate.
     *
     * Setting this property will affect the item played next, not the currently playing item.
     *
     * This property does not necessarily represent the actual bit rate of the item being played, only the target bit rate when the player selects the stream to play. */
    bitrate: PlaybackBitrate;
    /**The duration of the {@link nowPlayingItem}, in seconds. */
    currentPlaybackDuration: number;
    /**Progress percentage between 0 and 1 indicating the current play head position for the nowPlayingItem.
     *
     * Useful for showing a playback progress bar UI, for instance. */
    currentPlaybackProgress: number;
    /**The current position of the play head for the nowPlayingItem, in seconds. */
    currentPlaybackTime: number;
    /**The current remaining playback time for the {@link nowPlayingItem}, in seconds. */
    currentPlaybackTimeRemaining: number;
    /**This is set to true after the user successfully signs in and authorizes the application via the authorize() method,
     * or upon configuring the MusicKit instance if the user had previously authorized your application. */
    isAuthorized: boolean;
    /**Indicates whether the player is in the playing state. */
    isPlaying: boolean;
    /**This is the {@link MediaItem} that is currently playing from the {@link Queue}.
     *
     * This property will change when playback of a Queue starts, but will not unset on pause.
     *
     * It will change to the next item in the Queue once that item starts playing. */
    nowPlayingItem: MediaItem | undefined;
    /**The index of the {@link nowPlayingItem} in the current playback {@link Queue}. */
    nowPlayingItemIndex: number;
    /**The speed of playback, which is set directly on the HTMLMediaElement as the HTMLMediaElement.playbackRate property.
     *
     * The default rate is 1.0, but this can be set to a value higher or lower to control the speed of playback.
     *
     * Different browsers will have different upper and lower bounds for this value. */
    playbackRate: number;
    /**The current playback state of the media player. See {@link PlaybackStates} for more information and the possible values. */
    playbackState: PlaybackStates;
    /**When a user with a valid Apple Music subscription authorizes your app, MusicKit will allow full playback of content from the Apple Music catalog.
     *
     * If the app does not have user authorization, then playback is restricted to non-DRM preview assets, which are snippets of the full media.
     *
     * You can set this property to true to restrict MusicKit to playing only the preview assets, even when full playback is available.
     *
     * Setting this to false will not force full playback, but will instead return to the default behavior of determining what asset to play based
     * on the user’s authorization and Apple Music Subscription status. */
    previewOnly: boolean;
    /**The current playback queue of the music player. */
    queue: Queue;
    /**Indicates whether the current playback {@link Queue} is empty. */
    queueIsEmpty: number;
    /**Set this to an Enum value from {@link PlayerRepeatMode} to control the repeat behavior during playback. */
    repeatMode: PlayerRepeatMode;
    /**While playing a MediaItem, seekSeconds will be an Object with properties BACK and FORWARD,
     * which represent the number of seconds that the play head will be moved backwards or forwards when calling {@link seekBackward} or {@link seekForward}, respectively. */
    seekSeconds: SeekSeconds | undefined;
    /** The shuffle mode of the player.
     *
     * Set this to an Enum value from {@link PlayerShuffleMode} to control the shuffle behavior during playback.
     *
     * Setting this property will not change the {@link nowPlayingItem}. If there is a nowPlayingItem when setting shuffleMode it will
     * always be the first item in the shuffled queue. */
    shuffleMode: PlayerShuffleMode;
    /**@deprecated This property is deprecated, use {@link shuffleMode} instead. */
    shuffle: boolean;
    /**This is the id of the authorized user’s storefront, if applicable. It defaults to 'us'. */
    storefrontCountryCode: string;
    /**This is the id of the configured storefront for the instance of MusicKit.
     * It can be set explicitly when calling {@link MusicKit.configure()},
     * or after configuration by calling {@link changeUserStorefront}.
     * It will default to the {@link storefrontCountryCode}.
     *
     * This is also the value used for the {{storefrontId}} token in the path argument of the Passthrough API method, which helps create
     * reusable URL templates by abstracting the storefront.
     * @see MusicKit Docs: [Passthrough API](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?path=/story/reference-javascript-api--page) */
    storefrontId: string;
    /**If creating a custom video player, you can set this property to a DOM Element of type {@link HTMLVideoElement}, which is the element type of a <video> tag.
     * MusicKit will then use that element for video playback, for instance Music Videos.
     *
     * Using our Music Video Player Web Component, this will be configured for you automatically.
     * Otherwise, you will need to add a <video> element to your page and provide a reference to it as the videoContainerElement
     * property in order to play any video-format Media Items. */
    videoContainerElement: any | undefined;
    /**The volume of audio playback, which is set directly on the {@link HTMLMediaElement} as the {@link HTMLMediaElement.volume} property.
     *
     * This value ranges between 0, which would be muting the audio, and 1, which would be the loudest possible. */
    volume: number;

    musicUserToken: string;
    developerToken: string;
    autoplayEnabled: boolean;
    _autoplayEnabled: boolean;

    // Methods

    /**Listen to an {@link  MusicKit.Events Event} on the MusicKit Instance.
     * @param name The name of the event.
     * @param callback The function that is called when an event is published. The arguments vary per event, and the function returns void.
     * @param options An optional options object. defaults to false.
     * If 'once' is true, will automatically remove the event listener after it has fired once.
     * When false, callback will continue to be called each time the event is published until {@link removeEventListener()} is called with the appropriate arguments.
     * @returns void.
     * @see {@link MusicKit.Events} for more info.*/
    addEventListener(
      name: string,
      callback: (event: any) => void,
      options?: { once: boolean },
    ): void;

    /**Initiates the authorization flow.
     * @returns a Promise that resolves with a string representing the user. If authorization fails or is canceled by the user, the resolved value is undefined.
     * @see MusicKit Docs: [User Authorization](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?path=/docs/user-authorization--page) */
    authorize(): Promise<string | void>;

    /**Begins playing the {@link MediaItem} at the specified index in the {@link Queue} immediately.
     *
     * Note: This method will trigger playback, even if the player is currently paused.
     * This could result in an error if the user has not interacted with the player yet, as most browsers prevent audio playback without user interaction.
     * @param index The index position of the {@link MediaItem} in the {@link Queue} to begin playing.
     * @returns a void Promise. */
    changeToMediaAtIndex(index: number): Promise<void>;

    /**Begins playing a specific {@link MediaItem} in the {@link Queue} immediately.
     *
     * Note: This method will trigger playback, even if the player is currently paused.
     * This could result in an error if the user has not interacted with the player yet, as most browsers prevent audio playback without user interaction.
     * @param descriptor A {@link MediaItem} instance or the {@link id} of a specific item in the {@link Queue}.
     * @returns a void Promise.*/
    changeToMediaItem(descriptor: MediaItem | string | number): Promise<void>;

    /**Changes the user's storefront.
     * @param storefrontId The id of the storefront to use as the {{storefrontId}} value in the path parameter of the
     * Passthrough API.
     * @returns a void Promise.
     * @see MusicKit Docs: [Passthrough API](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?id=reference-javascript-api--page) */
    changeUserStorefront(storefrontId: string): Promise<void>;

    /**Clears the queue of all {@link MediaItem MediaItems}. Does not stop playback or clear the {@link nowPlayingItem}.
     * @returns an empty {@link Queue}, which is also set as the queue property of the {@link MusicKitInstance}. */
    clearQueue(): Promise<Queue>;

    /**Cross-browser method to close a full-screen element, when applicable.
     * @returns a void Promise. */
    exitFullscreen(): Promise<void>;

    /**Sets the {@link volume} to 0, storing the previous value for use with {@link unmute()} later, if necessary.
     * @returns void. */
    mute(): void;

    /**Pauses playback of the {@link nowPlayingItem}.
     * @returns void. */
    pause(): void;

    /**Initiates playback of the {@link nowPlayingItem}.
     *
     * Note: This could result in an error if the user has not interacted with the player yet, as most browsers prevent audio playback without user interaction.
     * @returns void. */
    play(): Promise<void>;

    /**Inserts the {@link MediaItem MediaItem(s)} defined by {@link QueueOptions} at the position indicated in the current {@link Queue}.
     * @param position The index position in the Queue to inser the new MediaItem(s) at. Position 0 is the first item in the Queue.
     * @param options The {@link QueueOptions} object to set the Queue with.
     * @returns a Promise that resolves with the updated Queue, or void if playback is not supported. */
    playAt(position: number, options: QueueOptions): Promise<Queue | void>;

    /**Inserts the {@link MediaItem MediaItem(s)} defined by {@link QueueOptions} after the last MediaItem in the current {@link Queue}.
     * @param options The {@link QueueOptions} object to set the Queue with.
     * @returns a Promise that resolves with the updated Queue, or void if playback is not supported. */
    playLater(options: QueueOptions): Promise<Queue | void>;

    /**Inserts the {@link MediaItem MediaItem(s)} defined by {@link QueueOptions} immediately after the {@link nowPlayingItem} in the current {@link Queue}.
     * @param options The {@link QueueOptions} object to set the Queue with.
     * @param clear An optional parameter that, if true, clears out the remaining Queue items. Defaults to false.
     * @returns Returns a Promise that resolves with the updated Queue, or void if playback is not supported. */
    playNext(options: QueueOptions, clear?: boolean): Promise<Queue | void>;

    /**Remove an event listener previously configured on the {@link MusicKitInstance} via {@link MusicKitInstance.addEventListener addEventListener()}.
     * @param name The {@link MusicKit.Events Event} to stop listening to.
     * @param callback The exact function reference passed when originally calling {@link MusicKitInstance.addEventListener addEventListener()} for the same event name.
     * @returns void. */
    removeEventListener(name: string, callback: (event: any) => void): void;

    /**Cross-browser method to take an element full-screen, where supported. Useful for creating custom controller UI.
     * @param element The DOM Node that you intend to make fullscreen.
     * @returns a void Promise. */
    requestFullscreen(element: any): Promise<void>;

    /**Seeks the current play head backwards by a predetermined number of a seconds.
     * The number of seconds can be determined for the current track by referencing {@link MusicKitInstance.seekSeconds seekSeconds.BACK}.
     * @returns a void Promise. */
    seekBackward(): Promise<void>;

    /**Seeks the current play head forward by a predetermined number of a seconds.
     * The number of seconds can be determined for the current track by referencing {@link MusicKitInstance.seekSeconds seekSeconds.FORWARD}.
     * @returns a void Promise. */
    seekForward(): Promise<void>;

    /**Sets the play head to a specified time within the {@link nowPlayingItem}.
     * @param time The time, in seconds, to move the play head for the nowPlayingItem.
     * @returns a void Promise. */
    seekToTime(time: number): Promise<void>;

    /**Sets the current playback {@link Queue} to an Apple Music catalog resource or list of songs.
     * @param options The {@link QueueOptions} object to set the Queue with.
     * @returns a Promise that resolves with the updated Queue, or void if playback is not supported. */
    setQueue(options: QueueOptions): Promise<Queue | void>;

    /**Starts playback of the next item in the playback {@link Queue}.
     * @returns a void Promise. */
    skipToNextItem(): Promise<void>;

    /**Starts playback of the previous item in the playback {@link Queue}.
     * @returns a void Promise. */
    skipToPreviousItem(): Promise<void>;

    /**Stops the currently playing item.
     * @returns a void Promise. */
    stop(): Promise<void>;

    /** Unauthorizes the user from using your application. It will invalidate the Music User Token.
     * @returns a void Promise. */
    unauthorize(): Promise<void>;

    /**Unmute playback volume, resetting it to the value it was at before muting.
     * @returns a void Promise. */
    unmute(): Promise<void>;
  }

  type Descriptor = MediaItem | string;

  class QueueOptions {
    album?: string;
    items?: Array<Descriptor>;
    playlist?: string;
    song?: string;
    songs?: Array<string>;
    musicVideo?: string;
    station?: string;
    startPlaying?: boolean;
    startPosition?: number;
    startWith?: number;
    url?: string;
  }

  /**The Queue represents an ordered list of {@link MediaItems} to play, and a pointer to the currently playing item, when applicable.
   *
   * You can access the current queue in {@link MusicKit} with the {@link MusicKitInstance.queue} property, or as the return value of {@link MusicKitInstance.setQueue()}. */
  interface Queue {
    /**The item at the {@link Queue.position} index within the {@link Queue.items} array.
     * This is the nowPlayingItem when the {@link Queue} is the current queue for the {@link MusicKitInstance}. */
    currentItem: MediaItem;
    /**If the length of the queue is 0. */
    isEmpty: boolean;
    /**An array of all the {@link MediaItem MediaItems} in the queue. */
    items: Array<MediaItem>;
    /**The number of items in the {@link Queue}. */
    length: number;
    /**This is the next item after the {@link currentItem} within the {@link Queue}. */
    nextPlayableItem: MediaItem;
    /**The index position of the {@link nowPlayingItem} in the {@link Queue.items} Array. */
    position: number;
    /**This is the previous item before the {@link currentItem} within the {@link Queue}. */
    previousPlayableItem: MediaItem;
    /**Queue Options are used to instruct {@link MusicKit} to generate or ammend a {@link Queue}, for example using the {@link MusicKitInstance.setQueue()} method.
     *
     *
     * This object serves two main purposes:
     *
     * Content Options:
     * ---
     * Indicating media to add to the queue or generate a new queue from.
     *
     * Playback Options:
     * ---
     * Indicating options for how that content is intended to play.
     *
     * All of these properties exist within the same Object passed as {@link QueueOptions}, but are documented separately below for clarity.
     *
     * ---
     * Setting Queue Content by IDs
     * ---
     * The most common way to select {@link MediaItem MediaItems} to add to or replace a {@link Queue} with is via the ID(s) of
     * the content from the Apple Music catalog.
     *
     * MusicKit is not able to determine the type of content from the ID alone,
     * so the property name indicates the type and the value represents the ID(s) themselves.
     *
     * ---
     *
     * The following property names can be used to select content (singlular from / plural form):
     *
     * album / albums
     *
     * musicVideo / musicVideos
     *
     * playlist / playlists
     *
     * song / songs
     *
     * @example
     * ```
     * const music = MusicKit.getInstance();
     *
     * // Create a new queue from a playlist
     *
     * await music.setQueue({ playlist: 'pl.d133de76fb4f4ccf98846231899874c0', startPlaying: true });
     *
     * // Update the current queue to add a song after the currently playing one
     *
     * await music.playNext({ song: '1561837008' });
     * ```
     *
     * Setting Queue Content by URL
     * ---
     * As an abstracted way to play a media item or container (such as an album or playlist)
     * without first needing to know the type, you can provide a URL reference, which is commonly found under the
     * attributes of the Apple Music API response objects.
     *
     * @example
     * ```
     * const music = MusicKit.getInstance();
     *
     * const playlistURL = 'https://music.apple.com/us/playlist/pl.d133de76fb4f4ccf98846231899874c0';
     *
     * await music.setQueue({ url: playlistURL });
     * ```
     *
     * @see MusicKit Docs: [Passthrough API](https://js-cdn.music.apple.com/musickit/v3/docs/iframe.html?id=reference-javascript-api--page) for more info. */
    QueueOptions: QueueOptions;
    /**Updates the {@link repeatMode} on the {@link MusicKitInstance} when setting the new {@link Queue}.
     * If not set, repeatMode on the MusicKit Instance will not be changed.
     *
     * Defaults to undefined.*/
    repeatMode: PlayerRepeatMode | undefined;
    /**Whether or not to also start playback when the {@link Queue} is updated.
     *
     * If not set to true when {@link MusicKitInstance.setQueue()} is called, current playback will stop, if applicable.
     *
     * Defaults to false.*/
    startPlaying: boolean;
    /**The number of seconds to seek to in the current queue item after it is created. */
    startTime: number;
  }

  /**{@link MusicKit} on the Web uses the following error codes to describe errors that may occur when using MusicKit, including server and local errors. */
  class MKError extends Error {
    /**The errorCode for the error. */
    errorCode: string;
    /**A description of the error that occurred. */
    description?: string | undefined;

    /**Error code indicating that you don't have permission to access the endpoint, {@link MediaItem}, or content. */
    static ACCESS_DENIED: string;
    /**Error code indicating that action blocked due to age verification. */
    static AGE_VERIFICATION: string;
    /**Error code indicating the authorization was rejected. */
    static AUTHORIZATION_ERROR: string;
    /**Error code indicating a {@link MusicKit} on the Web configuration error. */
    static CONFIGURATION_ERROR: string;
    /**Error code indicating the content has an equivalent for the user's storefront. */
    static CONTENT_EQUIVALENT: string;
    /**Error code indicating you don't have permission to access this content, due to content restrictions. */
    static CONTENT_RESTRICTED: string;
    /**Error code indicating the content requested is not available. */
    static CONTENT_UNAVAILABLE: string;
    /**Error code indicating the content is not supported on the current platform. */
    static CONTENT_UNSUPPORTED: string;
    /**Error code indicating you have reached your device limit. */
    static DEVICE_LIMIT: string;
    /**Error code indicating that an error internal to media-api occurred. */
    static INTERNAL_ERROR: string;
    /**Error code indicating the parameters provided for this method are invalid. */
    static INVALID_ARGUMENTS: string;
    /**Error code indicating that the VM certificate could not be applied. */
    static MEDIA_CERTIFICATE: string;
    /**Error code indicating that the {@link MediaItem} descriptor is invalid. */
    static MEDIA_DESCRIPTOR: string;
    /**Error code indicating that a DRM key could not be generated. */
    static MEDIA_KEY: string;
    /**Error code indicating a DRM license error. */
    static MEDIA_LICENSE: string;
    /**Error code indicating a media playback error. */
    static MEDIA_PLAYBACK: string;
    /**Error code indicating that an EME session could not be created. */
    static MEDIA_SESSION: string;
    /**Error code indicating a network error. */
    static NETWORK_ERROR: string;
    /**Error code indicating that the resource was not found. */
    static NOT_FOUND: string;
    /**Error code indicating that content cannot be played due to HDCP error. */
    static OUTPUT_RESTRICTED: string;
    /**Error code indicating that the error encountered while parsing results. */
    static PARSE_ERROR: string;
    /**Error code indicating that the browser supports Playready DRM but not CBCS encryption. */
    static PLAYREADY_CBC_ENCRYPTION_ERROR: string;
    /**Error code indicating that you have exceeded the Apple Music API quota. */
    static QUOTA_EXCEEDED: string;
    /**Error code indicating that a request error has occured. */
    static REQUEST_ERROR: string;
    /**Error code indicating that a server error has occured. */
    static SERVER_ERROR: string;
    /**Error code indicating the {@link MusicKit} service could not be reached. */
    static SERVICE_UNAVAILABLE: string;
    /**Error code indicating that a stream contention - Upsell error has occured. */
    static STREAM_UPSELL: string;
    /**Error code indicating that the user's Apple Music subscription has expired. */
    static SUBSCRIPTION_ERROR: string;
    /**Error code indicating that the user token has expired. */
    static TOKEN_EXPIRED: string;
    /**Error code indicating that the request wasn’t accepted because its authorization is missing or invalid due to an issue with the developer token. */
    static UNAUTHORIZED_ERROR: string;
    /**Error code indicating an unknown error. */
    static UNKNOWN_ERROR: string;
    /**Error code indicating that the operation is not supported. */
    static UNSUPPORTED_ERROR: string;
    /**Error code indicating that playback of media content requires user interaction first and cannot be automatically started on page load.
     *
     * For more information, see {@link HTMLMediaElement.play()}. */
    static USER_INTERACTION_REQUIRED: string;
    /**Error code indicating that the browser's Widevine CDM implementation is old and insecure, and Irdeto won't serve a license for it. */
    static WIDEVINE_CDM_EXPIRED: string;
  }

  interface MediaItemOptions {
    attributes: any;
    id: string | undefined;
    type: any;
  }

  export type MediaItemType =
    | "library-albums"
    | "library-playlists"
    | "library-songs"
    | "library-artists"
    | "albums"
    | "playlists"
    | "songs"
    | "personal-recommendation"
    | "music-videos"
    | "stations"
    | "artists"
    | "curators"
    | "activities"
    | "apple-curators";

  /**This class represents a single media item. */
  class MediaItem {
    /**A constructor that creates a new media item from specified options.
     * @param options The options to use when defining a media item.
     * @returns a media item. */
    constructor(options?: MediaItemOptions);

    /** custom props */
    color: any;

    /**A string of information about the album. */
    albumInfo?: string;
    href?: string;
    _container?: any;
    /**The title of the album. */
    albumName?: string;
    /**The artist for a media item. */
    artistName?: string;
    /**The artwork object for the media item. */
    artwork?: Artwork;
    /**The artwork image for the media item. */
    artworkURL?: string;
    /**The attributes object for the media item. */
    assets?: any;
    attributes?: { [key: string]: any };
    /**The attributes object for the media item. */
    contentRating?: string;
    /**The disc number where the media item appears. */
    discNumber?: number;
    duration?: number;
    songs?: MediaItem[];
    /**The identifier for the media item. */
    id: string;
    /**A string of common information about the media item. */
    info?: string;
    /**A Boolean value that indicates whether the item has explicit lyrics or language. */
    isExplicitItem?: boolean;
    /**A Boolean value that indicated whether the item is playable. */
    isPlayable?: boolean;
    /**A Boolean value indicating whether the media item is prepared to play. */
    isPreparedToPlay?: boolean;
    /**The ISRC (International Standard Recording Code) for a media item. */
    isrc?: string;
    /**The playback duration of the media item. */
    playbackDuration?: number;
    /**The playlist artwork image for the media item. */
    playlistArtworkURL?: string;
    /**The name of the playlist. */
    playlistName?: string;
    /**The URL to an unencrypted preview of the media item. */
    previewURL?: string;
    /**The release date of the media item. */
    releaseDate?: Date | undefined;
    /**The name of the media item. */
    title?: string;
    _songId?: string;
    /**The number of the media item in the album's track list. */
    trackNumber?: number;
    /**The number of the media item in the album's track list. */
    type: MusicKit.MediaItemType;
    views?: Record<string, View<any>>;
    relationships?: any;
    meta?: {
      reason?: {
        contentIds: string[];
        stringForDisplay: string;
      };
    };

    // Methods

    /**Prepares a media item for playback.
     * @returns a void Promise. */
    prepareToPlay?(): Promise<void>;
  }

  /**An enum containing events for a {@link MusicKitinstance}.*/
  export class Events {
    /**A notification indicating an audio track has been added to the media element.
     *
     * Consumers should access the audioTracks field on the MusicKit instance. */
    static audioTrackAdded: unknown;
    /**A notification indicating the playing audio track has changed.
     *
     * Consumers should access the audioTracks field on the MusicKit instance to determine the currently enabled track. */
    static audioTrackChanged: unknown;
    /**A notification indicating an audio track has been removed from the media element.
     *
     * Consumers should access the audioTracks field on the MusicKit instance. */
    static audioTrackRemoved: unknown;
    /**A notification name indicating a change in the authorization status. */
    static authorizationStatusDidChange: unknown;
    /**A notification name indicating an upcoming change in the authorization status. */
    static authorizationStatusWillChange: unknown;
    /**A notification name for indicating the current buffer progress changed. */
    static bufferedProgressDidChange: unknown;
    /**A notification indicating that the capabilities available for playback controls have changed. */
    static capabilitiesChanged: unknown;
    /**A notification that is fired when a MusicKit on the Web instance has been configured. */
    static configured: unknown;
    /**A notification for indicating that media playback has fallen back to preview mode due to an inability to configure DRM for the current item in the current environment. */
    static drmUnsupported: unknown;
    /**A notification name indicating a user is eligible for a subscribe view. */
    static eligibleForSubscribeView: unknown;
    /**A notification indicating the text track to use for forced subtitles has changed. */
    static forcedTextTrackChanged: unknown;
    /**A notification name indicating MusicKit on the Web is loaded. */
    static loaded: unknown;
    /**A notification name indicating the player has obtained enough data for playback to start. */
    static mediaCanPlay: unknown;
    /**A notification indicating a new media element was created. The element is passed as the event data. */
    static mediaElementCreated: HTMLMediaElement;
    /**A notification for indicating that a MediaItem's state has changed. */
    static mediaItemStateDidChange: unknown;
    /**A notification for indicating that a MediaItem's state is about to be changed. */
    static mediaItemStateWillChange: unknown;
    /**A notification for indicating that the player has thrown an MKError during playback. */
    static mediaPlaybackError: unknown;
    /**A notification indicating that the skip intro period has been reached. */
    /**A notification indicating that a Pre or Post Roll has been entered. */
    static mediaSkipAvailable: unknown;
    /**A notification indicating the the next item should be shown. */
    static mediaUpNext: unknown;
    /**A notification name indicating the MediaItem's metadata has finished loading. */
    static metadataDidChange: unknown;
    /**A notification for indicating the currently-playing MediaItem is about to be changed. */
    static nowPlayingItemWillChange: { item: MediaItem };
    /**A notification for indicating the currently-playing MediaItem has changed. */
    static nowPlayingItemDidChange: { item: MediaItem };
    /**A notification indicating the playback bit rate has changed. */
    static playbackBitrateDidChange: unknown;
    /**A notification name indiciating the current playback duration changed. */
    static playbackDurationDidChange: unknown;
    /**A notification name indicating the current playback progress changed. */
    static playbackProgressDidChange: unknown;
    /**A notification for indicating the current playback rate changed. */
    static playbackRateDidChange: unknown;
    /**A notification indicating the playback state is about to be changed. */
    static playbackStateWillChange: {
      oldState: PlaybackStates;
      newState: PlaybackStates;
    };
    /**A notification indicating the playback state has changed. */
    static playbackStateDidChange: {
      oldState: PlaybackStates;
      newState: PlaybackStates;
    };
    /**A notification indicating that a playback target's availability has changed . */
    static playbackTargetAvailableDidChange: unknown;
    /**A notification name indicating the current playback time has changed. */
    static playbackTimeDidChange: unknown;
    /**A notification name indicating the player volume has changed. */
    static playbackVolumeDidChange: unknown;
    /**A notification for indicating the type of player changed; e.g. from music to video. */
    static playerTypeDidChange: unknown;
    /**A notification name indicating the playback has started in another context on your domain, and the current player has stopped playback. */
    static primaryPlayerDidChange: unknown;
    /**A notification indicating the queue data has been loaded and the queue is ready to play. */
    static queueIsReady: unknown;
    /**A notification name indicating that the items in the current playback queue have changed. */
    static queueItemsDidChange: unknown;
    /**A notification name indicating that the current queue position (now playing item) has changed. */
    static queuePositionDidChange: unknown;
    /**A notification indicating that the current controller shuffle mode has changed. */
    static shuffleModeDidChange: unknown;
    /**A notification indicating that the current queue repeat mode has changed. */
    static repeatModeDidChange: unknown;
    /**A notification name indicating a change in the storefront country code. */
    static storefrontCountryCodeDidChange: unknown;
    /**A notification for indicating the devices inferred storefront identifier changed. */
    static storefrontIdentifierDidChange: unknown;
    /**A notification indicating a text track has been added to the media element. */
    static textTrackAdded: unknown;
    /**A notification indicating the playing text track changed. */
    static textTrackChanged: unknown;
    /**A notification indicating a text track has been removed from the media element. */
    static textTrackRemoved: unknown;
    /**A notification indicating the media element has reached a timed metadata event. */
    static timedMetadataDidChange: unknown;
  }

  /**An instance of {@link MusicKitAPI} is made available on configured instances of {@link MusicKit} as the property {@link MusicKitInstance.api api}.
   *
   * The primary use of the API class is to facilitate making requests to the Apple Music API, which is done via the ‘passthrough API’ method api.music(...).
   *
   * The {@link api.music()} method will handle appending the Developer Token (JWT) in the Authorization header,
   * the Music User Token (MUT) for personalized requests, and can help abstract the user’s storefront from the URLs passed in.
   *
   * @example
   * ```
   * const music = MusicKit.getInstance();
   *
   * // {{storefrontId}} is replaced with the current user’s storefront automatically
   *
   * const result = await music.api.music('/v1/catalog/{{storefrontId}}/albums/1025210938');
   * ``` */

  interface Artwork {
    /**The average background color of the image. */
    bgColor?: string;
    /**The average background color of the image. */
    height: number | null;
    /**The maximum width available for the image. */
    width?: number | null;
    /**The primary text color used if the background color gets displayed. */
    textColor1?: string;
    /**The secondary text color used if the background color gets displayed. */
    textColor2?: string;
    /**The tertiary text color used if the background color gets displayed. */
    textColor3?: string;
    /**The final post-tertiary text color used if the background color gets displayed. */
    textColor4?: string;
    /**The URL to request the image asset.
     *
     * {w}x{h}must precede image filename, as placeholders for the width and height values as described above.
     *
     * For example, {w}x{h}bb.jpeg). */
    url: string;
    hasP3?: boolean;
  }

  /**
   * An object that represents a unique identifier for a music item.
   * https://developer.apple.com/documentation/musickit/musicitemid
   */
  type MusicItemID = string;

  /**
   * A protocol for music items that your app can fetch by using a catalog charts request.
   * https://developer.apple.com/documentation/musickit/musiccatalogchartrequestable
   */
  type MusicCatalogChartRequestable =
    | "albums"
    | "music-videos"
    | "playlists"
    | "songs";

  /**
   * The rating of the content that potentially plays while playing a resource.
   * A nil value means no rating is available for this resource.
   * https://developer.apple.com/documentation/musickit/contentrating
   */
  type ContentRating = "clean" | "explicit" | null;

  /**
   * A to-one or to-many relationship from one resource object to others.
   * https://developer.apple.com/documentation/applemusicapi/relationship
   */
  interface Relationship<Data> {
    href?: string;
    next?: string;
    data: Data[];
    contents?: Array<{ data: Array<Resource> }>;
    meta?: Record<string, any>;
  }

  /**
   * A to-one or to-many relationship view from one resource object to others representing interesting associations.
   * https://developer.apple.com/documentation/applemusicapi/view
   */
  interface View<Data> {
    href?: string;
    next?: string;
    attributes?: {
      title: string;
    };
    data: Data[];
    meta?: Record<string, any>;
  }

  /**
   * A resource—such as an album, song, or playlist.
   * https://developer.apple.com/documentation/applemusicapi/resource
   */
  interface Resource {
    id: string;
    href?: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, Relationship<any>>;
    meta?: Record<string, any>;
    views?: Record<string, View<any>>;
  }

  /**
   * A resource object that represents a storefront, an Apple Music and iTunes Store territory that the content is available in.
   * https://developer.apple.com/documentation/applemusicapi/storefronts
   */
  interface Storefronts extends Resource {
    type: "storefronts";
    attributes?: {
      defaultLanguageTag: string;
      explicitContentPolicy: "allowed" | "opt-in" | "prohibited";
      name: string;
      supportedLanguageTags: string[];
    };
  }

  /**
   * A resource object that represents a music genre.
   * https://developer.apple.com/documentation/applemusicapi/genres
   */
  interface Genres extends Resource {
    type: "genres";
    attributes?: {
      name: string;
      parentId?: string;
      parentName?: string;
    };
  }

  /**
   * A resource object that represents a song.
   * https://developer.apple.com/documentation/applemusicapi/songs-um8
   */
  interface Songs extends Resource {
    id: string;
    type: "songs";
    attributes?: {
      albumName: string;
      artistName: string;
      artwork: Artwork;
      attribution?: string;
      audioLocale?: string;
      audioTraits?: string[];
      composerName?: string;
      contentRating?: ContentRating;
      discNumber?: number;
      durationInMillis: number;
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      hasLyrics: boolean;
      hasTimeSyncedLyrics?: boolean;
      isVocalAttenuationAllowed?: boolean;
      isMasteredForItunes?: boolean;
      isAppleDigitalMaster?: boolean;
      isrc?: string;
      movementCount?: number;
      movementName?: string;
      movementNumber?: number;
      name: string;
      playParams?: PlayParameters;
      previews: Preview[];
      releaseDate?: string;
      trackNumber?: number;
      url: string;
      workName?: string;
      artistUrl?: string;
    };
    relationships?: {
      albums: Relationship<Albums>;
      artists: Relationship<Artists>;
      genres: Relationship<Genres>;
      station: Relationship<Stations>;
      catalog?: Relationship<Songs>;
      composers: Relationship<Artists>;
      library: Relationship<LibraryAlbums>;
      "music-videos": Relationship<MusicVideos>;
    };
  }

  interface Ratings extends Resource {
    id: string;
    type: "ratings";
    attributes?: {
      value: number;
    };
  }

  interface LibrarySongs extends Resource {
    id: MusicItemID;
    type: "library-songs";
    attributes?: {
      albumName?: string;
      artistName: string;
      artwork: Artwork;
      attribution?: string;
      audioLocale?: string;
      audioTraits?: string[];
      composerName?: string;
      contentRating?: ContentRating;
      discNumber?: number;
      durationInMillis: number;
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      hasLyrics: boolean;
      hasTimeSyncedLyrics?: boolean;
      isVocalAttenuationAllowed?: boolean;
      isMasteredForItunes?: boolean;
      isAppleDigitalMaster?: boolean;
      isrc?: string;
      movementCount?: number;
      movementName?: string;
      isSingle?: boolean;
      movementNumber?: number;
      name: string;
      playParams?: PlayParameters;
      previews?: Preview[];
      releaseDate?: string;
      trackNumber?: number;
      url: string;
      workName?: string;
      artistUrl?: string;
    };
    relationships?: {
      albums: Relationship<Albums>;
      artists: Relationship<Artists>;
      genres: Relationship<Genres>;
      station: Relationship<Stations>;
      catalog?: Relationship<Songs>;
      composers: Relationship<Artists>;
      library: Relationship<LibraryAlbums>;
      "music-videos": Relationship<MusicVideos>;
    };
  }

  /**
   * A resource object that represents a music video.
   * https://developer.apple.com/documentation/applemusicapi/musicvideos/
   */
  interface MusicVideos extends Resource {
    id: MusicItemID;
    type: "music-videos";
    attributes?: {
      albumName?: string;
      artistName: string;
      artwork: Artwork;
      contentRating?: ContentRating;
      durationInMillis: number;
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      has4K: boolean;
      hasHDR: boolean;
      isrc?: string;
      name: string;
      playParams?: PlayParameters;
      previews: Preview[];
      releaseDate?: string;
      trackNumber?: number;
      url: string;
      videoSubType?: "preview";
      workId?: string;
      workName?: string;
      artistUrl?: string;
    };
    relationships: {
      albums: Relationship<Albums>;
      genres: Relationship<Genres>;
      library: Relationship<LibraryAlbums>;
      songs: Relationship<Songs>;
    };
    views: {
      "more-by-artist": View<MusicVideos>;
      "more-in-genre": View<MusicVideos>;
    };
  }

  interface RoomResults {
    results: {
      target: {
        id: string;
        href: string;
        type: "apple-curators" | "curators";
      };
    };
  }

  /**
   * A resource object that represents an Apple curator.
   * https://developer.apple.com/documentation/applemusicapi/applecurators/
   */
  interface AppleCurators extends Resource {
    type: "apple-curators";
    attributes?: {
      artwork: Artwork;
      editorialNotes?: EditorialNotes;
      kind: "Curator" | "Genre" | "Show";
      name: string;
      shortName?: string;
      showHostName?: string;
      url: string;
    };
    relationships?: {
      playlists: Relationship<Playlists>;
    };
  }

  /**
   * A resource object that represents a curator.
   * https://developer.apple.com/documentation/applemusicapi/curators-uja
   */
  interface Curators extends Resource {
    type: "curators";
    attributes?: {
      artwork: Artwork;
      editorialNotes?: EditorialNotes;
      name: string;
      url: string;
    };
    relationships: {
      playlists: Relationship<Playlists>;
      grouping: Relationship<Groupings>;
    };
  }

  /**
   * A resource object that represents a station.
   * https://developer.apple.com/documentation/applemusicapi/stations/
   */
  interface Stations extends Resource {
    type: "stations";
    attributes?: {
      artwork: Artwork;
      durationInMillis: number;
      editorialNotes: EditorialNotes;
      episodeNumber: number;
      contentRating?: ContentRating;
      isLive: boolean;
      name: string;
      playParams: PlayParameters;
      stationProviderName: string;
      url: string;
    };
  }

  /**
   * A resource object that represents a record label.
   * https://developer.apple.com/documentation/applemusicapi/recordlabels/
   */
  interface RecordLabels extends Resource {
    id: MusicItemID;
    type: "record-labels";
    attributes?: {
      artwork: Artwork;
      description: DescriptionAttribute;
      name: string;
      url: string;
    };
    views: {
      "latest-releases": View<Albums>;
      "top-releases": View<Albums>;
    };
  }

  /**
   * A resource object that represents an album.
   * https://developer.apple.com/documentation/applemusicapi/albums-uib
   */
  interface Albums extends Resource {
    type: "albums";
    attributes?: {
      artistName: string;
      artistUrl?: string;
      artwork: Artwork;
      editorialVideo?: any;
      audioTraits?: string[];
      contentRating?: ContentRating;
      Possible?: ContentRating;
      copyright?: string;
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      isCompilation: boolean;
      isComplete: boolean;
      isMasteredForItunes: boolean;
      isSingle: boolean;
      name: string;
      playParams?: PlayParameters;
      recordLabel?: string;
      releaseDate?: string;
      trackCount: number;
      upc?: string;
      url: string;
    };
    relationships: {
      artists: Relationship<Artists>;
      genres: Relationship<Genres>;
      tracks: Relationship<MusicVideos | Songs>;
      library: Relationship<LibraryAlbums>;
      "record-labels": Relationship<RecordLabels>;
    };
    views: {
      "appears-on": View<Playlists>;
      "other-versions": View<Albums>;
      "related-albums": View<Albums>;
      "related-videos": View<MusicVideos>;
    };
  }

  /**
   * A resource object that represents a library album.
   * https://developer.apple.com/documentation/applemusicapi/libraryalbums/
   */
  interface LibraryAlbums extends Resource {
    type: "library-albums";
    attributes?: {
      artistName: string;
      artwork: Artwork;
      editorialVideo?: any;
      contentRating?: ContentRating;
      dateAdded?: string;
      name: string;
      playParams?: PlayParameters;
      releaseDate?: string;
      trackCount: number;
      genreNames: string[];
    };
    relationships: {
      artists: Relationship<Artists>;
      catalog?: Relationship<Albums>;
      tracks: Relationship<MusicVideos | Songs | LibrarySongs>;
    };
  }

  interface LibraryArtists extends Resource {
    type: "library-artists";
    attributes?: {
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      name: string;
      url: string;
    };
    editorialArtwork: {
      bannerUber: Artwork;
      storeFlowcase: Artwork;
    };
    editorialVideo: any;
    relationships: {
      albums: Relationship<Albums>;
      catalog: Relationship<Artists>;
      genres: Relationship<Genres>;
      "music-videos": Relationship<MusicVideos>;
      playlists: Relationship<Playlists>;
      station: Relationship<Stations>;
    };
    views: {
      "appears-on-albums": View<Albums>;
      "compilation-albums": {
        href?: string;
        next?: string;
        attributes: {
          title: string;
        };
        data: Albums[];
      };
      "featured-albums": View<Albums>;
      "featured-playlists": View<Playlists>;
      "full-albums": View<Albums>;
      "latest-release": View<Albums>;
      "live-albums": View<Albums>;
      "similar-artists": View<Artists>;
      singles: View<Albums>;
      "top-music-videos": View<MusicVideos>;
      "top-songs": View<Songs>;
    };
  }

  /**
   * A resource object that represents a library playlist.
   * https://developer.apple.com/documentation/applemusicapi/libraryplaylists/
   */
  interface LibraryPlaylists extends Resource {
    type: "library-playlists";
    attributes?: {
      isPublic?: boolean;
      canDelete?: boolean;
      artwork?: Artwork;
      editorialVideo?: any;
      canEdit: boolean;
      dateAdded?: string;
      lastModifiedDate?: string;
      dateCreated?: string;
      isPublished?: boolean;
      url: string;
      durationInMillis?: number;
      description?: DescriptionAttribute | string;
      hasCatalog: boolean;
      name: string;
      playParams?: PlayParameters;
    };
    relationships?: {
      catalog?: Relationship<Playlists>;
      tracks?: Relationship<MusicVideos | Songs | LibrarySongs>;
    };
  }

  /**
   * A resource object that represents an artist of an album where an artist can be one or more persons.
   * https://developer.apple.com/documentation/applemusicapi/artists-uip
   */
  interface Artists extends Resource {
    type: "artists";
    attributes?: {
      artwork?: Artwork;
      editorialNotes?: EditorialNotes;
      editorialArtwork?: {
        bannerUber: Artwork;
        storeFlowcase: Artwork;
      };
      genreNames: string[];
      name: string;
      url: string;
    };
    editorialArtwork?: {
      bannerUber: Artwork;
      storeFlowcase: Artwork;
    };
    editorialVideo?: any;
    relationships?: {
      albums?: Relationship<Albums>;
      catalog?: Relationship<Artists>;
      genres?: Relationship<Genres>;
      "music-videos"?: Relationship<MusicVideos>;
      playlists?: Relationship<Playlists>;
      station?: Relationship<Stations>;
    };
    views?: {
      "appears-on-albums": View<Albums>;
      "compilation-albums": {
        href?: string;
        next?: string;
        attributes: {
          title: string;
        };
        data: Albums[];
      };
      "featured-albums": View<Albums>;
      "featured-playlists": View<Playlists>;
      "full-albums": View<Albums>;
      "latest-release": View<Albums>;
      "live-albums": View<Albums>;
      "similar-artists": View<Artists>;
      singles: View<Albums>;
      "top-music-videos": View<MusicVideos>;
      "top-songs": View<Songs>;
    };
  }

  /**
   * A resource object that represents a playlist.
   * https://developer.apple.com/documentation/applemusicapi/playlists-ulf
   */
  interface Playlists extends Resource {
    id: MusicItemID;
    type: "playlists";
    attributes?: {
      artwork?: Artwork;
      editorialVideo?: any;
      audioTraits?: string[];
      supportsSing?: boolean;
      curatorName: string;
      description?: DescriptionAttribute;
      isChart: boolean;
      lastModifiedDate?: string;
      name: string;
      editorialNotes?: EditorialNotes;
      playlistType:
        | "editorial"
        | "external"
        | "personal-mix"
        | "replay"
        | "user-shared";
      url: string;
      playParams?: PlayParameters;
      trackTypes?: Array<"music-videos" | "songs">;
    };
    relationships: {
      curator: Relationship<Activities | AppleCurators | Curators>;
      library?: Relationship<LibraryPlaylists>;
      tracks: Relationship<MusicVideos | Songs>;
    };
    views?: {
      "featured-artists": View<Artists>;
      "more-by-curator": View<Playlists>;
    };
  }

  /**
   * A resource object that represents an activity curator.
   * https://developer.apple.com/documentation/applemusicapi/activities-ui5
   */
  interface Activities extends Resource {
    type: "activities";
    attributes?: {
      artwork: Artwork;
      editorialNotes?: EditorialNotes;
      name: string;
      url: string;
    };
    relationships: {
      playlists: Relationship<Playlists>;
    };
  }

  interface ResourceResponse {
    data: {
      data: Resource[];
      resources: {
        artists?: Record<string, MusicKit.Artists>;
        playlists?: Record<string, MusicKit.Playlists>;
        songs?: Record<string, MusicKit.Songs>;
        albums?: Record<string, MusicKit.Albums>;
        "library-playlists"?: Record<string, MusicKit.LibraryPlaylists>;
        "library-albums"?: Record<string, MusicKit.LibraryAlbums>;
        "library-songs"?: Record<string, MusicKit.LibrarySongs>;
      };
    };
  }

  /**
   * A resource object that represents recommended resources for a user calculated using their selected preferences.
   * https://developer.apple.com/documentation/applemusicapi/personalrecommendation
   */
  interface PersonalRecommendation extends Resource {
    type: "personal-recommendation";
    id: string;
    attributes?: {
      kind: "music-recommendations" | "recently-played" | "unknown";
      nextUpdateDate: string;
      hasSeeAll: boolean;
      reason: {
        stringForDisplay: string;
      };
      resourceTypes: string[];
      title: {
        stringForDisplay: string;
      };
    };
    relationships?: {
      contents: { data: Array<Resource> };
    };
  }
  interface PlayParameters {
    catalogId?: string;
    id: string;
    kind: string;
    isLibrary?: boolean;
    globalId?: string;
    versionHash?: string;
  }

  interface Groupings {
    attributes: {
      genreNames: string[];
      name: string;
      url: string;
      shortName: string;
      kind: string;
      editorialArtwork: Artwork;
      artwork: Artwork;
    };
    id: string;
    href: string;
    type: string;
    relationships: {
      grouping: {
        href: string;
        data: Array<Groupings>;
      };
      playlists: {
        data: Array<{
          id: string;
          type: string;
          attributes: {
            doNotFilter: boolean;
            editorialElementKind: string;
          };
          relationships: {
            children: {
              data: Array<EditorialElements>;
            };
          };
        }>;
        href: string;
      };
      tabs: {
        data: Array<{
          id: string;
          type: string;
          attributes: {
            doNotFilter: boolean;
            editorialElementKind: string;
          };
          relationships: {
            children: {
              data: Array<EditorialElements>;
            };
          };
        }>;
        href: string;
      };
      curator: {
        data: {
          id: string;
          type: string;
        };
        href: string;
      };
    };
  }

  interface Multiplexes {
    attributes: {
      lastModifiedDate: string;
      href: string;
      id: string;
      uber?: {
        backgroundColor?: string;
        name?: string;
        description?: string;
        headerTextColor: string;
        masterArt?: Artwork;
        primaryTextColor?: string;
        primaryTextColorOnBlack?: string;
        titleTextColor?: string;
        titleTextColorOnBlack?: string;
      };
    };
    relationships: {
      children: {
        data: Array<EditorialElements>;
        href: string;
      };
    };
  }

  interface EditorialElements {
    type: "editorial-elements";
    id: string;
    attributes?: {
      artistName: string;
      artistUrl: string;
      description: string;
      artwork?: Artwork;
      designBadge?: string;
      uber: {
        backgroundColor: string;
        name: string;
        description: string;
        headerTextColor: string;
        masterArt: Artwork;
        primaryTextColor: string;
        primaryTextColorOnBlack: string;
        titleTextColor: string;
        titleTextColorOnBlack: string;
      };
      designTag: string;
      doNotFilter: boolean;
      editorialElementKind: string;
      lastModifiedDate: string;
      link: EditorialLinks;
      links?: EditorialLinks[];
      name: string;
      url: string;
    };
    relationships?: {
      contents?: {
        data: Array<Resource | MediaItem>;
      };
      room?: {
        data: {
          id: string;
          type: string;
          href: "rooms";
        };
      };
      children: {
        data: Array<EditorialElements>;
      };
    };
  }

  export interface EditorialLinks {
    url: string;
    label: string;
    target?: "internal" | "external";
  }

  /**
   * An object that represents editorial notes.
   * https://developer.apple.com/documentation/musickit/editorialnotes
   */
  interface EditorialNotes {
    hashValue?: number;
    name?: string;
    short?: string;
    standard?: string;
    tagline?: string;
  }

  /**
   * An object that represents a preview for resources.
   * https://developer.apple.com/documentation/applemusicapi/preview
   */
  interface Preview {
    artwork?: Artwork;
    url: string;
    hlsUrl?: string;
  }

  /**
   * An object that represents a description attribute.
   * https://developer.apple.com/documentation/applemusicapi/descriptionattribute/
   */
  interface DescriptionAttribute {
    short?: string;
    standard?: string;
  }

  interface SearchSuggestionsResponse {
    results: {
      suggestions: Array<TermSuggestion | TopResultSuggestion>;
    };
  }

  interface TermSuggestion {
    content: any;
    displayTerm: string;
    kind: "terms";
    searchTerm: string;
  }

  interface TopResultSuggestion {
    content: any;
    kind: "topResults";
  }

  interface SearchResponse<T> {
    results: {
      [key: string]: SearchResult<T>;
    };
  }

  interface SearchResult<T> {
    data: T[];
    href: string;
    next: string;
  }

  interface SearchChartResult<T> {
    chart: string;
    data: T[];
    href?: string;
    name: string;
    next?: string;
  }

  type QueryParameters = Record<string, any>;

  type FetchOptions = {
    fetchOptions: {
      method: "POST" | "GET" | "PUT" | "DELETE";
      body?: any;
      headers?: any;
    };
  };

  type APIResponseObject = {
    data: {
      data: Array<
        | Activities
        | Albums
        | AppleCurators
        | Artists
        | SearchChartResult<Resource>
        | Curators
        | Genres
        | MusicVideos
        | Playlists
        | SearchResult<Resource>
        | Songs
        | Stations
        | PersonalRecommendation
        | Resource
        | Storefronts
        | LibraryAlbums
        | LibraryPlaylists
      >;
    };
  };

  class MusicKitAPI {
    /**Passthrough API Method signature
     * @param path The path to the Apple Music API endpoint, without a hostname, and including a leading slash /.
     * @param queryParameters An object with query parameters which will be appended to the request URL.
     *
     * The supported or expected query parameters will vary depending on the API endpoint you are requesting from.
     * @see {@link https://developer.apple.com/documentation/applemusicapi Apple Music API Docs} for reference.
     * ---
     * @param options An object with additional properties to control how requests are made.
     * @param fetchOptions An object that is passed as options to the underlying fetch() function.
     *
     * @returns An Object Promise with property 'data', which is the repsonse body from the API request to the Apple Music API.
     *
     * @see Apple Music API: [Handling Requests and Responses](https://developer.apple.com/documentation/applemusicapi/handling_requests_and_responses) for more information on Apple Music API responses.
     *
     *
     * Catalog Resources
     * ---
     * Activities
     * ---
     * Fetch one or more activites using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/activities`, queryParameters);
     * ```
     * Activity
     * ---
     * Fetch an activity using its identifier.
     * @example
     * ```
     * const activityId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/activities/${activityId}`, queryParameters);
     * ```
     *
     * Albums
     * ---
     * Fetch one or more albums using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/albums`, queryParameters);
     * ```
     *
     * Album
     * ---
     * Fetch an album using its identifier.
     * @example
     * ```
     * const albumId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/albums/${albumId}`, queryParameters);
     * ```
     *
     * Apple Curators
     * ---
     * Fetch one or more apple curators using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/apple-curators`, queryParameters);
     * ```
     *
     * Apple Curator
     * ---
     * Fetch an apple curator using their identifier.
     * @example
     * ```
     * const curatorId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/apple-curators/${curatorId}`, queryParameters);
     * ```
     *
     * Artists
     * ---
     * Fetch one or more artists using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/artists`, queryParameters);
     * ```
     *
     * Artist
     * ---
     * Fetch an artist using their identifier.
     * @example
     * ```
     * const artistId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/artist/${artistId}`, queryParameters);
     * ```
     *
     * Charts
     * ---
     * Fetch one or more charts using their identifiers.
     * @example
     * ```
     * const queryParameters = { types: ['most-played'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/charts`, queryParameters);
     * ```
     *
     * Chart
     * ---
     * Fetch a chart using its identifier.
     * @example
     * ```
     * const chartId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/chart/${chartId}`, queryParameters);
     * ```
     *
     * Curators
     * ---
     * Fetch one or more curators using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/curators`, queryParameters);
     * ```
     *
     * Curator
     * ---
     * Fetch a curator using their identifier.
     * @example
     * ```
     * const curatorId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/curators/${curatorId}`, queryParameters);
     * ```
     *
     * Genres
     * ---
     * Fetch one or more genres using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/genres', queryParameters);
     * ```
     *
     * Genre
     * ---
     * Fetch a genre using its identifier.
     * @example
     * ```
     * const genreId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/genres/${genreId}`, queryParameters);
     * ```
     *
     * Music Videos
     * ---
     * Fetch one or more music videos using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/music-videos', queryParameters);
     * ```
     *
     * Music Video
     * ---
     * Fetch a music video using its identifier.
     * @example
     * ```
     * const musicVideoId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/music-videos/${musicVideoId}`, queryParameters);
     * ```
     *
     * Playlists
     * ---
     * Fetch one or more playlists using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/playlists', queryParameters);
     * ```
     *
     * Playlist
     * ---
     * Fetch a playlist using its identifier.
     * @example
     * ```
     * const playlistId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/playlists/${playlistId}`, queryParameters);
     * ```
     *
     * Search
     * ---
     * Search the catalog using a query.
     * @example
     * ```
     * const queryParameters = { term: 'Taylor Swift', types: ['albums', 'artists', 'songs'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/search', queryParameters);
     * ```
     *
     * Search Hints
     * ---
     * Fetch the search term results for a hint.
     * @example
     * ```
     * const queryParameters = { term: 'Taylor Swift', l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/search/hints', queryParameters);
     * ```
     *
     * Songs
     * ---
     * Fetch one or more songs using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/songs', queryParameters);
     * ```
     *
     * Song
     * ---
     * Fetch a song using its identifier.
     * @example
     * ```
     * const songId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/songs/${songId}`, queryParameters);
     * ```
     *
     * Stations
     * ---
     * Fetch one or more stations using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/stations', queryParameters);
     * ```
     *
     * Station
     * ---
     * Fetch a station using its identifier.
     * @example
     * ```
     * const stationId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/stations/${stationId}`, queryParameters);
     * ```
     *
     * Personalized content
     * ---
     *
     * Library
     * ---
     *
     * Adding
     * ---
     * Add a catalog resource to a user's library.
     * @example
     * ```
     * const playlistId = 'pl.23456789';
     *
     * const queryParameters = { ids: [playlistId], l: 'en-us' };
     *
     * await music.api.music('/v1/me/library', queryParameters, { fetchOptions: { method: 'POST' } });
     * ```
     *
     * Recommendations
     * ---
     *
     * All recommendations
     * ---
     * Fetch all recommendations.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/me/recommendations`, queryParameters);
     * ```
     *
     * Recommendation
     * ---
     * Fetch a recommendation using its identifier.
     * @example
     * ```
     * const recommendationId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/me/recommendations/${recommendationId}`, queryParameters);
     * ```
     *
     * Recent
     * ---
     *
     * Recently Played
     * ---
     * Fetch the recently played resources for the user.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music('/v1/me/recent/played', queryParameters);
     * ```
     *
     * History
     * ---
     *
     * Heavy Rotation
     * ---
     * Fetch the resources in heavy rotation for the user.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music('/v1/me/history/heavy-rotation', queryParameters);
     * ```
     *
     * Storefonts
     * ---
     *
     * Storefronts
     * ---
     * Fetch one or more storefronts using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/storefronts`, queryParameters);
     * ```
     *
     * Storefront
     * ---
     * Fetch a storefront using its identifier.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/storefronts/${storefrontId}`, queryParameters);
     * ``` */ /*Catalog Resources
     * ---
     * Activities
     * ---
     * Fetch one or more activites using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/activities`, queryParameters);
     * ```
     * Activity
     * ---
     * Fetch an activity using its identifier.
     * @example
     * ```
     *
     * const activityId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/activities/${activityId}`, queryParameters);
     * ```
     *
     * Albums
     * ---
     * Fetch one or more albums using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/albums`, queryParameters);
     * ```
     *
     * Album
     * ---
     * Fetch an album using its identifier.
     * @example
     * ```
     * const albumId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/albums/${albumId}`, queryParameters);
     * ```
     *
     * Apple Curators
     * ---
     * Fetch one or more apple curators using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/apple-curators`, queryParameters);
     * ```
     *
     * Apple Curator
     * ---
     * Fetch an apple curator using their identifier.
     * @example
     * ```
     * const curatorId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/apple-curators/${curatorId}`, queryParameters);
     * ```
     *
     * Artists
     * ---
     * Fetch one or more artists using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/artists`, queryParameters);
     * ```
     *
     * Artist
     * ---
     * Fetch an artist using their identifier.
     * @example
     * ```
     * const artistId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/artist/${artistId}`, queryParameters);
     * ```
     *
     * Charts
     * ---
     * Fetch one or more charts using their identifiers.
     * @example
     * ```
     * const queryParameters = { types: ['most-played'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/charts`, queryParameters);
     * ```
     *
     * Chart
     * ---
     * Fetch a chart using its identifier.
     * @example
     * ```
     * const chartId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/chart/${chartId}`, queryParameters);
     * ```
     *
     * Curators
     * ---
     * Fetch one or more curators using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/curators`, queryParameters);
     * ```
     *
     * Curator
     * ---
     * Fetch a curator using their identifier.
     * @example
     * ```
     * const curatorId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/curators/${curatorId}`, queryParameters);
     * ```
     *
     * Genres
     * ---
     * Fetch one or more genres using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/genres', queryParameters);
     * ```
     *
     * Genre
     * ---
     * Fetch a genre using its identifier.
     * @example
     * ```
     * const genreId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/genres/${genreId}`, queryParameters);
     * ```
     *
     * Music Videos
     * ---
     * Fetch one or more music videos using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/music-videos', queryParameters);
     * ```
     *
     * Music Video
     * ---
     * Fetch a music video using its identifier.
     * @example
     * ```
     * const musicVideoId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/music-videos/${musicVideoId}`, queryParameters);
     * ```
     *
     * Playlists
     * ---
     * Fetch one or more playlists using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/playlists', queryParameters);
     * ```
     *
     * Playlist
     * ---
     * Fetch a playlist using its identifier.
     * @example
     * ```
     * const playlistId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/playlists/${playlistId}`, queryParameters);
     * ```
     *
     * Search
     * ---
     * Search the catalog using a query.
     * @example
     * ```
     * const queryParameters = { term: 'Taylor Swift', types: ['albums', 'artists', 'songs'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/search', queryParameters);
     * ```
     *
     * Search Hints
     * ---
     * Fetch the search term results for a hint.
     * @example
     * ```
     * const queryParameters = { term: 'Taylor Swift', l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/search/hints', queryParameters);
     * ```
     *
     * Songs
     * ---
     * Fetch one or more songs using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/songs', queryParameters);
     * ```
     *
     * Song
     * ---
     * Fetch a song using its identifier.
     * @example
     * ```
     * const songId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/songs/${songId}`, queryParameters);
     * ```
     *
     * Stations
     * ---
     * Fetch one or more stations using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music('/v1/catalog/{{storefrontId}}/stations', queryParameters);
     * ```
     *
     * Station
     * ---
     * Fetch a station using its identifier.
     * @example
     * ```
     * const stationId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/catalog/{{storefrontId}}/stations/${stationId}`, queryParameters);
     * ```
     *
     * Personalized content
     * ---
     *
     * Library
     * ---
     *
     * Adding
     * ---
     * Add a catalog resource to a user's library.
     * @example
     * ```
     * const playlistId = 'pl.23456789';
     *
     * const queryParameters = { ids: [playlistId], l: 'en-us' };
     *
     * await music.api.music('/v1/me/library', queryParameters, { fetchOptions: { method: 'POST' } });
     * ```
     *
     * Recommendations
     * ---
     *
     * All recommendations
     * ---
     * Fetch all recommendations.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/me/recommendations`, queryParameters);
     * ```
     *
     * Recommendation
     * ---
     * Fetch a recommendation using its identifier.
     * @example
     * ```
     * const recommendationId = '123456789';
     *
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/me/recommendations/${recommendationId}`, queryParameters);
     * ```
     *
     * Recent
     * ---
     *
     * Recently Played
     * ---
     * Fetch the recently played resources for the user.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music('/v1/me/recent/played', queryParameters);
     * ```
     *
     * History
     * ---
     *
     * Heavy Rotation
     * ---
     * Fetch the resources in heavy rotation for the user.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music('/v1/me/history/heavy-rotation', queryParameters);
     * ```
     *
     * Storefonts
     * ---
     *
     * Storefronts
     * ---
     * Fetch one or more storefronts using their identifiers.
     * @example
     * ```
     * const queryParameters = { ids: ['1233456789', '987654321'], l: 'en-us' };
     *
     * await music.api.music(`/v1/storefronts`, queryParameters);
     * ```
     *
     * Storefront
     * ---
     * Fetch a storefront using its identifier.
     * @example
     * ```
     * const queryParameters = { l: 'en-us' };
     *
     * await music.api.music(`/v1/storefronts/${storefrontId}`, queryParameters);
     * ``` */
    v3: {
      music: (
        path: string,
        queryParameters?: QueryParameters,
        options?: FetchOptions,
      ) => Promise<APIResponseObject>;
    };
  }
}
