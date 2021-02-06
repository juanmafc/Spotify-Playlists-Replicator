import {mock, mockReset} from "jest-mock-extended";
import {YoutubePlaylistVideosAPI} from "../public/YoutubeAPI/YoutubePlaylistVideosAPI";
import {YoutubeAPIPlaylistVideosResponse, YoutubeVideo} from "../public/YoutubeAPI/YoutubeSchemas";
import {YoutubePageToken} from "../public/YoutubeAPI/YoutubePageToken";
import {YoutubePlaylistsVideosService} from "../public/YoutubeAPI/YoutubePlaylistsVideosService";

describe('Youtube Playlist Videos Service Tests', () => {

    const youtubePlaylistVideosAPIMock = mock<YoutubePlaylistVideosAPI>();
    let youtubeService: YoutubePlaylistsVideosService;

    beforeEach( () => {
        mockReset(youtubePlaylistVideosAPIMock);
        youtubeService = new YoutubePlaylistsVideosService(youtubePlaylistVideosAPIMock);
    })

    function mockPlaylistsItemsResponseForFirstPage(playlistId: string, response: YoutubeAPIPlaylistVideosResponse) {
        youtubePlaylistVideosAPIMock.getFirstPlaylistVideosPage.calledWith(playlistId).mockResolvedValue(response);
    }

    function mockPlaylistsItemsResponseForPageToken(playlistId: string, pageToken: YoutubePageToken, response: YoutubeAPIPlaylistVideosResponse) {
        youtubePlaylistVideosAPIMock.getPlaylistVideos.calledWith(playlistId, pageToken).mockResolvedValue(response);
    }

    function createYoutubeVideo(id: string, title: string): YoutubeVideo {
        return {
            id: id,
            title: title
        };
    }

    function createLastPageResponse(videos: YoutubeVideo[]) {
        return new YoutubeAPIPlaylistVideosResponse(YoutubePageToken.NO_PAGE, videos);
    }

    test('Given a single response with no videos when getting all videos then an empty collection should be returned', async () => {
        let playlistId = "playlistId";
        mockPlaylistsItemsResponseForFirstPage(playlistId, createLastPageResponse([]));

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(0)
    })

    test('Given a single response with one video when getting all videos then that video should be returned', async () => {
        let playlistId = "playlistId";
        let responseVideos = [
            createYoutubeVideo('id1', 'title1')
        ];
        mockPlaylistsItemsResponseForFirstPage(playlistId, createLastPageResponse(responseVideos));

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(1)
    })

    test('Given a single response with many videos when getting all videos then all videos should be returned', async () => {
        let playlistId = "playlistId";
        let responseVideos = [
            createYoutubeVideo('id1', 'title1'),
            createYoutubeVideo('id2', 'title2')
        ];
        mockPlaylistsItemsResponseForFirstPage(playlistId, createLastPageResponse(responseVideos));

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(2)
    })

    test('Given multiple responses with videos when getting all videos then all videos should be returned', async () => {
        let playlistId = "playlistId";
        let firstResponseVideos = [
            createYoutubeVideo('id1', 'title1'),
            createYoutubeVideo('id2', 'title2')
        ];
        let secondResponseVideos = [
            createYoutubeVideo('id3', 'title3')
        ];
        let firstPageResponse = new YoutubeAPIPlaylistVideosResponse(new YoutubePageToken("secondPage"), firstResponseVideos);
        let secondPageResponse = createLastPageResponse(secondResponseVideos);
        mockPlaylistsItemsResponseForFirstPage(playlistId, firstPageResponse);
        mockPlaylistsItemsResponseForPageToken(playlistId, firstPageResponse.nextPageToken, secondPageResponse);

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(3)
    })
})