import * as constants from '../constants/constants.js';
import { UIService } from './ui.service.js'; 
import { ValidacaoService } from './validation.service.js';
import kantoRoutes from '../data/locations/kanto-routes.json' with { type: 'json' };
import { carregarMundo } from './world.service.js';
import { getDestinosDisponiveis } from './navigation.service.js';
import { BatalhaService } from './battle.service.js';
import * as pokemons from '../pokemons/pokemons.js';

export class ExploracaoService {
  static inicializarLocalizacao(player) {
    if (!player.localizacao || player.localizacao === '') {
      player.localizacao = 'pallet-town';
    }
  }

  static async obterDestinosDisponiveis(player) {
    try {
      const mundo = await carregarMundo(player.regiao);

      if (!mundo || !mundo.locations) {
        throw new Error(constants.MENSAGENS.MUNDO_INVALIDO);
      }

      const destinosIds = await getDestinosDisponiveis(
        player.localizacao,
        mundo
      );

      return destinosIds
        .map((id) => mundo.locations.find((l) => l.id === id))
        .filter(Boolean);
    } catch (erro) {
      console.error('❌ Erro ao carregar destinos:', erro.message);
      return [];
    }
  }

  static obterPokemonAleatorioRota(routeKey) {
    const rota = kantoRoutes.routes[routeKey];

    if (!rota || !rota.pokemons || rota.pokemons.length === 0) {
      throw new Error(constants.MENSAGENS.ROTA_INEXISTENTE);
    }

    const indicePokemonAleatorio = Math.floor(
      Math.random() * rota.pokemons.length
    );

    return rota.pokemons[indicePokemonAleatorio];
  }

  static async explorar(player) {
    try {
      const playerAtual = { ...player };
      this.inicializarLocalizacao(playerAtual);

      const destinos = await this.obterDestinosDisponiveis(playerAtual);

      if (destinos.length === 0) {
        console.log('Nenhum destino disponível.');
        return playerAtual;
      }

      UIService.exibirDestinos(destinos);

      const opcaoDestino = ValidacaoService.solicitarOpcaoValida(
        '\nEscolha: ',
        1,
        destinos.length
      );

      await UIService.animarCarregamento('Explorando');

      const destinoEscolhido = destinos[opcaoDestino - 1];
      playerAtual.localizacao = destinoEscolhido.id;

      if (destinoEscolhido.type === 'route') {
        return await this.processarRota(playerAtual, destinoEscolhido);
      } else if (destinoEscolhido.type === 'city') {
        return await this.processarCidade(playerAtual, destinoEscolhido);
      }

      return playerAtual;
    } catch (erro) {
      console.error('❌ Erro durante exploração:', erro.message);
      return player;
    }
  }

  static async processarRota(player, destino) {
    try {
      console.log('Você está em uma rota. Procurando pokémons selvagens...');

      const pokemonEncontrado = this.obterPokemonAleatorioRota(destino.id);
      const pokemonSelvagem = await pokemons.criarPokemon(pokemonEncontrado);

      console.log(constants.MENSAGENS.POKEMON_APARECEU(pokemonSelvagem.nome));
      if (player.equipe[0].hpAtual <= 0) {
        console.log('Seu pokemon está sem vida e não pode batalhar...');
        return player;
      }
      const batalha = new BatalhaService(player.equipe[0], pokemonSelvagem);
      const resultado = await batalha.iniciar();

      if (resultado.venceu) {
        console.log('\n🏆 Você venceu a batalha!');
      }
      player.equipe[0].hpAtual = resultado.pokemonJogador.hpAtual;

      return player;
    } catch (erro) {
      console.error('❌ Erro ao processar rota:', erro.message);
      return player;
    }
  }

  static async processarCidade(player, destino) {
    console.log(`Você chegou em ${destino.name}.`);
    //Implementar lógica de cidade (Centro Pokémon, Loja)
    return player;
  }
}
