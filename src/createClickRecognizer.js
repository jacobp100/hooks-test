export default () => {
  let handledMultipleEvents = false;

  return {
    reset() {
      handledMultipleEvents = false;
    },
    addPoint() {
      handledMultipleEvents = true;
    },
    finalize() {
      const didRecognize = !handledMultipleEvents;
      handledMultipleEvents = false;
      return didRecognize;
    }
  };
};
