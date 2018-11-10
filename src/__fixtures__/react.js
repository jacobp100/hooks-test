const REF = Symbol("REF");
const STATE = Symbol("STATE");
const MEMO = Symbol("MEMO");
const EFFECT = Symbol("EFFECT");

let activeHookContext = null;

const updateActiveHookContext = () => {
  activeHookContext.i = 0;
  activeHookContext.fn(...activeHookContext.args);
};

const addHook = hook => {
  activeHookContext.hooks.push(hook);
  activeHookContext.i = activeHookContext.length - 1;
};

const valuesEqual = (a, b) => a.every((input, i) => Object.is(input, b[i]));

const getHook = () => {
  const { i, hooks } = activeHookContext;
  if (i <= hooks.length - 1) {
    const value = hooks[i];
    activeHookContext.i += 1;
    return value;
  }
  return null;
};

export const setActiveContext = hookContext => {
  activeHookContext = hookContext;
};

export const mount = (fn, args) => {
  const hookContext = { fn, args, hooks: [], i: 0 };
  setActiveContext(hookContext);
  updateActiveHookContext();
  return hookContext;
};

export const unmount = hookContext => {
  hookContext.hooks
    .filter(hook => hook.type === EFFECT)
    .forEach(({ cleanup }) => {
      if (cleanup != null) cleanup();
    });
  if (activeHookContext === hookContext) {
    hookContext = null;
  }
};

export const update = (hookContext, args) => {
  activeHookContext = hookContext;
  hookContext.args = args;
  updateActiveHookContext();
};

export const useRef = initial => {
  const hook = getHook();
  if (hook != null) {
    return hook.ref;
  } else {
    const ref = { current: initial };
    addHook({ type: REF, ref });
    return ref;
  }
};

export const useState = initialState => {
  const hook = getHook();
  if (hook != null) {
    const { value, setState } = hook;
    return [value, setState];
  } else {
    const hook = {
      type: STATE,
      value: initialState,
      setState(value) {
        hook.value = initialState;
        updateActiveHookContext();
      }
    };
    addHook(hook);
    return [hook.value, hook.setState];
  }
};

export const useMemo = (create, inputs) => {
  let hook = getHook();
  let current;
  if (hook != null) {
    const prevInputs = hook.inputs;
    const canReuse =
      (inputs == null && hook.create === create) ||
      (inputs != null && valuesEqual(prevInputs, inputs));
    if (!canReuse) {
      hook.current = create();
    }
    hook.inputs = inputs;
    return hook.current;
  } else {
    current = create();
    addHook({ type: MEMO, create, inputs, current });
    return current;
  }
};

export const useEffect = (fn, inputs) => {
  const hook = getHook();
  if (hook != null) {
    const prevInputs = hook.inputs;
    const shouldFire =
      inputs == null || (inputs.length > 0 && !valuesEqual(prevInputs, inputs));
    if (shouldFire) {
      if (typeof hook.cleanup === "function") {
        hook.cleanup();
      }
      hook.cleanup = fn();
    }
    hook.inputs = inputs;
  } else {
    const cleanup = fn();
    addHook({
      type: EFFECT,
      inputs,
      cleanup
    });
  }
};
