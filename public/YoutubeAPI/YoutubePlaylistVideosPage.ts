import {YoutubePageToken} from "./YoutubePageToken";
import {YoutubeVideo} from "./YoutubeSchemas";

export class YoutubePlaylistVideosPage {

    constructor(public playlistId: string,
                public nextPageToken: YoutubePageToken,
                public videos: YoutubeVideo[]) {
    };

    public hasNextPage() {
        return this.nextPageToken.valueHasContent();
    }
}