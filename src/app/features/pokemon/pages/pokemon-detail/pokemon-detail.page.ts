import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonLabel
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
    IonImg,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ]
})
export class PokemonDetailPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);

  pokemon?: PokemonDetail;
  imgPokemon = '';

  carregandoImagem = true;

  abaSelecionada = 'sobre';

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
        this.carregandoImagem = true;
        this.imgPokemon = this.pokemonService.obterImagemPokemon(response.id);
      },
      error: error => {
        console.error('Erro ao buscar Pokémon', error);
      }
    });
  }

  alterarAba(event: CustomEvent): void {
   this.abaSelecionada = event.detail.value ?? 'sobre';
  }
}