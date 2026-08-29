import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
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
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonButton,
    IonList,
    IonItem,
    IonLabel
  ],
})
export class HomePage implements OnInit {

  private readonly pokemonService = inject(PokemonService);

  pokemons: PokemonListItem[] = [];
  pokemonsFiltrados: PokemonListItem[] = [];
  todosPokemons: PokemonListItem[] = [];
  sugestoes: PokemonListItem[] = [];

  limit = 20;
  offset = 0;

  carregandoMais = false;
  buscaSemResultado = false;

  carregando = true;
  erroCarregamento = false;

  termoBusca = '';

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.listarPokemons();
    this.carregarPokemonsParaBusca();
  }

  listarPokemons(carregarMais: boolean = false): void {
    if (!carregarMais) {
      this.carregando = true;
    }
    const offsetConsulta = carregarMais
      ? this.offset + this.limit
      : 0;

    this.pokemonService
      .listarPokemons(this.limit, offsetConsulta)
      .subscribe({
        next: response => {
          this.carregando = false;
          this.erroCarregamento = false;
          const novosPokemons = response.results.map(pokemon =>
            this.prepararPokemon(pokemon)
          );

          if (carregarMais) {
            this.pokemons = [
              ...this.pokemons,
              ...novosPokemons
            ];

            this.offset = offsetConsulta;
          } else {
            this.pokemons = novosPokemons;
            this.offset = 0;
          }

          this.pokemonsFiltrados = this.pokemons;
          this.carregandoMais = false;
        },
        error: error => {
          console.error('Erro ao listar Pokémon', error);
          this.carregandoMais = false;
          this.carregando = false;
          this.erroCarregamento = true;
        }
      });
  }

  private prepararPokemon(pokemon: PokemonListItem): PokemonListItem {
    const id = this.extrairIdPokemon(pokemon.url);

    return {
      ...pokemon,
      id,
      imageUrl: this.pokemonService.obterImagemPokemon(id)
    };
  }

  private extrairIdPokemon(url: string): number {
    const partes = url.split('/').filter(Boolean);
    return Number(partes[partes.length - 1]);
  }

  buscarPokemon(event: CustomEvent): void {
    const valor = event.detail.value?.toLowerCase().trim() ?? '';

    this.termoBusca = valor;
    this.buscaSemResultado = false;

    if (!valor) {
      this.sugestoes = [];
      this.pokemonsFiltrados = this.pokemons;
      return;
    }

    this.sugestoes = this.todosPokemons
      .filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(valor)
      )
      .slice(0, 8);

    this.buscaSemResultado = this.sugestoes.length === 0;
  }

  selecionarPokemon(pokemon: PokemonListItem): void {
    this.pokemonsFiltrados = [
      this.prepararPokemon(pokemon)
    ];

    this.sugestoes = [];
  }

  carregarPokemonsParaBusca(): void {
    this.pokemonService.listarPokemonsParaBusca().subscribe({
      next: response => {
        this.todosPokemons = response.results;
      },
      error: error => {
        console.error('Erro ao carregar Pokémon para busca', error);
      }
    });
  }

  abrirDetalhes(id?: number): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/pokemon', id]);
  }

  carregarMaisPokemons(): void {
    if (this.carregandoMais) {
      return;
    }

    this.carregandoMais = true;

    this.listarPokemons(true);
  }
}