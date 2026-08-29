import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonListResponse } from '../../features/pokemon/models/pokemon-list-response.model';
import { PokemonDetailPage } from '../../features/pokemon/pages/pokemon-detail/pokemon-detail.page';
import { PokemonDetail } from '../../features/pokemon/models/pokemon-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly imageUrl = environment.pokemonImageUrl;
  private readonly chaveFavoritos = 'pokemonsFavoritos';


  listarPokemons(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  obterImagemPokemon(id: number): string {
    return `${this.imageUrl}/${id}.png`;
  }

  buscarPokemonPorId(id: number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(
      `${this.apiUrl}/pokemon/${id}`
    );
  }

  listarFavoritos(): number[] {
    const favoritos = localStorage.getItem(this.chaveFavoritos);

    return favoritos ? JSON.parse(favoritos) : [];
  }

  favoritarPokemon(id: number): void {
    const favoritos = this.listarFavoritos();

    if (!favoritos.includes(id)) {
      favoritos.push(id);
      localStorage.setItem(this.chaveFavoritos, JSON.stringify(favoritos));
    }
  }

  removerFavorito(id: number): void {
    const favoritos = this.listarFavoritos()
      .filter(pokemonId => pokemonId !== id);

    localStorage.setItem(
      this.chaveFavoritos,
      JSON.stringify(favoritos)
    );
  }

  pokemonFavorito(id: number): boolean {
    return this.listarFavoritos().includes(id);
  }
}