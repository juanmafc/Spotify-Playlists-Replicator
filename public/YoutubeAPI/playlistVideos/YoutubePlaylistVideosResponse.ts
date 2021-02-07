import {YoutubePageToken} from "../YoutubePageToken";
import {youtube_v3} from "googleapis";
import Schema$PlaylistItemListResponse = youtube_v3.Schema$PlaylistItemListResponse;
import {YoutubeVideo} from "./YoutubeVideo";

export class YoutubePlaylistVideosResponse {
    constructor(private response: Schema$PlaylistItemListResponse) {
    };

    public getVideos() {
        let videos: YoutubeVideo[] = []
        let responseVideos = this.response.items;
        if (responseVideos !== undefined) {
            videos = responseVideos
                .filter(video => video.id !== null && video.snippet !== undefined).map(video => {
                    return {
                        id: <string>video.id,
                        title: <string>video.snippet!.title
                    };
                });
        }
        return videos
    }

    public getNextPageToken() {
        let nextPageToken = this.response.nextPageToken !== null ? this.response.nextPageToken : undefined;
        return new YoutubePageToken(nextPageToken);
    }
}