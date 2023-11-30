export interface ContentToScrape {
    url: string
    htmlSelector: string
}

export interface ScrappedContent {
    url: string
    content: string
}

export interface HostnameSelectors {
    [key: string]: string
}
