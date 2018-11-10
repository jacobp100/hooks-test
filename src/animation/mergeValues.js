import { action } from "popmotion";

export default (...values) =>
  action(({ update }) => {
    const currentValues = values.map(v => v.get());

    const subscriptions = values.map((value, i) =>
      value.subscribe(currentValue => {
        currentValues[i] = currentValue;
        update(currentValues);
      })
    );

    return {
      stop() {
        subscriptions.forEach(subscription => subscription.unsubscribe());
      }
    };
  });
