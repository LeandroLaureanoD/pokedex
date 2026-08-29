import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar
} from '@ionic/angular/standalone';

import { PokemonService } from '../core/services/pokemon.service';
import { PokemonListItem } from '../features/pokemon/models/pokemon-list-response.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar
  ],
})
export class HomePage implements OnInit {

  private readonly pokemonService = inject(PokemonService);

  pokemons: PokemonListItem[] = [];
  pokemonsFiltrados: PokemonListItem[] = [];

  ngOnInit(): void {
    this.listarPokemons();
  }

  listarPokemons(): void {
    this.pokemonService.listarPokemons().subscribe({
      next: response => {
        this.pokemons = response.results.map(pokemon => {
          const id = this.extrairIdPokemon(pokemon.url);

          return {
            ...pokemon,
            id,
            imageUrl: this.pokemonService.obterImagemPokemon(id)
          };
        });

        this.pokemonsFiltrados = this.pokemons;
      },
      error: error => {
        console.error('Erro ao listar Pokémon', error);
      }
    });
  }

  private extrairIdPokemon(url: string): number {
    const partes = url.split('/').filter(Boolean);
    return Number(partes[partes.length - 1]);
  }

  obterImagemPokemon(id?: number): string {
    if (!id) {
      return '';
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  buscarPokemon(event: CustomEvent): void {
    const valor = event.detail.value?.toLowerCase().trim() ?? '';

    if (!valor) {
      this.pokemonsFiltrados = this.pokemons;
      return;
    }

    this.pokemonsFiltrados = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(valor)
    );
  }
}