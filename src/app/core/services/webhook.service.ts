import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebhookService {

    private readonly http = inject(HttpClient);

    enviarPokemonFavoritado(
        id: number,
        nome: string
    ): void {

        const payload = {
            event: 'pokemon_favorited',
            pokemon: {
                id,
                name: nome
            },
            createdAt: new Date().toISOString()
        };

        this.http
            .post('/api/webhook', payload)
            .subscribe({
                error: error => {
                    console.error(
                        'Erro ao enviar webhook',
                        error
                    );
                }
            });
    }
}