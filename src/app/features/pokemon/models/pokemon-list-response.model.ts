export interface PokemonListItem {
    id?: number;
    name: string;
    url: string;
    imageUrl?: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}