import {YoutubePlaylistVideosPage} from "./YoutubePlaylistVideosPage";

export interface YoutubePlaylistVideosAPI {
    getNextPlaylistVideosPage(page: YoutubePlaylistVideosPage): Promise<YoutubePlaylistVideosPage>;

    getFirstPlaylistVideosPage(playlistId: string): Promise<YoutubePlaylistVideosPage>;
}