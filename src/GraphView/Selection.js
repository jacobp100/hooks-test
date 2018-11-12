import React from "react";
import Button from "../Button";
import * as store from "./store";

export default ({ selected, dispatch }) => (
  <div>
    {selected.length > 1 ? (
      <>
        <span>{selected.length} nodes selected</span>
        <Button
          onClick={() => dispatch(store.removeSelectedNodes())}
          title="Remove Nodes"
        />
      </>
    ) : selected.length === 1 ? (
      <>
        <span>{selected[0]}</span>
        <Button
          onClick={() => dispatch(store.addChildToSelected())}
          title="Add Child"
        />
        <Button
          onClick={() => dispatch(store.removeSelectedNodes())}
          title="Remove Node"
        />
      </>
    ) : (
      <span>No node selected</span>
    )}
  </div>
);
