import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { PokemonService } from '../../../../core/services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon-detail.model';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ]
})
export class PokemonDetailPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);

  pokemon?: PokemonDetail;

  imgPokemon = '';
  gifPokemon = '';
  abaSelecionada = 'sobre';

  carregandoImagem = true;

  constructor() {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.buscarPokemon(id);
    }
  }

  buscarPokemon(id: number): void {
    this.pokemonService.buscarPokemonPorId(id).subscribe({
      next: response => {
        this.pokemon = response;

        this.imgPokemon =
          this.pokemonService.obterImagemPokemon(response.id);

        this.gifPokemon =
          this.pokemonService.obterGifPokemon(response.name);
      },
      error: error => {
        console.error('Erro ao buscar Pokémon', error);
      }
    });
  }
  alterarAba(event: CustomEvent): void {
    this.abaSelecionada = event.detail.value ?? 'sobre';
  }

  formatarId(id: number): string {
    return `#${String(id).padStart(3, '0')}`;
  }

  formatarAltura(height: number): string {
    return `${height / 10} m`;
  }

  formatarPeso(weight: number): string {
    return `${weight / 10} kg`;
  }

  formatarNomeStatus(nome: string): string {
    const nomes: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      speed: 'Velocidade'
    };

    return nomes[nome] ?? nome;
  }

  obterClasseTipoPrincipal(): string {
    const tipo = this.pokemon?.types?.[0]?.type.name;

    return tipo ? `detalhe-${tipo}` : 'detalhe-default';
  }
}