import {YoutubePlaylistsAPI} from "./YoutubePlaylistsAPI";

export class YoutubePlaylistsService {

    constructor(private youtubePlaylistsAPI: YoutubePlaylistsAPI) {}

    public async listAllPlaylists() {
        let response = await this.youtubePlaylistsAPI.getFirstPlaylistsPage();
        let allPlaylists = response.playlists;
        while (response.hasNextPage()) {
            response = await this.youtubePlaylistsAPI.getPlaylists(response.nextPageToken);
            allPlaylists = allPlaylists.concat(response.playlists);
        }
        return allPlaylists;
    };

}