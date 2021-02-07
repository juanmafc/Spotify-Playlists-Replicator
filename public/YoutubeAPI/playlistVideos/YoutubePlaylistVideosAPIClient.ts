import {youtube_v3} from "googleapis";
import {YoutubePlaylistVideosAPI} from "./YoutubePlaylistVideosAPI";
import {YoutubeV3Auth} from "../YoutubeV3Auth";
import {YoutubePlaylistVideosPage} from "./YoutubePlaylistVideosPage";
import {YoutubePlaylistVideosResponse} from "./YoutubePlaylistVideosResponse";
import {YoutubePlaylistVideosAPIParameters} from "./YoutubePlaylistVideosAPIParameters";


export class YoutubePlaylistVideosAPIClient implements YoutubePlaylistVideosAPI {
    private youtube: youtube_v3.Youtube;

    constructor(youtubeAuth: YoutubeV3Auth) {
        this.youtube = new youtube_v3.Youtube({
            auth: youtubeAuth.oAuth2Client
        });
    }

    public getFirstPlaylistVideosPage(playlistId: string): Promise<YoutubePlaylistVideosPage> {
        return this.getPlaylistVideosFromGoogleAPI(YoutubePlaylistVideosAPIParameters.buildForFirstPage(playlistId));
    }

    public async getNextPlaylistVideosPage(page: YoutubePlaylistVideosPage): Promise<YoutubePlaylistVideosPage> {
        return this.getPlaylistVideosFromGoogleAPI(YoutubePlaylistVideosAPIParameters.build(page.playlistId, page.nextPageToken));
    }

    private async getPlaylistVideosFromGoogleAPI(parameters: YoutubePlaylistVideosAPIParameters) {
        let playlistsVideosResponse = await this.getPlaylistsItemsFromGoogleAPI(parameters);
        let videos = playlistsVideosResponse.getVideos();
        let nextPageToken = playlistsVideosResponse.getNextPageToken();
        return new YoutubePlaylistVideosPage(parameters.getPlaylistId(), nextPageToken, videos);
    }

    private async getPlaylistsItemsFromGoogleAPI(parameters: YoutubePlaylistVideosAPIParameters): Promise<YoutubePlaylistVideosResponse> {
        let res = await this.youtube.playlistItems.list(parameters.googleAPIParameters);
        return new YoutubePlaylistVideosResponse(res.data);
    }

}