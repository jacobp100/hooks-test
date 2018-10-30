import { useReducer, useCallback } from "react";

export default (store) => {
  const [state, dispatch] = useReducer(store.reducer, store.defaultState);

  const setSelected = useCallback(id => dispatch(store.setSelected(id)), [
    dispatch
  ]);
  const clearSelected = useCallback(() => dispatch(store.clearSelected()), [
    dispatch
  ]);
  const addChildToSelected = useCallback(
    () => dispatch(store.addChildToSelected()),
    [dispatch]
  );

  return { state, setSelected, clearSelected, addChildToSelected };
};
