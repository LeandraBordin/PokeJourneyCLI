import * as constants from '../constants/constants.js';
import { UIService } from './ui.service.js';
import { ValidacaoService } from './validation.service.js';
import kantoRoutes from '../data/locations/kanto-routes.json' with { type: 'json' };
import { carregarMundo } from './world.service.js';
import { getDestinosDisponiveis } from './navigation.service.js';
import { BatalhaService } from './battle.service.js';
import * as pokemons from '../pokemons/pokemons.js';
import * as evolutionService from '../pokemons/pokemon.evolution.js';
import * as personagemStorage from '../storage/personagens.storage.js';

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
        mundo,
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
      Math.random() * rota.pokemons.length,
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
        destinos.length,
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
      let continuarExplorando = true;

      while (continuarExplorando) {
        console.log('Você está em uma rota. Procurando pokémons selvagens...');

        const pokemonEncontrado = this.obterPokemonAleatorioRota(destino.id);
        let pokemonSelvagem = await pokemons.criarPokemon(pokemonEncontrado);
        pokemonSelvagem = evolutionService.adicionarNivelAleatorioSelvagem(
          pokemonSelvagem,
          3,
          10,
        );

        console.log(constants.MENSAGENS.POKEMON_APARECEU(pokemonSelvagem.nome));
        if (player.equipe[0].hpAtual <= 0) {
          console.log('Seu pokemon está sem vida e não pode batalhar...');
          return player;
        }
        const batalha = new BatalhaService(player.equipe[0], pokemonSelvagem);
        const resultado = await batalha.iniciar();

        if (resultado.venceu) {
          console.log('\n🏆 Você venceu a batalha!');
          player.equipe[0] = resultado.pokemonJogador;
          personagemStorage.salvarPokemon(player.id, resultado.pokemonJogador);
        } else {
          console.log('\n❌ Seu pokémon foi derrotado!');
          continuarExplorando = false;
          break;
        }
        player.equipe[0].hpAtual = resultado.pokemonJogador.hpAtual;

        const continuarNaRota = ValidacaoService.solicitarOpcaoValida(
          '\nDeseja continuar explorando esta rota? (1: Sim, 2: Não): ',
          1,
          2,
        );

        if (continuarNaRota === 2) {
          continuarExplorando = false;
        }
      }

      return player;
    } catch (erro) {
      console.error('❌ Erro ao processar rota:', erro.message);
      return player;
    }
  }

  static async processarCidade(player, destino) {
    try {
      let emCidade = true;

      while (emCidade) {
        console.log(`\nVocê está em ${destino.name}.`);
        UIService.exibirMenuCidade(player);

        const opcaoCidade = ValidacaoService.solicitarOpcaoValida(
          'Selecione a opção desejada: ',
          constants.OPCOES_MENU_CIDADE.SAIR,
          constants.OPCOES_MENU_CIDADE.MERCADO_POKEMON,
        );

        switch (opcaoCidade) {
          case 1:
            await this.processarCentroPokemon(player);
            break;

          case 2:
            console.log('⚠️ Mercado Pokémon - Em desenvolvimento');
            break;

          case 0:
            console.log('Você saiu da cidade e voltou à exploração.');
            emCidade = false;
            break;

          default:
            console.log('Opção inválida!');
        }
      }

      return player;
    } catch (erro) {
      console.error('❌ Erro ao processar cidade:', erro.message);
      return player;
    }
  }

  static curarPokemons(player) {
    console.log(`\n💊 Curando os Pokémons de ${player.nome}...`);
    player.equipe.forEach((poke) => {
      poke.hpAtual = poke.hpMax;
      poke.moves.pp = poke.moves.ppMax;
    });
    console.log('✅ Todos os seus Pokémons foram totalmente curados!\n');
    return player;
  }

  static async processarCentroPokemon(player) {
    try {
      let emCentro = true;

      while (emCentro) {
        UIService.exibirMenuCentroPokemon(player);

        const opcaoCentro = ValidacaoService.solicitarOpcaoValida(
          'Selecione a opção desejada: ',
          constants.OPCOES_MENU_CENTRO_POKEMON.SAIR,
          constants.OPCOES_MENU_CENTRO_POKEMON.VER_PC,
        );

        switch (opcaoCentro) {
          case constants.OPCOES_MENU_CENTRO_POKEMON.CURAR_POKEMONS:
            this.curarPokemons(player);
            break;

          case constants.OPCOES_MENU_CENTRO_POKEMON.VER_PC:
            console.log('⚠️ Ver PC - Em desenvolvimento');
            break;

          case constants.OPCOES_MENU_CENTRO_POKEMON.SAIR:
            console.log('Saindo do Centro Pokémon...\n');
            emCentro = false;
            break;

          default:
            console.log('Opção inválida!');
        }
      }

      return player;
    } catch (erro) {
      console.error('❌ Erro ao processar Centro Pokémon:', erro.message);
      return player;
    }
  }
}
