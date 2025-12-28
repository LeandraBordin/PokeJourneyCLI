import fs from 'fs';
import axios from 'axios';

async function buildKantoRoutes() {
  const region = await axios.get('https://pokeapi.co/api/v2/region/kanto');

  const routes = region.data.locations.filter((loc) =>
    loc.name.startsWith('kanto-route')
  );

  const result = {};

  for (const route of routes) {
    const location = await axios.get(route.url);

    const areas = location.data.areas.map((a) => a.url);

    const pokemons = new Set();

    for (const areaUrl of areas) {
      const area = await axios.get(areaUrl);

      area.data.pokemon_encounters.forEach((p) => pokemons.add(p.pokemon.name));
    }

    result[route.name] = {
      areas: areas.map((a) => a.split('/').at(-2)),
      pokemons: [...pokemons],
    };
  }

  fs.writeFileSync(
    'kanto-routes.json',
    JSON.stringify({ region: 'kanto', routes: result }, null, 2)
  );
}

buildKantoRoutes();
