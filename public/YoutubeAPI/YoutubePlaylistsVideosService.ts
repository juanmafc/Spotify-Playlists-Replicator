import {YoutubePlaylistVideosAPI} from "./YoutubePlaylistVideosAPI";

export class YoutubePlaylistsVideosService {

    constructor(private youtubePlaylistVideosAPI: YoutubePlaylistVideosAPI) {}

    public async listAllPlaylistVideos(playlistId: string) {
        let response = await this.youtubePlaylistVideosAPI.getFirstPlaylistVideosPage(playlistId);
        let allVideos = response.videos;
        while (response.hasNextPage()) {
            response = await this.youtubePlaylistVideosAPI.getPlaylistVideos(playlistId, response.nextPageToken);
            allVideos = allVideos.concat(response.videos);
        }
        return allVideos;
    }
}