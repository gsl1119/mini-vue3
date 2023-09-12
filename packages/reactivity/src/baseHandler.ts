import { activeEffect, effect } from "./effect";
import { ReactiveFlags } from "./reactive";

export const mutableHandlers = {
    // 原始对象 属性 代理对象
    get(target, key, recevier) {
        if (key === ReactiveFlags["IS-REACTIVE"]) {
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
    },
};
// {
//     name: "jw",
//     age: 30,
// } -> name => [effect1, effect2]

// map = {data:map2} map2 = {name:set(effect1,effect2)}
const targetMap = new WeakMap();

function track(target, key) {
    if (activeEffect) {
        // 当前属性实在effect中使用的才会收集，否则不收集
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }
        let shouldTrack = !dep.has(activeEffect);
        if (shouldTrack) {
            dep.add(activeEffect);
            activeEffect.deps.push(dep);
        }
    }
}

function trigger(target, key, value, oldValue) {
    // 找到effect执行即可
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const effects = depsMap.get(key);
    if (effects) {
        effects.forEach((effect) => {
            // 当前正在执行和现在要执行的是同一个就屏蔽掉
            if (activeEffect !== effect) {
                effect.run();
            }
        });
    }
}
