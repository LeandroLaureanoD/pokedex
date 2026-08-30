import {
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonDetailPage } from './pokemon-detail.page';

describe('PokemonDetailPage', () => {
  let component: PokemonDetailPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetailPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1'
              })
            }
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(
      PokemonDetailPage
    );

    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve formatar o id do Pokémon', () => {
    expect(component.formatarId(1)).toBe('#001');
    expect(component.formatarId(25)).toBe('#025');
    expect(component.formatarId(150)).toBe('#150');
  });

  it('deve formatar a altura em metros', () => {
    expect(component.formatarAltura(7)).toBe('0.7 m');
    expect(component.formatarAltura(20)).toBe('2 m');
  });

  it('deve formatar o peso em quilogramas', () => {
    expect(component.formatarPeso(69)).toBe('6.9 kg');
    expect(component.formatarPeso(600)).toBe('60 kg');
  });

  it('deve formatar os nomes dos status', () => {
    expect(
      component.formatarNomeStatus('hp')
    ).toBe('HP');

    expect(
      component.formatarNomeStatus('attack')
    ).toBe('Ataque');

    expect(
      component.formatarNomeStatus('defense')
    ).toBe('Defesa');

    expect(
      component.formatarNomeStatus('special-attack')
    ).toBe('Ataque Especial');

    expect(
      component.formatarNomeStatus('special-defense')
    ).toBe('Defesa Especial');

    expect(
      component.formatarNomeStatus('speed')
    ).toBe('Velocidade');
  });
});