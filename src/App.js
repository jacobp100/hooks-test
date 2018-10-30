import React, { useReducer } from "react";
import Button from "./Button";
import GraphView from "./GraphView";

const updater = (current, by) => Math.max(current + by, 0);

// This is really just to demonstrate there's no global state, and that you can
// have multiple graph views
export default () => {
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
};
