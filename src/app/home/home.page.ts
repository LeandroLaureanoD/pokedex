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
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from '@ionic/angular/standalone';

import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PokemonService } from '../core/services/pokemon.service';
import { PokemonListItem } from '../features/pokemon/models/pokemon-list-response.model';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
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
    IonLabel,
    NgClass,
    IonIcon,
    IonSegment,
    IonSegmentButton
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

  filtroSelecionado = 'todos';

  private readonly router = inject(Router);

  constructor() {
    addIcons({
      heart,
      heartOutline,
      chevronForwardOutline
    });
  }

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
      .pipe(
        switchMap(response =>
          forkJoin(
            response.results.map(pokemon =>
              this.prepararPokemonCompleto(pokemon)
            )
          )
        )
      )
      .subscribe({
        next: novosPokemons => {

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

          this.carregando = false;
          this.carregandoMais = false;
          this.erroCarregamento = false;
        },

        error: error => {
          console.error('Erro ao listar Pokémon', error);

          this.carregando = false;
          this.carregandoMais = false;
          this.erroCarregamento = true;
        }
      });
  }

  private prepararPokemon(pokemon: PokemonListItem): PokemonListItem {
    const id = this.extrairIdPokemon(pokemon.url);

    return {
      ...pokemon,
      id,
      imageUrl: this.pokemonService.obterImagemPokemon(id),
      favorito: this.pokemonService.pokemonFavorito(id)
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

      this.pokemonsFiltrados =
        this.filtroSelecionado === 'favoritos'
          ? this.pokemons.filter(pokemon => pokemon.favorito)
          : this.pokemons;

      return;
    }

    const listaBusca =
      this.filtroSelecionado === 'favoritos'
        ? this.todosPokemons.filter(pokemon =>
          this.pokemonService.pokemonFavorito(
            this.extrairIdPokemon(pokemon.url)
          )
        )
        : this.todosPokemons;

    this.sugestoes = listaBusca
      .filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(valor)
      )
      .slice(0, 8);

    if (this.sugestoes.length === 0) {
      this.buscaSemResultado = true;
      this.pokemonsFiltrados = [];
    }
  }

  selecionarPokemon(pokemon: PokemonListItem): void {
    this.prepararPokemonCompleto(pokemon)
      .subscribe(pokemonCompleto => {

        if (this.filtroSelecionado === 'favoritos' && !pokemonCompleto.favorito) {
          this.pokemonsFiltrados = [];
          this.buscaSemResultado = true;
          this.sugestoes = [];
          return;
        }

        this.pokemonsFiltrados = [pokemonCompleto];

        this.sugestoes = [];
        this.buscaSemResultado = false;
      });
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

  obterClasseTipo(pokemon: PokemonListItem): string {
    const tipoPrincipal = pokemon.types?.[0];

    return tipoPrincipal
      ? `tipo-${tipoPrincipal}`
      : 'tipo-default';
  }

  alternarFavoritoCard(event: Event, pokemon: PokemonListItem): void {
    event.stopPropagation();

    if (!pokemon.id) {
      return;
    }

    if (pokemon.favorito) {
      this.pokemonService.removerFavorito(pokemon.id);
    } else {
      this.pokemonService.favoritarPokemon(pokemon.id);
    }

    pokemon.favorito = !pokemon.favorito;

    if (this.filtroSelecionado === 'favoritos') {
      this.carregarFavoritos();
    }
  }

  private prepararPokemonCompleto(pokemon: PokemonListItem): Observable<PokemonListItem> {

    const pokemonPreparado = this.prepararPokemon(pokemon);

    if (!pokemonPreparado.id) {
      return of(pokemonPreparado);
    }

    return this.pokemonService
      .buscarPokemonPorId(pokemonPreparado.id)
      .pipe(
        map(detalhe => ({
          ...pokemonPreparado,
          types: detalhe.types.map(tipo => tipo.type.name)
        })),
        catchError(() => of(pokemonPreparado))
      );
  }

  alterarFiltro(valor: string | number | undefined): void {
    const filtro = String(valor ?? 'todos');

    this.filtroSelecionado = filtro;
    this.termoBusca = '';
    this.sugestoes = [];

    if (filtro === 'favoritos') {
      this.carregarFavoritos();
      return;
    }

    this.pokemonsFiltrados = this.pokemons;
  }

  carregarFavoritos(): void {
    const idsFavoritos = this.pokemonService.listarFavoritos();

    if (idsFavoritos.length === 0) {
      this.pokemonsFiltrados = [];
      return;
    }

    this.carregando = true;

    forkJoin(
      idsFavoritos.map(id =>
        this.pokemonService.buscarPokemonPorId(id).pipe(
          map(detalhe => ({
            name: detalhe.name,
            url: '',
            id: detalhe.id,
            imageUrl: this.pokemonService.obterImagemPokemon(id),
            types: detalhe.types.map(tipo => tipo.type.name),
            favorito: true
          }))
        )
      )
    ).subscribe({
      next: favoritos => {
        this.pokemonsFiltrados = favoritos;
        this.carregando = false;
        this.erroCarregamento = false;
      },

      error: error => {
        console.error('Erro ao carregar favoritos', error);

        this.carregando = false;
        this.erroCarregamento = true;
      }
    });
  }
}