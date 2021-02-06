import express from "express";
import open from "open";
import {Auth} from "googleapis";
import {YoutubePlaylistsAPIClient} from "../../../public/YoutubeAPI/YoutubePlaylistsAPIClient";
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

    let youtubePlaylistsAPI: YoutubePlaylistsAPIClient;

    beforeEach(() => {
        youtubePlaylistsAPI = new YoutubePlaylistsAPIClient(oAuth2Client);
    });

    test('Get first page of my playlists', async () => {
        let playlists = await youtubePlaylistsAPI.getPlaylists(YoutubePageToken.FIRST_PAGE);

        expect(playlists.playlists.length).toBe(50);
    });

    test('Get second page of my playlists', async () => {
        let playlists = await youtubePlaylistsAPI.getPlaylists(YoutubePageToken.FIRST_PAGE);
        playlists = await youtubePlaylistsAPI.getPlaylists(playlists.nextPageToken);

        expect(playlists.playlists.length).toBe(28);
    });

});


