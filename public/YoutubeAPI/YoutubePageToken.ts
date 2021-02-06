export class YoutubePageToken {

    constructor(public readonly value: string | undefined) {};

    public static FIRST_PAGE = new YoutubePageToken(undefined);
    public static NO_PAGE = new YoutubePageToken(undefined);

    public valueHasContent() {
        return this.value !== null && this.value !== undefined;
    }
}