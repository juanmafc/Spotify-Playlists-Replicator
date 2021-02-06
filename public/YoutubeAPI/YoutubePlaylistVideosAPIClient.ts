import { Auth, youtube_v3 } from "googleapis";
import Params$Resource$Playlistitems$List = youtube_v3.Params$Resource$Playlistitems$List;
import Schema$PlaylistItemListResponse = youtube_v3.Schema$PlaylistItemListResponse;
import {YoutubeAPIPlaylistVideosResponse, YoutubeVideo} from "./YoutubeSchemas";
import {YoutubePageToken} from "./YoutubePageToken";
import {YoutubePlaylistVideosAPI} from "./YoutubePlaylistVideosAPI";


export class YoutubePlaylistVideosAPIClient implements YoutubePlaylistVideosAPI {
    private youtube: youtube_v3.Youtube;

    constructor(oAuth2Client: Auth.OAuth2Client) {
        this.youtube = new youtube_v3.Youtube({
            auth: oAuth2Client
        });
    }

    public async getPlaylistVideos(playlistId: string, pageToken: YoutubePageToken): Promise<YoutubeAPIPlaylistVideosResponse> {
        let parameters = this.buildPlaylistItemsParameters(playlistId, pageToken);
        let playlistsItemsResponse = await this.getPlaylistsItemsFromAPI(parameters);
        let videos = this.responseToYoutubeVideos(playlistsItemsResponse);
        let nextPageToken = playlistsItemsResponse.nextPageToken !== null ? playlistsItemsResponse.nextPageToken : undefined
        return new YoutubeAPIPlaylistVideosResponse(new YoutubePageToken(nextPageToken), videos);
    }

    private buildPlaylistItemsParameters(playlistId: string, pageToken: YoutubePageToken): Params$Resource$Playlistitems$List {
        return {
            part: [ "snippet" ],
            playlistId: playlistId,
            maxResults: 50,
            pageToken: pageToken.value
        };
    }

    private async getPlaylistsItemsFromAPI(parametros: youtube_v3.Params$Resource$Playlistitems$List): Promise<Schema$PlaylistItemListResponse> {
        let res = await this.youtube.playlistItems.list(parametros);
        return res.data;
    }

    private responseToYoutubeVideos(response: Schema$PlaylistItemListResponse) {
        let videos: YoutubeVideo[] = []
        let responseVideos = response.items;
        if ( responseVideos !== undefined) {
            videos = responseVideos
                .filter(video => video.id !== null && video.snippet !== undefined).map(video => {
                    return {
                        id: <string> video.id,
                        title: <string> video.snippet!.title
                    };
                });
        }
        return videos
    }
}