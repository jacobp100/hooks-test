import React, { useReducer } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Button from "./Button";
import GraphView from "./GraphView";

const updater = (current, by) => Math.max(current + by, 0);

// This is really just to demonstrate there's no global state, and that you can
// have multiple graph views
export default DragDropContext(HTML5Backend)(() => {
  const [numGraphViews, incrementGraphViewBy] = useReducer(updater, 1);

  return (
    <>
      <Button onClick={() => incrementGraphViewBy(1)} title="Add Graph View" />
      <Button
        onClick={() => incrementGraphViewBy(-1)}
        title="Remove Graph View"
      />
      {Array.from({ length: numGraphViews }, (_, i) => (
        <GraphView key={i} />
      ))}
    </>
  );
});
