export default () => {
  let handledMultipleEvents = false;

  return {
    begin() {
      handledMultipleEvents = false;
    },
    update() {
      handledMultipleEvents = true;
    },
    finalize() {
      const didRecognize = !handledMultipleEvents;
      handledMultipleEvents = false;
      return didRecognize;
    }
  };
};
