import {Auth} from "googleapis";
import {YoutubeConfig} from "./configs/YoutubeConfig";

export class YoutubeV3Auth {

    public oAuth2Client: Auth.OAuth2Client;

    constructor(private config: YoutubeConfig) {
        this.oAuth2Client = new Auth.OAuth2Client(config.clientId, config.clientSecret, config.redirectUrl);
    }

    public getAuthURL() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: YoutubeV3Auth.SCOPES.READ_ONLY
        });
    }

    public static SCOPES = {
        READ_ONLY: 'https://www.googleapis.com/auth/youtube.readonly'
    }

    public async setAccessToken(userAuthCode: string) {
        const {tokens} = await this.oAuth2Client.getToken(userAuthCode);
        this.oAuth2Client.setCredentials(tokens);
    }

}