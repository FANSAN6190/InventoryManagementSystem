import { SELECT_INVENTORY } from '../actions/invSelectAction';
import { INV_ARRAY } from '../actions/invSelectAction';

const initialState = {
  selectedInventory: null,
  inventory_arr: [],
};

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_INVENTORY:
        return {
            ...state,
            selectedInventory: action.payload,
        }
    case INV_ARRAY:
        return {
            ...state,
            inventory_arr: action.payload
        }
    default:
      return state;
  }
}