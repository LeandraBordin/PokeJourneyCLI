import { MENSAGENS } from '../constants/constants.js';
import * as pokemons from '../pokemons/pokemons.js';
import { UIService } from './ui.service.js';
import { ValidacaoService } from './validation.service.js';
export class StarterService {
  static async selecionarStarter(player) {
    try {
      console.log(MENSAGENS.BEM_VINDO);

      const starters = await pokemons.setStarters(player);

      if (!starters || starters.length === 0) {
        throw new Error('Nenhum starter disponível');
      }

      UIService.exibirStarters(starters);

      const opcaoSelecionada = ValidacaoService.solicitarOpcaoValida(
        'Selecione seu pokemon inicial: ',
        1,
        starters.length
      );

      player.equipe.push(starters[opcaoSelecionada - 1]);
      return player;
    } catch (erro) {
      console.error('❌ Erro ao selecionar starter:', erro.message);
      throw erro;
    }
  }
}
