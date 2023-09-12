// 开发环境搭建
import minimist from "minimist";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import esbuild from "esbuild";
// node scripts/dev.js reactivity -f esm
const args = minimist(process.argv.slice(2)); // { _: [ 'reactivity' ], f: 'esm' }
const format = args.f || "iife"; // esm
const target = args._[0] || "reactivity"; // reactivity

const __dirname = dirname(fileURLToPath(import.meta.url));

const IIFENamesMap = {
    reactivity: "VueReactivity",
};

esbuild
    .context({
        entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
        outfile: resolve(
            __dirname,
            `../packages/${target}/src/dist/${target}.js`
        ),
        bundle: true, // 将所有的文件打包在一起
        sourcemap: true, // 生成sourcemap
        format, // 输出格式
        globalName: IIFENamesMap[target],
        platform: "browser",
    })
    .then((ctx) => ctx.watch());
