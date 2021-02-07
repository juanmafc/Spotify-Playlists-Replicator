import express from 'express';
import open from 'open';
import {SpotifyClientAuthorizationCodeFlow} from "../../public/SpotifyAPI/SpotifyClientAuthorizationCodeFlow";
import {SpotifyPlaylistAPIClient} from "../../public/SpotifyAPI/SpotifyPlaylistAPIClient";
import {SpotifyNewPlaylistInfo} from "../../public/SpotifyAPI/SpotifyNewPlaylistInfo";


let spotifyAuth = new SpotifyClientAuthorizationCodeFlow();

function openSpotifyAuthURL() {
    let url = spotifyAuth.getAuthURL();
    open(url);
}

describe('Spotify Playlist API Client Tests', () => {

    beforeAll(done => {
        jest.setTimeout(20000);
        const app = express();
        app.get('/callback', async function (request, response) {
            response.sendStatus(200);
            let userAuthCode = request.query.code;
            if (typeof userAuthCode === "string") {
                await spotifyAuth.setAccessToken(userAuthCode);
            }
            else {
                console.log("NO SE CONSIGUIO EL CODIGO");
            }
            done();
            server.close();
        })
        const server = app.listen(8888)

        openSpotifyAuthURL();
    });

    let spotifyPlaylistsAPIClient: SpotifyPlaylistAPIClient;

    beforeEach(() => {
        spotifyPlaylistsAPIClient = new SpotifyPlaylistAPIClient(spotifyAuth);
    });

    test('Create Spotify playlist in users account', async () => {

        let newPlaylistInfo: SpotifyNewPlaylistInfo = {
            name: 'Create Spotify playlist smoke test',
            public: false,
            description: "Playlist created for testing"
        };

        let newPlaylist = await spotifyPlaylistsAPIClient.create(newPlaylistInfo);

        console.log(newPlaylist.id);
        expect(newPlaylist.name).toBe(newPlaylistInfo.name);
        expect(newPlaylist.isPublic).toBe(newPlaylistInfo.public);
        expect(newPlaylist.description).toBe(newPlaylistInfo.description);
    });

    test('Add track to a Spotify playlist', async () => {
        let playlistId = '33UarO8Z9svZQcHZVyzml7';
        let tracksIds = ['spotify:track:46dt4K4GlkhOdE0KaQAHyu'];

        let snapshot = await spotifyPlaylistsAPIClient.addTracksToPlaylist(playlistId, tracksIds);

        expect(snapshot.snapshot_id).toBeDefined();
    });
});