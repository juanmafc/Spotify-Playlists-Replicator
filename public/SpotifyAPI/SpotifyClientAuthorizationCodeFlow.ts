import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyClientAuthorizationCodeFlow {

    private readonly clientId = 'a29b6f296987468a9f15cfe94fca6eb9';
    private readonly clientSecret = 'd3a8c51f99b24a7891dc73c6a26b7434';

    private accessToken: string = '';

    private spotifyApi: SpotifyWebApi;

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            redirectUri: 'http://localhost:8888/callback'
        });
    }

    public async setAccessToken(userAuthCode: string) {
        let response = await this.spotifyApi.authorizationCodeGrant(userAuthCode);
        this.accessToken = response.body['access_token'];
    }

    public getAuthURL() {
        let scopes = ['playlist-modify-private'];
        let state = 'some-state-of-my-choice';

        return this.spotifyApi.createAuthorizeURL(scopes, state);
    }

    public getAccessToken() {
        return this.accessToken;
    }
}
