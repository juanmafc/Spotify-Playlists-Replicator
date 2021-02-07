import {SpotifyClientCredentialsAccessToken} from "./SpotifyClientCredentialsAccessToken";
import {SpotifyTrack} from "./SpotifyTrack";
import SpotifyWebApi from "spotify-web-api-js";

export class SpotifyTrackSearchAPIClient {

    private spotify = new SpotifyWebApi();

    constructor(private auth: SpotifyClientCredentialsAccessToken) {}

    public async search(searchString: string): Promise<SpotifyTrack[]> {
        await this.setAccessToken();
        return this.searchTracks(searchString);
    }

    private async setAccessToken() {
        let accessToken = await this.auth.getAccessToken();
        this.spotify.setAccessToken(accessToken);
    }

    private async searchTracks(searchString: string) {
        let response = await this.spotify.searchTracks(searchString);
        return response.tracks.items.map(track =>
            new SpotifyTrack(track.id, track.name)
        );
    }
}