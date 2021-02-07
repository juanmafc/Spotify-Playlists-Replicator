import axios from "axios";

interface SpotifyAccessTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string
}

export class SpotifyClientCredentialsAccessToken {

    private readonly clientId = 'a29b6f296987468a9f15cfe94fca6eb9';
    private readonly clientSecret = 'd3a8c51f99b24a7891dc73c6a26b7434';

    private encodeCredentials() {
        return Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
    }

    public async getAccessToken(): Promise<string>  {
        let postData = "grant_type=client_credentials"
        let postHeaders = {
            Authorization: 'Basic ' + this.encodeCredentials(),
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        let response = await axios.post<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', postData, { headers: postHeaders })
        return response.data.access_token;
    }
}