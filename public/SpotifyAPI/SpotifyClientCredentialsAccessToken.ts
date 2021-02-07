import SpotifyWebApi from "spotify-web-api-node";

interface SpotifyAccessTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string
}

export class SpotifyClientCredentialsAccessToken {

    private readonly clientId = 'a29b6f296987468a9f15cfe94fca6eb9';
    private readonly clientSecret = 'd3a8c51f99b24a7891dc73c6a26b7434';
    private spotifyApi: SpotifyWebApi;

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: this.clientId,
            clientSecret: this.clientSecret
        });
    }

    public async getAccessToken(): Promise<string>  {
        let response = await this.spotifyApi.clientCredentialsGrant();
        return response.body['access_token'];
    }
}