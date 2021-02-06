
export class YoutubeConfig {
    constructor(public clientId: string,
                public clientSecret: string,
                public redirectUrl: string) {}
}

export const MAIN_CONFIG = new YoutubeConfig(
    '823820379687-o0e7cg9fsqu4ocjonfhu1bcs3o5bqoqp.apps.googleusercontent.com',
    '9GcLsxp9KSSJebhQ1a6UV1IQ',
    'http://localhost:8080/callback');