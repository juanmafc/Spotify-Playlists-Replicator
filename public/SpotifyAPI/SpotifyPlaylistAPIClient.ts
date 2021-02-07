import {SpotifyClientAuthorizationCodeFlow} from "./SpotifyClientAuthorizationCodeFlow";
import {SpotifyNewPlaylistInfo} from "./SpotifyNewPlaylistInfo";
import SpotifyWebApi from "spotify-web-api-js";

class SpotifyPlaylist {
    constructor(public id: string | undefined,
                public name: string | undefined,
                public isPublic: boolean | undefined,
                public description: string | null | undefined) {}
}

export class SpotifyPlaylistAPIClient {

    private spotify = new SpotifyWebApi();

    constructor(private spotifyAuth: SpotifyClientAuthorizationCodeFlow) {
        let accessToken = this.spotifyAuth.getAccessToken();
        this.spotify.setAccessToken(accessToken);
    }

    public async create(newPlaylistInfo: SpotifyNewPlaylistInfo) {
        let user = await this.spotify.getMe();
        let response = await this.spotify.createPlaylist(user.id, newPlaylistInfo);
        return new SpotifyPlaylist(response?.id, response?.name, response?.public, response?.description);
    }

    public async addTracksToPlaylist(playlistId: string, tracksIds: string[]) {
        let playlistSnapshot = await this.spotify.addTracksToPlaylist(playlistId, tracksIds)
        return playlistSnapshot;
    }
}