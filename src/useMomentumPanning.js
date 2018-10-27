import { useRef } from "react";

const historyMs = 50;
const minHistoryMs = 30;

const createApi = beginPanRef => {
  const pointHistory = []; // Never changes, all mutations

  const removeOldHistory = t => {
    const minTime = t - historyMs;
    const initialItemsToDelete = pointHistory.findIndex(p => p.t >= minTime);
    if (initialItemsToDelete > 0) {
      pointHistory.splice(0, initialItemsToDelete);
    }
  };

  return {
    start() {
      pointHistory.length = 0;
    },
    addPoint({ x, y, zoom }) {
      const t = Date.now();
      if (pointHistory.length > 0 && pointHistory[0].zoom !== zoom) {
        pointHistory.length = 0;
      } else {
        removeOldHistory(t);
      }
      pointHistory.push({ x, y, zoom, t });
    },
    end() {
      const t = Date.now();
      removeOldHistory(t);
      const totalT = pointHistory.length > 0 ? t - pointHistory[0].t : 0;
      if (pointHistory.length > 2 && totalT > minHistoryMs) {
        const firstPoint = pointHistory[0];
        const lastPoint = pointHistory[pointHistory.length - 1];
        const xVelocity = (1000 * (lastPoint.x - firstPoint.x)) / totalT;
        const yVelocity = (1000 * (lastPoint.y - firstPoint.y)) / totalT;
        beginPanRef.current({ xVelocity, yVelocity });
      }
      pointHistory.length = 0;
    }
  };
};

export default beginPan => {
  /*
  Ensure we keep pan history even if the pan handler changes. See useD3Zoom for
  more information. This is a correctness issue, not performance.
  */
  const beginPanRef = useRef(null);
  beginPanRef.current = beginPan;

  const api = useRef(null);
  if (api.current == null) {
    api.current = createApi(beginPanRef);
  }

  return api.current;
};
