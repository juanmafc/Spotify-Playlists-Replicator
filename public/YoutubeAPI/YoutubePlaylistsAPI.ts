import {YoutubeAPIPlaylistResponse} from "./YoutubeSchemas";
import {YoutubePageToken} from "./YoutubePageToken";

export interface YoutubePlaylistsAPI {
    getPlaylists(youtubePageToken: YoutubePageToken): Promise<YoutubeAPIPlaylistResponse>;
}

