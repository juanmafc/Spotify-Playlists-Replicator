import {YoutubePageToken} from "./YoutubePageToken";
import {youtube_v3} from "googleapis";
import Params$Resource$Playlistitems$List = youtube_v3.Params$Resource$Playlistitems$List;

export class YoutubePlaylistVideosAPIParameters {

    private constructor(public googleAPIParameters: Params$Resource$Playlistitems$List) {}

    public static build(playlistId: string, pageToken: YoutubePageToken): YoutubePlaylistVideosAPIParameters {
        return new YoutubePlaylistVideosAPIParameters({
            part: ["snippet"],
            playlistId: playlistId,
            maxResults: 50,
            pageToken: pageToken.value
        });
    }

    public static buildForFirstPage(playlistId: string) {
        return YoutubePlaylistVideosAPIParameters.build(playlistId, YoutubePageToken.FIRST_PAGE);
    }

    public getPlaylistId(): string {
        return this.googleAPIParameters.playlistId!;
    }
}