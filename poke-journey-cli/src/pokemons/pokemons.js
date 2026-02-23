import axios from 'axios';
import * as pokemonData from './pokemons.data.js';
export async function setStarters(personagem) {
  const starters = await pokemonData.getStarters(personagem.regiao);

  return Promise.all(starters.map((starter) => criarPokemon(starter)));
}
export async function criarPokemon(nome) {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nome}`);

  const data = response.data;

  const moves = data.moves
    .filter((move) =>
      move.version_group_details.some((v) => v.level_learned_at === 1),
    )
    .map((move) => move.move.name);

  const movesDetalhados = await Promise.all(
    moves.map(async (moveName) => {
      const moveRes = await axios.get(
        `https://pokeapi.co/api/v2/move/${moveName}`,
      );
      const move = moveRes.data;

      return {
        nome: move.name,
        tipo: move.type.name,
        categoria: move.damage_class.name,
        poder: move.power,
        acuracia: move.accuracy,
        pp: move.pp,
      };
    }),
  );

  return {
    nome: data.name,
    id: data.id,
    level: 5,
    experience: 0,
    tipos: data.types.map((t) => t.type.name),
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      sp_attack: data.stats[3].base_stat,
      sp_defense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    },
    moves: movesDetalhados,
    hpMax: Math.floor((data.stats[0].base_stat * 2 * 5) / 100 + 5 + 10),
    hpAtual: Math.floor((data.stats[0].base_stat * 2 * 5) / 100 + 5 + 10),
  };
}
export function calcularHpBonus(baseHP, level) {
  return Math.floor((baseHP * 2 * level) / 100 + level + 10);
}
