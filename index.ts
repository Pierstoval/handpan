import { Application, MiddlewareFunc, HandlerFunc } from "https://deno.land/x/abc@v1.0.0-rc10/mod.ts";
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
    .use(function(next: HandlerFunc): HandlerFunc{
        console.info('Request incoming!', arguments);
        console.info('arguments[0]', arguments[0]);
        console.info('arguments[1]', arguments[1]);
        return next;
    })
    .get("/", async (c) => {
        await c.render('./assets/index.html');
    })
    .static('/assets', './assets')
    .static('/build', './build')
    .start({
        port: PORT
    })
;
