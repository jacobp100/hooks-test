import { useCallback, useState, useEffect } from "react";

export default isInteractive => {
  const [additive, setAdditive] = useState(false);

  const toggleAdditive = useCallback(
    e => {
      if (e.key === "Shift") setAdditive(e.type === "keydown");
    },
    [setAdditive]
  );

  useEffect(
    () => {
      if (!isInteractive) return null;

      document.addEventListener("keydown", toggleAdditive);
      document.addEventListener("keyup", toggleAdditive);

      return () => {
        document.removeEventListener("keydown", toggleAdditive);
        document.removeEventListener("keyup", toggleAdditive);
      };
    },
    [isInteractive, toggleAdditive]
  );

  return [additive, setAdditive];
};
