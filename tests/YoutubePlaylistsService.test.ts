import {mock, mockReset} from "jest-mock-extended";
import {YoutubePlaylistsAPI} from "../public/YoutubeAPI/playlists/YoutubePlaylistsAPI";
import {YoutubeAPIPlaylistResponse, YoutubePlaylist} from "../public/YoutubeAPI/YoutubeSchemas";
import {YoutubePageToken} from "../public/YoutubeAPI/YoutubePageToken";
import {YoutubePlaylistsService} from "../public/YoutubeAPI/playlists/YoutubePlaylistsService";

describe('Youtube Playlists Service Tests', () => {

    const youtubePlaylistsAPImock = mock<YoutubePlaylistsAPI>();
    let youtubeService: YoutubePlaylistsService;

    beforeEach( () => {
        mockReset(youtubePlaylistsAPImock);
        youtubeService = new YoutubePlaylistsService(youtubePlaylistsAPImock);
    })

    function mockPlaylistsResponseForFirstPage(response: YoutubeAPIPlaylistResponse) {
        youtubePlaylistsAPImock.getFirstPlaylistsPage.calledWith().mockResolvedValue(response);
    }

    function mockPlaylistsResponseForPageToken(pageToken: YoutubePageToken, response: YoutubeAPIPlaylistResponse) {
        youtubePlaylistsAPImock.getPlaylists.calledWith(pageToken).mockResolvedValue(response);
    }

    function createYoutubePlaylist(id: string, title: string): YoutubePlaylist {
        return {
            id: id,
            title: title
        };
    }

    function createLastPageResponse(playlists: YoutubePlaylist[]) {
        return new YoutubeAPIPlaylistResponse(YoutubePageToken.NO_PAGE, playlists);
    }

    test('Given a single response with no playlists when getting all playlist then an empty collection should be returned', async () => {
        mockPlaylistsResponseForFirstPage(createLastPageResponse([]));
        let playlists = await youtubeService.listAllPlaylists();

        expect(playlists.length).toBe(0)
    })

    test('Given a single response with one playlist when getting all playlist then that playlist should be returned', async () => {
        let responsePlaylists = [
            createYoutubePlaylist('id1', 'title1')
        ];
        mockPlaylistsResponseForFirstPage(createLastPageResponse(responsePlaylists));

        let playlists = await youtubeService.listAllPlaylists();

        expect(playlists.length).toBe(1)
    })

    test('Given a single response with many playlists when getting all playlist then all playlists should be returned', async () => {
        let responsePlaylists = [
            createYoutubePlaylist('id1', 'title1'),
            createYoutubePlaylist('id2', 'title2')
        ];
        mockPlaylistsResponseForFirstPage(createLastPageResponse(responsePlaylists));

        let playlists = await youtubeService.listAllPlaylists();

        expect(playlists.length).toBe(2)
    })

    test('Given a multiple responses with playlists when getting all playlist then all playlists should be returned', async () => {
        let firstResponsePlaylists = [
            createYoutubePlaylist('id1', 'title1'),
            createYoutubePlaylist('id2', 'title2')
        ];
        let secondResponsePlaylists = [
            createYoutubePlaylist('id3', 'title3')
        ];
        let firstPageResponse = new YoutubeAPIPlaylistResponse(new YoutubePageToken("segundapagina"), firstResponsePlaylists);
        let secondPageResponse = createLastPageResponse(secondResponsePlaylists);
        mockPlaylistsResponseForFirstPage(firstPageResponse);
        mockPlaylistsResponseForPageToken(firstPageResponse.nextPageToken, secondPageResponse);

        let playlists = await youtubeService.listAllPlaylists();

        expect(playlists.length).toBe(3)
    })
})