// eslint-disable-next-line n/no-unpublished-import
import * as slotsData from './data/slots_data_trimmed.json';

function createSlotsMap() {
  const mapById = new Map<String, (typeof slotsData)['slots'][0]>();
  const nameToId = new Map<String, string>();
  const names: string[] = [];
  for (const slot of slotsData.slots) {
    mapById.set(slot.id, slot);
    nameToId.set(slot.name, slot.id);
    names.push(slot.name);
  }

  return {mapById, names, nameToId};
}
export {slotsData, createSlotsMap};
