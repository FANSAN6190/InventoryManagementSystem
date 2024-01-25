import { SELECT_INVENTORY } from '../actions/invSelectAction';

const initialState = {
  selectedInventory: null,
};

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_INVENTORY:
      return {
        ...state,
        selectedInventory: action.payload,
      };
    default:
      return state;
  }
}