import { Application } from "https://deno.land/x/abc@v1.0.0-rc10/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

const PORT = 8000;

console.log(`http://127.0.0.1:${PORT}/`);

const app = new Application();

app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};

app
    .use((next) => (c) => {
        console.log(`${c.request.proto} ${c.request.method} ${c.path}`);
        return next(c);
    })
    .static('/build', './build')
    .static('/js', './public/js')
    .static('/css', './public/css')
    .static('/vendor', './public/vendor')
    .get("/", async (c) => {
        console.log(`Resolved index.`);
        await c.render('./public/index.html');
    })
    .start({
        port: PORT
    })
;
