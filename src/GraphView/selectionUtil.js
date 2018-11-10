import * as store from "./store";

export const applySeletion = (tree, rect) =>
  store.setSelected(tree.nodesInRect(rect), rect.additive);

export const previewSelection = (state, tree, selectionRectangle) =>
  selectionRectangle != null
    ? store.reducer(state, applySeletion(tree, selectionRectangle)).selected
    : state.selected;
