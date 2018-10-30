import { useEffect } from "react";

export const useValueOutput = (value, updater) => {
  useEffect(() => value.start(updater).stop, [value, updater]);
};

export const useMulticastOutput = (value, updater) => {
  useEffect(() => value.subscribe(updater).unsubscribe, [value, updater]);
};
