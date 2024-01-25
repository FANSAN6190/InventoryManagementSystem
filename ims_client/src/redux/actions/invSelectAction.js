export const SELECT_INVENTORY = 'SELECT_INVENTORY';
export const INV_ARRAY = 'INV_ARRAY';

export const selectInventory = inventory => ({
  type: SELECT_INVENTORY,
  payload: inventory,
});
export const invArray = inventory_arr => ({
    type: INV_ARRAY,
    payload: inventory_arr,
});