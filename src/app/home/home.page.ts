import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { PokemonService } from '../core/services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {

  private readonly pokemonService = inject(PokemonService);

  ngOnInit(): void {
    this.pokemonService.listarPokemons().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error('Erro ao buscar Pokémon:', error);
      }
    });
  }
}