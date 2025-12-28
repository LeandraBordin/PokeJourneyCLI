import { StarterService } from '../services/starter.service.js';
import { UIService } from '../services/ui.service.js';
import { ValidacaoService } from '../services/validation.service.js';
import { ExploracaoService } from '../services/exploration.service.js';
import * as constants from '../constants/constants.js';
export class GerenciadorJogo {
  constructor(personagem) {
    this.player = { ...personagem };
  }

  async iniciar() {
    if (this.player.equipe.length === 0) {
      await StarterService.selecionarStarter(this.player);
      return this.player;
    }

    await this.executarLoopPrincipal();
    return this.player;
  }

  async executarLoopPrincipal() {
    let opcaoSelecionada;

    do {
      UIService.exibirMenuJogo(this.player);

      opcaoSelecionada = ValidacaoService.solicitarOpcaoValida(
        'Selecione a opção desejada: ',
        constants.OPCOES_JOGO.SAIR,
        constants.OPCOES_JOGO.MOCHILA
      );

      await this.processarOpcaoJogo(opcaoSelecionada);
    } while (opcaoSelecionada !== constants.OPCOES_JOGO.SAIR);
  }

  async processarOpcaoJogo(opcao) {
    switch (opcao) {
      case constants.OPCOES_JOGO.EXPLORAR:
        this.player = await ExploracaoService.explorar(this.player);
        break;

      case constants.OPCOES_JOGO.POKEDEX:
        await this.abrirPokedex();
        break;

      case constants.OPCOES_JOGO.POKEMON:
        await this.gerenciarPokemon();
        break;

      case constants.OPCOES_JOGO.MOCHILA:
        await this.abrirMochila();
        break;

      case constants.OPCOES_JOGO.SAIR:
        console.log('Saindo do jogo...');
        break;

      default:
        console.log(constants.MENSAGENS.OPCAO_INVALIDA);
    }
  }

  async abrirPokedex() {
    //Implementar Pokedex
    console.log('Abrindo Pokedex...');
  }

  async gerenciarPokemon() {
    //Implementar gerenciamento de Pokémon
    console.log('Gerenciando Pokémon...');
  }

  async abrirMochila() {
    //Implementar mochila
    console.log('Abrindo mochila...');
  }
}
