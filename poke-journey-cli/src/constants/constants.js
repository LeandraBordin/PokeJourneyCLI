export const MAX_TAMANHO_EQUIPE = 6;
export const MAX_PERSONAGENS = 5;
export const OPCOES_MENU = {
  JOGAR: 1,
  CRIAR_PERSONAGEM: 2,
  TROCAR_PERSONAGEM: 3,
  EXCLUIR_PERSONAGEM: 4,
  SAIR: 0,
};
export const OPCOES_JOGO = {
  EXPLORAR: 1,
  POKEDEX: 2,
  POKEMON: 3,
  MOCHILA: 4,
  SAIR: 0,
};
export const OPCOES_BATALHA = {
  ATACAR: 1,
  POKEMON: 2,
  MOCHILA: 3,
  FUGIR: 4,
};
export const MENSAGENS = {
  BEM_VINDO: 'Bem vindo ao jogo!',
  SAINDO: '\n👋 Saindo... Até a próxima!\n',
  OPCAO_INVALIDA: '\n⚠️ Opção inválida! Tente novamente.\n',
  ROTA_INEXISTENTE: 'Rota não encontrada',
  MUNDO_INVALIDO: 'Mundo não carregado corretamente',
  POKEMON_DERROTADO: (nome) => `\n💥 ${nome.toUpperCase()} foi derrotado!`,
  POKEMON_APARECEU: (nome) => `⚡ Um ${nome.toUpperCase()} selvagem apareceu!`,
  DANO_CAUSADO: (dano) => `➡️ Dano causado: ${dano}`,
  FUGIU_BATALHA: '\n🏃 Você fugiu da batalha!',
};
export const CONFIG_UI = {
  COLUNA_LARGURA: 20,
  BARRA_HP_LARGURA: 10,
  NIVEL_MIN_INIMIGO: 2,
  NIVEL_MAX_INIMIGO: 6,
};
