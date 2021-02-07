import express from "express";
import open from "open";
import {YoutubePlaylistVideosAPIClient} from "../../../public/YoutubeAPI/playlistVideos/YoutubePlaylistVideosAPIClient";
import {YoutubeV3Auth} from "../../../public/YoutubeAPI/YoutubeV3Auth";
import {MAIN_CONFIG} from "../../../public/YoutubeAPI/configs/YoutubeConfig";

let youtubeAuth = new YoutubeV3Auth(MAIN_CONFIG);

function openYoutubeAuthURL() {
    open(youtubeAuth.getAuthURL());
}

describe('Youtube Playlist Videos API Client Tests', () => {

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

    let youtubePlaylistVideosAPI: YoutubePlaylistVideosAPIClient;
    const PLAYLIST_2019_RANDOMS_ID = 'PLhvKBaHa7_T-dibETOgOScrihV712ZPu1';

    beforeEach(() => {
        youtubePlaylistVideosAPI = new YoutubePlaylistVideosAPIClient(youtubeAuth);
    });

    test('Get first page of videos from 2019 Randoms playlist ', async () => {
        let response = await youtubePlaylistVideosAPI.getFirstPlaylistVideosPage(PLAYLIST_2019_RANDOMS_ID);

        expect(response.videos.length).toBe(50);
    });

    test('Get second page of videos from 2019 Randoms playlist ', async () => {
        let firstPage = await youtubePlaylistVideosAPI.getFirstPlaylistVideosPage(PLAYLIST_2019_RANDOMS_ID);
        let secondPage = await youtubePlaylistVideosAPI.getNextPlaylistVideosPage(firstPage);

        expect(secondPage.videos.length).toBe(49);
    });

});










