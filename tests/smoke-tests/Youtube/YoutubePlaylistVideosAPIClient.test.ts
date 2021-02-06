import express from "express";
import open from "open";
import {Auth} from "googleapis";
import {YoutubePlaylistVideosAPIClient} from "../../../public/YoutubeAPI/YoutubePlaylistVideosAPIClient";
import {YoutubePageToken} from "../../../public/YoutubeAPI/YoutubePageToken";


let CLIENT_ID = '823820379687-o0e7cg9fsqu4ocjonfhu1bcs3o5bqoqp.apps.googleusercontent.com';
let CLIENT_SECRET = '9GcLsxp9KSSJebhQ1a6UV1IQ';
let REDIRECT_URL = 'http://localhost:8080/callback';

let oAuth2Client = new Auth.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

function openYoutubeAuthURL() {
    let url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    });
    open(url);
}

describe('YoutubeAPITests', () => {

    beforeAll(done => {
        jest.setTimeout(20000);
        const app = express();

        app.get('/callback', async function (request, response) {
            response.sendStatus(200);

            let userAuthCode = request.query.code;
            if (typeof userAuthCode === "string") {
                const {tokens} = await oAuth2Client.getToken(userAuthCode);
                oAuth2Client.setCredentials(tokens);
            }
            else {
                console.log("Undefined user auth code");
            }
            done();
            server.close();
        })
        const server = app.listen(8080)
        openYoutubeAuthURL();
    });

    let youtubePlaylistVideosAPI: YoutubePlaylistVideosAPIClient;
    const PLAYLIST_2019_RANDOMS_ID = 'PLhvKBaHa7_T-dibETOgOScrihV712ZPu1';


    beforeEach(() => {
        youtubePlaylistVideosAPI = new YoutubePlaylistVideosAPIClient(oAuth2Client);
    });

    test('Get first page of videos from 2019 Randoms playlist ', async () => {
        let response = await youtubePlaylistVideosAPI.getPlaylistVideos(PLAYLIST_2019_RANDOMS_ID, YoutubePageToken.FIRST_PAGE);
        expect(response.videos.length).toBe(50);
    });

    test('Get second page of videos from 2019 Randoms playlist ', async () => {
        let response = await youtubePlaylistVideosAPI.getPlaylistVideos(PLAYLIST_2019_RANDOMS_ID, YoutubePageToken.FIRST_PAGE);
        response = await youtubePlaylistVideosAPI.getPlaylistVideos(PLAYLIST_2019_RANDOMS_ID, response.nextPageToken);
        expect(response.videos.length).toBe(49);
    });

});










