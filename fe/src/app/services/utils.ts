export type SortDirection = 'asc' | 'desc';

export function stringifyQuery (query: any): string {
    if (!query) {
        return '';
    }

    return '?' + Object.entries(query).map(([a, b]) => `${a}=${b}`).join('&');
}