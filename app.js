import { app, BrowserWindow, ipcMain, dialog } from "electron"
import path from "node:path"
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { spawn } from "node:child_process";

import fs from "fs"

import { Tray, Menu } from "electron/main";

import "./handlers/service.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), 'utf-8'))


let zapretProcess = null

let zapretFolder = config["zapret-directory"]

let mainWindow
let optionsWindow;

async function changeVBSTarget(bat, batPath) {

    // change bat for starting in vbs file

    fs.writeFileSync(path.join("hidden.vbs"), `
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "${config["zapret-directory"]}"
WshShell.Run Chr(34) & "${bat}" & Chr(34), 0, False
`, 'utf-8')

    const batFile = fs.readFileSync(path.join(batPath), 'utf-8')

    await fs.promises.writeFile(batPath, batFile.replace("/min", "/B"), 'utf-8')
}

ipcMain.handle("zapret_switchon", () => {
    console.log("switch")

    const vbs = path.join("hidden.vbs")

    zapretProcess = spawn('wscript.exe', [vbs], {
        windowsHide: true,
        detached: true,
        stdio: 'ignore'
    })

    zapretProcess.unref()
})

ipcMain.handle("zapret_switchoff", () => {
    const killer = spawn("taskkill", ["/F", "/IM", "winws.exe"], {
        windowsHide: true,
        stdio: "ignore"
    })

    killer.unref()

})


ipcMain.handle("zapret_select_folder", async () => {

    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })

    if (result.filePaths[0]) {
        const folder = result.filePaths[0]

        zapretFolder = folder;

        const changeConfig = config

        changeConfig["zapret-directory"] = folder

        config["zapret-directory"] = folder

        const batPath = path.join(folder, config["alt"] ? config["alt"] : "general.bat")

        changeVBSTarget(config["alt"], batPath)

        fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify((changeConfig), null, 2), 'utf-8')

        return result.filePaths[0]
    } else return console.log("dialog is closed")

})

ipcMain.handle("get-config", () => {
    return config
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    mainWindow = win

    win.loadFile("./windows/index.html")

    win.on("close", (e) => {
        e.preventDefault()

        win.hide()
    })
}

ipcMain.handle("get-alts", async () => {
    const alts = []

    const folder = await fs.promises.readdir(zapretFolder)

    folder.forEach((fileName) => {

        if (fileName.includes("general")) {

            alts.push(fileName)
        }

    })

    return alts

})


ipcMain.handle("change-alt", async (event, altName) => {
    console.log(altName)

    config["alt"] = altName;

    await fs.promises.writeFile(path.join(__dirname, "config.json"), JSON.stringify(config, null, 2), 'utf-8')

    const batPath = path.join(config["zapret-directory"], config["alt"] ? config["alt"] : "general.bat")

    await fs.promises.writeFile(path.join("hidden.vbs"), `
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "${config["zapret-directory"]}"
WshShell.Run Chr(34) & "${batPath}" & Chr(34), 0, False
`, 'utf-8')

    const batFile = fs.readFileSync(path.join(batPath), 'utf-8')

    await fs.promises.writeFile(batPath, batFile.replace("/min", "/B"), 'utf-8')


})

ipcMain.handle("open-options", () => {

    if (!optionsWindow) {
        const options = new BrowserWindow({
            width: 500,
            height: 700,
            webPreferences: {
                preload: path.join(__dirname, "preload.js")
            }
        })
    
        options.on("close", (e) => {
            e.preventDefault()
    
            options.hide()
        })
    
        options.loadFile("./windows/ipsetlist.html")

        optionsWindow = options
    } else {
        optionsWindow.show()
    }

})

ipcMain.handle("get-ipset", async () => {
    if (!zapretFolder) return

    const ipsetlist = await fs.promises.readFile(path.join(zapretFolder, "lists", "list-general.txt"))

    const formated = ipsetlist.toString('utf-8')

    return formated
})

ipcMain.handle("new-ipset", async (event, ipset) => {
    if (!zapretFolder) return

    await fs.promises.writeFile(path.join(zapretFolder, "lists", "list-general.txt"), ipset, 'utf-8')
})


app.on('window-all-closed', () => {
    console.log("closed")
})

app.whenReady().then(() => {
    const tray = new Tray(path.join(__dirname, "icon.png"))
    createWindow()

    const contextMenu = Menu.buildFromTemplate([
        { label: "Закрыть", click: () => app.exit() }
    ])
    tray.setContextMenu(contextMenu)

    tray.on("click", () => {
        mainWindow.show()
    })

})