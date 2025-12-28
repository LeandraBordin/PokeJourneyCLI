import axios from 'axios';

export async function getLocations(regiao) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/region/${regiao.toLowerCase()}`
  );
  return response.data.locations;
}
export async function getPokedex(personagem) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokedex/${personagem.regiao}`
  );

  return response.data.pokemon_entries;
}
// Para implementar pokedex futuramente
