import * as pokemons from '../pokemons/pokemons.js';
export class PokemonService {
  static gerarNivelAleatorio() {
    return Math.floor(Math.random() * 5) + 2;
  }

  static prepararPokemonJogador(pokemon) {
    const level = pokemon.level ?? 5; // ✅ USA O LEVEL ATUAL
    const hpBase = pokemon.stats.hp;
    const hpMax = pokemons.calcularHpBonus(hpBase, level) + hpBase;
    return {
      ...pokemon,
      level,
      hpMax: pokemon.hpMax ?? hpMax, // ✅ MANTÉM HP MÁXIMO
      hpAtual: pokemon.hpAtual ?? hpMax, // ✅ MANTÉM HP ATUAL
      moves: pokemon.moves.map((move) => ({
        ...move,
        pp: move.pp ?? move.ppMax, // ✅ MANTÉM PP ATUAL
        ppMax: move.ppMax ?? 35,
      })),
    };
  }
  static prepararPokemonSelvagem(pokemon) {
    const level = PokemonService.gerarNivelAleatorio(); // ✅ GERA LEVEL ALEATÓRIO
    const hpBase = pokemon.stats.hp;
    const hpMax = pokemons.calcularHpBonus(hpBase, level) + hpBase;
    return {
      ...pokemon,
      level,
      hpMax, // ✅ HP MÁXIMO NOVO
      hpAtual: hpMax, // ✅ HP CHEIO
      moves: pokemon.moves.map((move) => ({
        ...move,
        pp: move.ppMax ?? 35, // ✅ PP CHEIO
        ppMax: move.ppMax ?? 35,
      })),
    };
  }
  static calcularDano(atacante, movimento) {
    const poderBase = movimento.poder ?? 0;
    const bonusLevel = Math.floor((atacante.level ?? 5) / 10) * 2;
    const modificadorAleatorio = Math.random() * 0.15 + 0.85;
    const dano = Math.floor((poderBase + bonusLevel) * modificadorAleatorio);

    return poderBase === 0 ? 0 : Math.max(1, dano);
  }

  static aplicarDano(pokemon, dano) {
    return {
      ...pokemon,
      hpAtual: Math.max(0, pokemon.hpAtual - dano),
    };
  }

  static usarMovimento(pokemon, indiceMovimento) {
    const movimentos = [...pokemon.moves];
    const movimento = movimentos[indiceMovimento];

    if (!movimento || movimento.pp <= 0) {
      return { pokemon, movimento: null, sucesso: false };
    }

    movimentos[indiceMovimento] = {
      ...movimento,
      pp: movimento.pp - 1,
    };

    return {
      pokemon: { ...pokemon, moves: movimentos },
      movimento,
      sucesso: true,
    };
  }

  static selecionarMovimentoIA(pokemon) {
    const movimentosDisponiveis = pokemon.moves
      .map((move, index) => ({ move, index }))
      .filter((m) => m.move.pp > 0);

    if (movimentosDisponiveis.length === 0) {
      return null;
    }

    const indiceAleatorio = Math.floor(
      Math.random() * movimentosDisponiveis.length
    );
    return movimentosDisponiveis[indiceAleatorio].index;
  }
}
