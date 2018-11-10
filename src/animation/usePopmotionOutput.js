import { useLayoutEffect } from "react";

export const useActionOutput = (value, updater) => {
  useLayoutEffect(() => value.start(updater).stop, [value, updater]);
};

export const useMulticastOutput = (value, updater) => {
  useLayoutEffect(() => value.subscribe(updater).unsubscribe, [value, updater]);
};
