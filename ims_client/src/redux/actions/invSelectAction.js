export const SELECT_INVENTORY = 'SELECT_INVENTORY';

export const selectInventory = inventory => ({
  type: SELECT_INVENTORY,
  payload: inventory,
});