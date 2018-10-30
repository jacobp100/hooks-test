const SET_SELECTED = Symbol("SET_SELECTED");
const CLEAR_SELECTED = Symbol("CLEAR_SELECTED");
const ADD_CHILD_TO_SELECTED = Symbol("ADD_CHILD_TO_SELECTED");

const defaultNodes = [
  { id: "Eve" },
  { id: "Cain", parentId: "Eve" },
  { id: "Seth", parentId: "Eve" },
  { id: "Enos", parentId: "Seth" },
  { id: "Noam", parentId: "Seth" },
  { id: "Abel", parentId: "Eve" },
  { id: "Awan", parentId: "Eve" },
  { id: "Enoch", parentId: "Awan" },
  { id: "Azura", parentId: "Eve" }
];

export const defaultState = {
  selected: null,
  nodes: defaultNodes
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED:
      return { ...state, selected: action.selected };
    case CLEAR_SELECTED:
      return { ...state, selected: null };
    case ADD_CHILD_TO_SELECTED:
      if (!state.selected) return state;
      return {
        ...state,
        nodes: state.nodes.concat({
          parentId: state.selected,
          id: String(state.nodes.length)
        })
      };
    default:
      return state;
  }
};

export const setSelected = selected => ({ type: SET_SELECTED, selected });
export const clearSelected = () => ({ type: CLEAR_SELECTED });
export const addChildToSelected = () => ({ type: ADD_CHILD_TO_SELECTED });
