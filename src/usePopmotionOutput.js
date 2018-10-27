import { useEffect } from "react";

export default (value, updater) => {
  useEffect(() => value.subscribe(updater).unsubscribe, [value, updater]);
};
