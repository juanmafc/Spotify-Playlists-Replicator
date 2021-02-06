import express from "express";
import open from "open";
import {YoutubePlaylistsAPIClient} from "../../../public/YoutubeAPI/YoutubePlaylistsAPIClient";
import {YoutubePageToken} from "../../../public/YoutubeAPI/YoutubePageToken";
import {YoutubeV3Auth} from "../../../public/YoutubeAPI/YoutubeV3Auth";
import {MAIN_CONFIG} from "../../../public/YoutubeAPI/configs/YoutubeConfig";

let youtubeAuth = new YoutubeV3Auth(MAIN_CONFIG);

function openYoutubeAuthURL() {
    open(youtubeAuth.getAuthURL());
}

describe('Youtube Playlist API Client Tests', () => {

    beforeAll(done => {
        jest.setTimeout(20000);
        const app = express();

        app.get('/callback', async function (request, response) {
            response.sendStatus(200);

            let userAuthCode = request.query.code;
            if (typeof userAuthCode === "string") {
                await youtubeAuth.setAccessToken(userAuthCode);
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
        youtubePlaylistsAPI = new YoutubePlaylistsAPIClient(youtubeAuth);
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


