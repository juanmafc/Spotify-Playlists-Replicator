import { youtube_v3 } from "googleapis";
import Schema$PlaylistListResponse = youtube_v3.Schema$PlaylistListResponse;
import {YoutubeAPIPlaylistResponse, YoutubePlaylist} from "../YoutubeSchemas";
import {YoutubePlaylistsAPI} from "./YoutubePlaylistsAPI";
import {YoutubePageToken} from "../YoutubePageToken";
import {YoutubeV3Auth} from "../YoutubeV3Auth";

export class YoutubePlaylistsAPIClient implements YoutubePlaylistsAPI {
    private youtube: youtube_v3.Youtube;

    constructor(youtubeAuth: YoutubeV3Auth) {
        this.youtube = new youtube_v3.Youtube({
            auth: youtubeAuth.oAuth2Client
        });
    }

    public getFirstPlaylistsPage(): Promise<YoutubeAPIPlaylistResponse> {
        return this.getPlaylists(YoutubePageToken.FIRST_PAGE);
    }

    public async getPlaylists(youtubePageToken: YoutubePageToken): Promise<YoutubeAPIPlaylistResponse> {
        let parameters = this.buildPlaylistParameters(youtubePageToken);
        let playlistsResponse = await this.getPlaylistsFromGoogleAPI(parameters);
        let playlists = this.googleResponseToYoutubePlaylist(playlistsResponse);

        let nextPageToken = playlistsResponse.nextPageToken !== null ? playlistsResponse.nextPageToken : undefined
        return new YoutubeAPIPlaylistResponse(new YoutubePageToken(nextPageToken), playlists);
    }

    private buildPlaylistParameters(youtubePageToken: YoutubePageToken): youtube_v3.Params$Resource$Playlists$List  {
        return {
            part: ['snippet'],
            mine: true,
            maxResults: 50,
            pageToken: youtubePageToken.value
        }
    }

    private async getPlaylistsFromGoogleAPI(parametros: youtube_v3.Params$Resource$Playlists$List): Promise<Schema$PlaylistListResponse> {
        let response = await this.youtube.playlists.list(parametros);
        return response.data;
    }

    private googleResponseToYoutubePlaylist(response: Schema$PlaylistListResponse) {
        let playlists: YoutubePlaylist[] = []
        let responsePlaylists = response.items;
        if ( responsePlaylists !== undefined) {
            playlists = responsePlaylists
                .filter(playlist => playlist.id !== null && playlist.snippet !== undefined)
                .map(playlist => {
                    return {
                        id: <string> playlist.id,
                        title: <string> playlist.snippet!.title
                    };
                });
        }
        return playlists;
    }

}