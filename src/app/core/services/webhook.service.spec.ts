import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it
} from 'vitest';

import { TestBed } from '@angular/core/testing';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
    let service: WebhookService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WebhookService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(WebhookService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve enviar webhook ao favoritar Pokémon', () => {
        service.enviarPokemonFavoritado(
            25,
            'pikachu'
        );

        const req = httpMock.expectOne(
            '/api/webhook'
        );

        expect(req.request.method).toBe('POST');

        expect(req.request.body.event)
            .toBe('pokemon_favorited');

        expect(req.request.body.pokemon)
            .toEqual({
                id: 25,
                name: 'pikachu'
            });

        expect(req.request.body.createdAt)
            .toBeTruthy();

        req.flush({
            success: true
        });
    });
});