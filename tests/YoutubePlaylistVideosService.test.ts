import {mock, mockReset} from "jest-mock-extended";
import {YoutubePlaylistVideosAPI} from "../public/YoutubeAPI/playlistVideos/YoutubePlaylistVideosAPI";
import {YoutubePageToken} from "../public/YoutubeAPI/YoutubePageToken";
import {YoutubePlaylistsVideosService} from "../public/YoutubeAPI/playlistVideos/YoutubePlaylistsVideosService";
import {YoutubePlaylistVideosPage} from "../public/YoutubeAPI/playlistVideos/YoutubePlaylistVideosPage";
import {YoutubeVideo} from "../public/YoutubeAPI/playlistVideos/YoutubeVideo";

describe('Youtube Playlist Videos Service Tests', () => {

    const youtubePlaylistVideosAPIMock = mock<YoutubePlaylistVideosAPI>();
    let youtubeService: YoutubePlaylistsVideosService;

    beforeEach( () => {
        mockReset(youtubePlaylistVideosAPIMock);
        youtubeService = new YoutubePlaylistsVideosService(youtubePlaylistVideosAPIMock);
    })

    function mockPlaylistsItemsResponseForFirstPage(page: YoutubePlaylistVideosPage) {
        youtubePlaylistVideosAPIMock.getFirstPlaylistVideosPage.calledWith(page.playlistId).mockResolvedValue(page);
    }

    function mockPlaylistsItemsResponseForPageToken(page: YoutubePlaylistVideosPage, nextPage: YoutubePlaylistVideosPage) {
        youtubePlaylistVideosAPIMock.getNextPlaylistVideosPage.calledWith(page).mockResolvedValue(nextPage);
    }

    function createYoutubeVideo(id: string, title: string): YoutubeVideo {
        return {
            id: id,
            title: title
        };
    }

    function createLastPage(playlistId: string, videos: YoutubeVideo[]) {
        return new YoutubePlaylistVideosPage(playlistId, YoutubePageToken.NO_PAGE, videos);
    }

    test('Given a single response with no videos when getting all videos then an empty collection should be returned', async () => {
        let playlistId = "playlistId";
        mockPlaylistsItemsResponseForFirstPage(createLastPage(playlistId, []));

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(0)
    })

    test('Given a single response with one video when getting all videos then that video should be returned', async () => {
        let playlistId = "playlistId";
        let responseVideos = [
            createYoutubeVideo('id1', 'title1')
        ];
        mockPlaylistsItemsResponseForFirstPage(createLastPage(playlistId, responseVideos));

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(1)
    })

    test('Given a single response with many videos when getting all videos then all videos should be returned', async () => {
        let playlistId = "playlistId";
        let responseVideos = [
            createYoutubeVideo('id1', 'title1'),
            createYoutubeVideo('id2', 'title2')
        ];
        mockPlaylistsItemsResponseForFirstPage(createLastPage(playlistId, responseVideos));

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
        let firstPageResponse = new YoutubePlaylistVideosPage(playlistId, new YoutubePageToken("secondPage"), firstResponseVideos);
        let secondPageResponse = createLastPage(playlistId, secondResponseVideos);
        mockPlaylistsItemsResponseForFirstPage(firstPageResponse);
        mockPlaylistsItemsResponseForPageToken(firstPageResponse, secondPageResponse);

        let videos = await youtubeService.listAllPlaylistVideos(playlistId);

        expect(videos.length).toBe(3)
    })
})