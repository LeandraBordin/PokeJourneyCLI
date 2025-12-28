export async function getStarters(regiao) {
  const starters = {
    Kanto: ['bulbasaur', 'charmander', 'squirtle'],
    Johto: ['chikorita', 'cyndaquil', 'totodile'],
    Hoenn: ['treecko', 'torchic', 'mudkip'],
    Sinnoh: ['turtwig', 'chimchar', 'piplup'],
    Unova: ['snivy', 'tepig', 'oshawott'],
    Kalos: ['chespin', 'fennekin', 'froakie'],
    Alola: ['rowlet', 'litten', 'popplio'],
    Galar: ['grookey', 'scorbunny', 'sobble'],
    Paldea: ['sprigatito', 'fuecoco', 'quaxly'],
  };
  return starters[regiao];
}
