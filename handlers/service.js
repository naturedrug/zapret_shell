import { ipcMain } from "electron";
import { spawn } from "node:child_process"
import path from "path";
import { dirname } from 'node:path';
import { fileURLToPath } from "node:url";
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = path.join(__dirname, "..", "config.json")

ipcMain.handle("switch-game-filter", (event, mode) => {

    const GFPath = path.join(__dirname, "..", "zapret", "switch_game_filter.py")

    const process = spawn("python", [GFPath, mode])

    process.stdout.on("data", (data) => {
        const formated = String(data)

        console.log("\nswitch G F: " + formated)
    })

    let error = false;

    process.stderr.on("data", (err) => {

        error = String(err)
    })

    if (error) {
        console.log("switch-game-filter error: " + error)
        return 1
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

    config["game-filter"] = mode

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
})

ipcMain.handle("check-updates", () => {
    const CUPath = path.join(__dirname, "..", "zapret", "check_updates.py")

    const process = spawn("python", [CUPath])

    process.stdout.on("data", (data) => {
        const formated = String(data)

        console.log("\ncheck updates: " + formated)
    })

    let error = false;

    process.stderr.on("data", (err) => {

        error = String(err)

        console.log(error)
    })

    if (error) {
        console.log("check updates error: " + error)
        return 1
    }
})

ipcMain.handle("check-status", () => {
    const CSPath = path.join(__dirname, "..", "zapret", "check_updates.py") // CHANGE ON check_status.py LATER!!

    const process = spawn("python", [CSPath])

    process.stdout.on("data", (data) => {
        const formated = String(data)

        console.log("\ncheck status: " + formated)
    })

    let error = false;

    process.stderr.on("data", (err) => {

        error = String(err)

        console.log(error)
    })

    if (error) {
        console.log("check status error: " + error)
        return 1
    }
})