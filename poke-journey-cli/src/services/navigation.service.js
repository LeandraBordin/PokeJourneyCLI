export function getDestinosDisponiveis(locationId, mundo) {
  const local = mundo.locations.find((loc) => loc.id === locationId);
  if (!local) {
    console.log('Local não encontrado no mundo:', locationId);
    return [];
  }
  return local.connects;
}
