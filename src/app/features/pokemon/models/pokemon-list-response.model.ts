export interface PokemonListItem {
    id?: number;
    name: string;
    url: string;
    imageUrl?: string;
    gifUrl?: string;
    types?: string[];
    favorito?: boolean;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}
