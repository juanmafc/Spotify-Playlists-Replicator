import {SpotifyClientAuthorizationCodeFlow} from "./SpotifyClientAuthorizationCodeFlow";
import {SpotifyNewPlaylistInfo} from "./SpotifyNewPlaylistInfo";
import SpotifyWebApi from "spotify-web-api-node";

class SpotifyPlaylist {
    constructor(public id: string,
                public name: string,
                public isPublic: boolean | null,
                public description: string | null) {}
}

export class SpotifyPlaylistAPIClient {

    private spotify = new SpotifyWebApi();

    constructor(private spotifyAuth: SpotifyClientAuthorizationCodeFlow) {
        let accessToken = this.spotifyAuth.getAccessToken();
        this.spotify.setAccessToken(accessToken);
    }

    public async create(newPlaylistInfo: SpotifyNewPlaylistInfo) {
        let response = await this.spotify.createPlaylist(newPlaylistInfo.name, {
            'description': newPlaylistInfo.description,
            'public': newPlaylistInfo.public
        });
        //Todo: define what to do on error
        let body = response.body;
        return new SpotifyPlaylist(body.id, body.name, body.public, body.description);
    }

    public async addTracksToPlaylist(playlistId: string, tracksIds: string[]) {
        let response = await this.spotify.addTracksToPlaylist(playlistId, tracksIds)
        //Todo: define what to do on error
        return response.body.snapshot_id;
    }
}