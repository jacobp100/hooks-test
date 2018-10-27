import { useRef, useEffect } from "react";

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

export default (key, handler, { shiftKey = false, ctrlKey = false } = {}) => {
  const ref = useRef(null);
  ref.current = { key, handler, shiftKey, ctrlKey };

  useEffect(() => {
    shortcuts.push(ref.current);
    updateListerIfNeeded();

    return () => {
      const index = shortcuts.indexOf(ref.current);
      if (index !== -1) shortcuts.splice(index, 1);
      updateListerIfNeeded();
    };
  }, []);

  useEffect(
    () => {
      const shortcut = ref.current;
      shortcut.key = key;
      shortcut.handler = handler;
      shortcut.shiftKey = shiftKey;
      shortcut.ctrlKey = ctrlKey;
    },
    [key, handler, shiftKey, ctrlKey]
  );
};
