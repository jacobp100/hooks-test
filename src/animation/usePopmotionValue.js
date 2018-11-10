import { useMemo } from "react";
import { value } from "popmotion";

export default initialValue => useMemo(() => value(initialValue), []);
