import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);

    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir todos os Pokémon ao selecionar o filtro todos', () => {
    component.pokemons = [
      {
        name: 'bulbasaur',
        url: '',
        id: 1,
        favorito: true
      },
      {
        name: 'charmander',
        url: '',
        id: 4,
        favorito: false
      }
    ];

    component.alterarFiltro('todos');

    expect(component.filtroSelecionado).toBe('todos');
    expect(component.pokemonsFiltrados.length).toBe(2);
  });

  it('deve navegar para a tela de detalhes', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    component.abrirDetalhes(25);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/pokemon',
      25
    ]);
  });

  it('não deve navegar quando o id não for informado', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    component.abrirDetalhes();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});