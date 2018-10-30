import { useMemo, useEffect } from "react";

const shortcuts = [];

const eventHandler = e => {
  shortcuts.forEach(s => {
    const activated =
      s.key === e.key && s.shiftKey === e.shiftKey && s.ctrlKey === e.ctrlKey;

    if (activated) s.handler();
  });
};

let hasListener = false;
const updateListerIfNeeded = () => {
  const needsListener = shortcuts.length > 0;
  if (!hasListener && needsListener) {
    document.addEventListener("keypress", eventHandler);
    hasListener = true;
  } else if (hasListener && !needsListener) {
    document.removeEventListener("keypress", eventHandler);
    hasListener = false;
  }
};

const createEmptyMutableObject = () => ({});

export default (key, handler, { shiftKey = false, ctrlKey = false } = {}) => {
  const shortcut = useMemo(createEmptyMutableObject);

  useEffect(
    () => {
      shortcut.key = key;
      shortcut.handler = handler;
      shortcut.shiftKey = shiftKey;
      shortcut.ctrlKey = ctrlKey;
    },
    [shortcut, key, handler, shiftKey, ctrlKey]
  );

  useEffect(() => {
    shortcuts.push(shortcut);
    updateListerIfNeeded();

    return () => {
      const index = shortcuts.indexOf(shortcut);
      if (index !== -1) shortcuts.splice(index, 1);
      updateListerIfNeeded();
    };
  }, []);
};
