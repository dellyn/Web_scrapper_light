export async function fetchWithRedirect(
    url: string,
    maxRedirects: number = 10
): Promise<any> {
    let response = await fetch(url)

    while (response.redirected && maxRedirects > 0) {
        response = await fetch(response.url)
        maxRedirects--
    }

    return response
}
