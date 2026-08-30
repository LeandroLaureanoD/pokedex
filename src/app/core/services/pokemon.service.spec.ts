import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';
import { environment } from '../../../environments/environment';


describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar Pokémon', () => {
    const respostaMock = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/'
        },
        {
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/2/'
        }
      ]
    };

    service.listarPokemons(20, 0).subscribe(response => {
      expect(response).toEqual(respostaMock);
      expect(response.results.length).toBe(2);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/pokemon?limit=20&offset=0`
    );

    expect(req.request.method).toBe('GET');

    req.flush(respostaMock);
  });

  it('deve buscar Pokémon por id', () => {
    const pokemonMock = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [],
      abilities: [],
      stats: []
    };

    service.buscarPokemonPorId(25).subscribe(response => {
      expect(response.id).toBe(25);
      expect(response.name).toBe('pikachu');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/pokemon/25`
    );

    expect(req.request.method).toBe('GET');

    req.flush(pokemonMock);
  });

  it('deve adicionar Pokémon aos favoritos', () => {
    service.favoritarPokemon(25);

    expect(service.listarFavoritos()).toContain(25);
    expect(service.pokemonFavorito(25)).toBe(true);
  });

  it('deve remover Pokémon dos favoritos', () => {
    service.favoritarPokemon(25);

    service.removerFavorito(25);

    expect(service.listarFavoritos()).not.toContain(25);
    expect(service.pokemonFavorito(25)).toBe(false);
  });

  it('não deve duplicar Pokémon favorito', () => {
    service.favoritarPokemon(25);
    service.favoritarPokemon(25);

    expect(service.listarFavoritos()).toEqual([25]);
  });
});