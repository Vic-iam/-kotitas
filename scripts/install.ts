
import fs from "node:fs/promises"
import readline from "node:readline/promises"

type Config = {
    host: string,
    port: string,
    username: string,
    password: string,
}

const defaults = {
    host: "localhost",
    port: "5432",
    username: "kotitas",
    password: "kotitas",
}



const install = async () => {
    const config: Config = defaults
    const files = await fs.readdir(__dirname + "./migrations")
    for (const f in files) {
    }
}

install()
