import { PokemonService } from './pokemon.service.js';
import { ValidacaoService } from './validation.service.js';
import * as constants from '../constants/constants.js';
import { UIService } from './ui.service.js';
export class BatalhaService {
  constructor(pokemonJogador, pokemonInimigo) {
    this.pokemonJogador = PokemonService.prepararPokemonJogador(pokemonJogador);
    this.pokemonInimigo =
      PokemonService.prepararPokemonSelvagem(pokemonInimigo);
    this.emBatalha = true;
  }
  exibirEstadoBatalha() {
    console.log('\n=== BATALHA POKÉMON ===\n');
    UIService.exibirVidaPokemon(this.pokemonInimigo, 'INIMIGO');
    console.log();
    UIService.exibirVidaPokemon(this.pokemonJogador, 'ALIADO');
  }

  async turnoJogador() {
    UIService.exibirMenuBatalha();
    const opcaoBatalha = ValidacaoService.solicitarOpcaoValida(
      'Selecione a opção desejada: ',
      constants.OPCOES_BATALHA.ATACAR,
      constants.OPCOES_BATALHA.FUGIR
    );

    switch (opcaoBatalha) {
      case constants.OPCOES_BATALHA.ATACAR:
        return await this.processarAtaqueJogador();

      case constants.OPCOES_BATALHA.POKEMON:
        console.log('⚠️ Troca de Pokémon não implementada ainda');
        return true;

      case constants.OPCOES_BATALHA.MOCHILA:
        console.log('⚠️ Uso de itens não implementado ainda');
        return true;

      case constants.OPCOES_BATALHA.FUGIR:
        console.log(constants.MENSAGENS.FUGIU_BATALHA);
        this.emBatalha = false;
        return false;

      default:
        return true;
    }
  }

  async processarAtaqueJogador() {
    UIService.exibirMenuAtaques(this.pokemonJogador);

    const opcaoMovimento = ValidacaoService.solicitarOpcaoValida(
      '\nEscolha o movimento: ',
      1,
      this.pokemonJogador.moves.length
    );

    const resultado = PokemonService.usarMovimento(
      this.pokemonJogador,
      opcaoMovimento - 1
    );

    if (!resultado.sucesso) {
      console.log('❌ Movimento sem PP disponível!');
      return true;
    }

    this.pokemonJogador = resultado.pokemon;
    const movimento = resultado.movimento;

    UIService.exibirUsoMovimento(this.pokemonJogador.nome, movimento.nome);

    const dano = PokemonService.calcularDano(this.pokemonJogador, movimento);

    this.pokemonInimigo = PokemonService.aplicarDano(this.pokemonInimigo, dano);

    console.log(constants.MENSAGENS.DANO_CAUSADO(dano));

    await this.aguardar(1500);

    if (this.pokemonInimigo.hpAtual <= 0) {
      console.log(
        constants.MENSAGENS.POKEMON_DERROTADO(this.pokemonInimigo.nome)
      );
      this.emBatalha = false;
      return false;
    }

    return true;
  }

  async turnoInimigo() {
    console.log('\n🤖 Turno do inimigo...\n');
    await this.aguardar(1000);

    const indiceMovimento = PokemonService.selecionarMovimentoIA(
      this.pokemonInimigo
    );

    if (indiceMovimento === null) {
      console.log('⚠️ Inimigo sem movimentos disponíveis!');
      return true;
    }

    const resultado = PokemonService.usarMovimento(
      this.pokemonInimigo,
      indiceMovimento
    );

    this.pokemonInimigo = resultado.pokemon;
    const movimento = resultado.movimento;

    UIService.exibirUsoMovimento(this.pokemonInimigo.nome, movimento.nome);

    const dano = PokemonService.calcularDano(this.pokemonInimigo, movimento);

    this.pokemonJogador = PokemonService.aplicarDano(this.pokemonJogador, dano);

    console.log(constants.MENSAGENS.DANO_CAUSADO(dano));

    await this.aguardar(1500);

    if (this.pokemonJogador.hpAtual <= 0) {
      console.log(
        constants.MENSAGENS.POKEMON_DERROTADO(this.pokemonJogador.nome)
      );
      this.emBatalha = false;
      return false;
    }

    return true;
  }

  async iniciar() {
    while (this.emBatalha) {
      this.exibirEstadoBatalha();

      const continuarAposJogador = await this.turnoJogador();
      if (!continuarAposJogador || !this.emBatalha) break;

      const continuarAposInimigo = await this.turnoInimigo();
      if (!continuarAposInimigo || !this.emBatalha) break;
    }

    return {
      venceu: this.pokemonInimigo.hpAtual <= 0,
      pokemonJogador: this.pokemonJogador,
    };
  }

  aguardar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
