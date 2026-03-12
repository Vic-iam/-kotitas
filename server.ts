import express, { Request, Response } from 'express'
import { createServer as createViteServer } from 'vite'
import fs from "node:fs"

const app = express()
const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
})

app.use(vite.middlewares)

app.use(async (req: Request, res: Response) => {
    const url = req.originalUrl
    let template = fs.readFileSync('index.html', 'utf-8')
    template = await vite.transformIndexHtml(url, template)
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
    const html = render()
    const result = template.replace('<!--ssr-outlet-->', html)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(result)
})

app.listen(5173)
