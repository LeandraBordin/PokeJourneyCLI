import { UIService } from './services/ui.service.js';
import { ValidacaoService } from './services/validation.service.js';
import * as constants from './constants/constants.js';
import { GerenciadorPersonagens } from './services/character.service.js';
import { GerenciadorJogo } from './game/game.manager.js';
async function menu() {
  console.log('Bem vindo ao menu!');

  const gerenciadorPersonagens = new GerenciadorPersonagens();
  let opcaoMenu;

  do {
    const personagemAtual = gerenciadorPersonagens.obterOuCriarPersonagem();

    UIService.exibirMenuPrincipal(personagemAtual);

    opcaoMenu = ValidacaoService.solicitarOpcaoValida(
      'Selecione a opção desejada: ',
      constants.OPCOES_MENU.SAIR,
      constants.OPCOES_MENU.TROCAR_PERSONAGEM
    );

    await processarOpcaoMenu(
      opcaoMenu,
      gerenciadorPersonagens,
      personagemAtual
    );
  } while (opcaoMenu !== constants.OPCOES_MENU.SAIR);
}

async function processarOpcaoMenu(opcao, gerenciador, personagem) {
  switch (opcao) {
    case constants.OPCOES_MENU.JOGAR:
      console.log('\n🎮 Iniciando jogo...\n');
      const jogo = new GerenciadorJogo(personagem);
      const personagemAtualizado = await jogo.iniciar();
      gerenciador.salvarPersonagem(personagemAtualizado);
      break;

    case constants.OPCOES_MENU.CRIAR_PERSONAGEM:
      gerenciador.criarNovoPersonagem();
      break;

    case constants.OPCOES_MENU.TROCAR_PERSONAGEM:
      gerenciador.trocarPersonagem();
      break;

    case constants.OPCOES_MENU.SAIR:
      console.log(constants.MENSAGENS.SAINDO);
      break;

    default:
      console.log(constants.MENSAGENS.OPCAO_INVALIDA);
  }
}
menu();
