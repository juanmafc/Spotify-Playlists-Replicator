import {YoutubePlaylistVideosAPI} from "./YoutubePlaylistVideosAPI";

export class YoutubePlaylistsVideosService {

    constructor(private youtubePlaylistVideosAPI: YoutubePlaylistVideosAPI) {}

    public async listAllPlaylistVideos(playlistId: string) {
        let videosPage = await this.youtubePlaylistVideosAPI.getFirstPlaylistVideosPage(playlistId);
        let allVideos = videosPage.videos;
        while (videosPage.hasNextPage()) {
            videosPage = await this.youtubePlaylistVideosAPI.getNextPlaylistVideosPage(videosPage);
            allVideos = allVideos.concat(videosPage.videos);
        }
        return allVideos;
    }
}