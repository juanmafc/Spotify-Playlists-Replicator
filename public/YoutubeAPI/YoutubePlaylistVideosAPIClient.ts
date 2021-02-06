import {youtube_v3} from "googleapis";
import {YoutubePageToken} from "./YoutubePageToken";
import {YoutubePlaylistVideosAPI} from "./YoutubePlaylistVideosAPI";
import {YoutubeV3Auth} from "./YoutubeV3Auth";
import {YoutubePlaylistVideosPage} from "./YoutubePlaylistVideosPage";
import {YoutubePlaylistVideosResponse} from "./YoutubePlaylistVideosResponse";
import Params$Resource$Playlistitems$List = youtube_v3.Params$Resource$Playlistitems$List;


export class YoutubePlaylistVideosAPIClient implements YoutubePlaylistVideosAPI {
    private youtube: youtube_v3.Youtube;

    constructor(youtubeAuth: YoutubeV3Auth) {
        this.youtube = new youtube_v3.Youtube({
            auth: youtubeAuth.oAuth2Client
        });
    }

    public getFirstPlaylistVideosPage(playlistId: string): Promise<YoutubePlaylistVideosPage> {
        return this.getPlaylistVideosFromGoogleAPI(playlistId, YoutubePageToken.FIRST_PAGE);
    }

    public async getNextPlaylistVideosPage(page: YoutubePlaylistVideosPage): Promise<YoutubePlaylistVideosPage> {
        return this.getPlaylistVideosFromGoogleAPI(page.playlistId, page.nextPageToken);
    }

    private async getPlaylistVideosFromGoogleAPI(playlistId: string, pageToken: YoutubePageToken) {
        let parameters = this.buildPlaylistItemsParameters(playlistId, pageToken);
        let playlistsVideosResponse = await this.getPlaylistsItemsFromGoogleAPI(parameters);
        let videos = playlistsVideosResponse.getVideos();
        let nextPageToken = playlistsVideosResponse.getNextPageToken();
        return new YoutubePlaylistVideosPage(playlistId, nextPageToken, videos);
    }

    private buildPlaylistItemsParameters(playlistId: string, pageToken: YoutubePageToken): Params$Resource$Playlistitems$List {
        return {
            part: [ "snippet" ],
            playlistId: playlistId,
            maxResults: 50,
            pageToken: pageToken.value
        };
    }

    private async getPlaylistsItemsFromGoogleAPI(parametros: youtube_v3.Params$Resource$Playlistitems$List): Promise<YoutubePlaylistVideosResponse> {
        let res = await this.youtube.playlistItems.list(parametros);
        return new YoutubePlaylistVideosResponse(res.data);
    }

}