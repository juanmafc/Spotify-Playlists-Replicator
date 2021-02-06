import {YoutubePageToken} from "./YoutubePageToken";
import {YoutubeAPIPlaylistVideosResponse} from "./YoutubeSchemas";

export interface YoutubePlaylistVideosAPI {
    getPlaylistVideos(playlistId: string, pageToken: YoutubePageToken): Promise<YoutubeAPIPlaylistVideosResponse>;

    getFirstPlaylistVideosPage(playlistId: string): Promise<YoutubeAPIPlaylistVideosResponse>;
}