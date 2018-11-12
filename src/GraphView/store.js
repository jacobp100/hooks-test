import {
  __,
  curry,
  flow,
  concat,
  reject,
  union,
  partition,
  map,
  filter,
  some
} from "lodash/fp";

const SET_SELECTED = Symbol("SET_SELECTED");
const CLEAR_SELECTED = Symbol("CLEAR_SELECTED");
const REMOVE_SELECTED_NODES = Symbol("REMOVE_SELECTED_NODES");
const ADD_CHILD_TO_SELECTED = Symbol("ADD_CHILD_TO_SELECTED");
const MOVE_NODE = Symbol("MOVE_NODE");

const defaultNodes = [
  { id: "Eve", parentId: null },
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
  selected: [],
  nodes: defaultNodes
};

const isRoot = curry((state, id) => some({ id, parentId: null }, state.nodes));

const removeNodes = (toRemove, nodes) => {
  const [removed, nextNodes] = partition(
    node => toRemove.includes(node.id),
    nodes
  );

  const removedIds = map("id", removed);
  const cascade = flow(
    filter(node => removedIds.includes(node.parentId)),
    map("id")
  )(nextNodes);

  return cascade.length > 0 ? removeNodes(cascade, nextNodes) : nextNodes;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED: {
      const selected = action.additive
        ? union(state.selected, action.selected)
        : action.selected;
      return { ...state, selected };
    }
    case CLEAR_SELECTED:
      return { ...state, selected: [] };
    case REMOVE_SELECTED_NODES: {
      const selected = reject(isRoot(state), state.selected);
      return {
        ...state,
        nodes: removeNodes(selected, state.nodes),
        selected: []
      };
    }
    case ADD_CHILD_TO_SELECTED: {
      if (state.selected.length !== 1) return state;

      const selectedId = state.selected[0];
      return {
        ...state,
        nodes: state.nodes.concat({
          parentId: selectedId,
          id: String(Date.now())
        })
      };
    }
    case MOVE_NODE: {
      const { from, to } = action;

      if (isRoot(state, from)) return state;

      return {
        ...state,
        nodes: flow(
          reject({ id: from }),
          concat(__, { id: from, parentId: to })
        )(state.nodes)
      };
    }
    default:
      return state;
  }
};

export const setSelected = (selected, additive = false) => ({
  type: SET_SELECTED,
  selected,
  additive
});
export const clearSelected = () => ({ type: CLEAR_SELECTED });
export const removeSelectedNodes = () => ({ type: REMOVE_SELECTED_NODES });
export const addChildToSelected = () => ({ type: ADD_CHILD_TO_SELECTED });
export const moveNode = ({ from, to }) => ({ type: MOVE_NODE, from, to });
