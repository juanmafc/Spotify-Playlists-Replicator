import axios from "axios";
import querystring from "querystring";

interface SpotifyAccessTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string
}

interface RequestData {
    grant_type: string,
    code: string,
    redirect_uri: string
}

export class SpotifyClientAuthorizationCodeFlow {

    private readonly clientId = 'a29b6f296987468a9f15cfe94fca6eb9';
    private readonly clientSecret = 'd3a8c51f99b24a7891dc73c6a26b7434';

    private accessToken: string = '';

    private encodeCredentials() {
        return Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
    }

    public async setAccessToken(userAuthCode: string) {
        let authRequestHeaders = {
            headers: {
                Authorization: 'Basic ' + this.encodeCredentials(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        let authData: RequestData = {
            grant_type: 'authorization_code',
            code: userAuthCode,
            redirect_uri: "http://localhost:8888/callback"
        }

        this.accessToken = await this.executeRequest(authData, authRequestHeaders);
    }

    private async executeRequest(authData: RequestData, authHeaders: any) {
        let encodedData = this.encodeData(authData);
        let response = await axios.post<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', encodedData, authHeaders);
        return response.data.access_token;
    }

    public getAuthURL() {
        let clientId = 'a29b6f296987468a9f15cfe94fca6eb9';
        let authorizationCodeParams = querystring.stringify({
            response_type: "code",
            client_id: clientId,
            scope: "playlist-modify-private",
            redirect_uri: "http://localhost:8888/callback"
        })

        return 'https://accounts.spotify.com/authorize?' + authorizationCodeParams;
    }

    private encodeData(data: any) {
        return querystring.stringify(data);
    }

    public getAccessToken() {
        return this.accessToken;
    }
}
