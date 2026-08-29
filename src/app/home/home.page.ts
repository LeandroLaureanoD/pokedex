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
import { Router } from '@angular/router';

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

  private readonly router = inject(Router);

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

  abrirDetalhes(id?: number): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/pokemon', id]);
  }
}