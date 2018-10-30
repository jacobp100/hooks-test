const historyMs = 50;
const minHistoryMs = 30;

export default () => {
  let pointHistory = [];

  const removeOldHistory = t => {
    const minTime = t - historyMs;
    const initialItemsToDelete = pointHistory.findIndex(p => p.t >= minTime);
    if (initialItemsToDelete > 0) {
      pointHistory.splice(0, initialItemsToDelete);
    }
  };

  return {
    begin() {
      pointHistory = [];
    },
    update({ x, y, zoom }) {
      const t = Date.now();
      if (pointHistory.length > 0 && pointHistory[0].zoom !== zoom) {
        pointHistory.length = 0;
      } else {
        removeOldHistory(t);
      }
      pointHistory.push({ x, y, zoom, t });
    },
    finalize() {
      const t = Date.now();
      removeOldHistory(t);
      const totalT = pointHistory.length > 0 ? t - pointHistory[0].t : 0;
      if (pointHistory.length > 2 && totalT > minHistoryMs) {
        const firstPoint = pointHistory[0];
        const lastPoint = pointHistory[pointHistory.length - 1];
        const xVelocity = (1000 * (lastPoint.x - firstPoint.x)) / totalT;
        const yVelocity = (1000 * (lastPoint.y - firstPoint.y)) / totalT;
        pointHistory = null;
        return { x: xVelocity, y: yVelocity };
      }

      pointHistory = null;
      return null;
    }
  };
};
