export let activeEffect = undefined;
class ReactiveEffect {
    parent = undefined;
    constructor(public fn) {}
    deps = []; // effect中药记录哪些属性实在effect中使用的
    run() {
        try {
            this.parent = activeEffect;
            activeEffect = this;
            // 当运行的时候我们需要将属性和对应的effect关联起来
            return this.fn(); // 出发属性的get
        } finally {
            activeEffect = this.parent;
            this.parent = undefined;
        }
    }
}

function effect(fn) {
    // 将用户的函数，变成一个响应式的函数
    const _effect = new ReactiveEffect(fn);
    // 默认让用用户的函数执行一次
    _effect.run();
}
export { effect };
