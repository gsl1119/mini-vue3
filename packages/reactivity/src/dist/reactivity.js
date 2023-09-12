// packages/reactivity/src/effect.ts
var activeEffect = void 0;
var ReactiveEffect = class {
  constructor(fn) {
    this.fn = fn;
    this.parent = void 0;
    this.deps = [];
  }
  // effect中药记录哪些属性实在effect中使用的
  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = void 0;
    }
  }
};
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

// packages/shared/src/index.ts
function isObject(val) {
  return typeof val === "object" && val !== null;
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  // 原始对象 属性 代理对象
  get(target, key, recevier) {
    if (key === "__v_isReactive" /* IS-REACTIVE */) {
      return true;
    }
    track(target, key);
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    let oldValue = target[key];
    let flag = Reflect.set(target, key, value, recevier);
    if (value !== oldValue) {
      trigger(target, key, value, oldValue);
    }
    return flag;
  }
};
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
}
function trigger(target, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = depsMap.get(key);
  if (effects) {
    effects.forEach((effect3) => {
      if (activeEffect !== effect3) {
        effect3.run();
      }
    });
  }
}

// packages/reactivity/src/reactive.ts
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS-REACTIVE"] = "__v_isReactive";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function reactive(target) {
  return createRectiveObject(target);
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createRectiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (target["__v_isReactive" /* IS-REACTIVE */]) {
    return target;
  }
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
export {
  ReactiveFlags,
  activeEffect,
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
