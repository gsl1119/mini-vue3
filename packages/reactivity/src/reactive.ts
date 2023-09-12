import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";
export const enum ReactiveFlags {
    "IS-REACTIVE" = "__v_isReactive",
}

function reactive(target) {
    return createRectiveObject(target);
}

const reactiveMap = new WeakMap(); // 防止内存泄漏的，第一个值只能是对象

// 响应式对象的核心逻辑

function createRectiveObject(target) {
    if (!isObject(target)) {
        return;
    }

    if (target[ReactiveFlags["IS-REACTIVE"]]) {
        return target;
    }

    // 防止同一个对象被代理两次，返回的永远是同一个对象
    let exitstingProxy = reactiveMap.get(target);
    if (exitstingProxy) {
        return exitstingProxy;
    }
    // 返回的是代理对象
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    // 代理前代理后做一个映射表
    // 如果用同一个代理对象做代理，直接返回上一次的代理结束
    // 代理后做一个映射表
    return proxy;
}

export { reactive };
