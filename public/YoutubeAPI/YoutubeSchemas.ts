import {YoutubePageToken} from "./YoutubePageToken";

export interface YoutubePlaylist {
    id: string,
    title: string
}

export class YoutubeAPIPlaylistResponse {

    constructor(public nextPageToken: YoutubePageToken,
                public playlists: YoutubePlaylist[]) {};

    public hasNextPage() {
        return this.nextPageToken.valueHasContent();
    }
}

export class YoutubeAPIPlaylistVideosResponse {

    constructor(public nextPageToken: YoutubePageToken,
                public videos: YoutubeVideo[]) {};

    public hasNextPage() {
        return this.nextPageToken.valueHasContent();
    }
}

export interface YoutubeVideo {
    id: string,
    title: string
}