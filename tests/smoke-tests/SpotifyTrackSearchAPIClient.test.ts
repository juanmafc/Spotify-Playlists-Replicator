import {SpotifyClientCredentialsFlow} from "../../public/SpotifyAPI/SpotifyClientCredentialsFlow";
import {SpotifyTrackSearchAPIClient} from "../../public/SpotifyAPI/SpotifyTrackSearchAPIClient";

test('Search Spotify track',async () => {
    let spotifySongSearchService = new SpotifyTrackSearchAPIClient(new SpotifyClientCredentialsFlow());

    let spotifyTracks = await spotifySongSearchService.search("Eddie Guerrero");

    expect(spotifyTracks.some(track =>
        track.id === "25PlWHwwU7yeoE4SFpmDS7" &&
        track.name === "Viva La Raza (Eddie Guerrero)"
    ));
});