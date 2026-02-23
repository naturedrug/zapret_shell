import { app, BrowserWindow, ipcMain, dialog } from "electron"
import { nativeImage } from "electron/common";
import path from "node:path"
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { spawn } from "node:child_process";

import fs from "fs"
import { kill } from "node:process";
import { Tray, Menu } from "electron/main";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), 'utf-8'))


let zapretProcess = null

let mainWindow

ipcMain.handle("zapret_switchon", () => {
    console.log("switch")

    const vbs = path.join(__dirname, "hidden.vbs")

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

    const folder = result.filePaths[0]

    const changeConfig = config

    changeConfig["zapret-directory"] = folder

    config["zapret-directory"] = folder

    const batPath = path.join(folder, "general (ALT3).bat")

    fs.writeFileSync(path.join(__dirname, "hidden.vbs"), `
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "${folder}"
WshShell.Run Chr(34) & "${batPath}" & Chr(34), 0, False
`, 'utf-8')

    const batFile = fs.readFileSync(path.join(batPath), 'utf-8')

    fs.writeFileSync(batPath, batFile.replace("/min", "/B"), 'utf-8')

    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify((changeConfig), null, 2), 'utf-8')

    return result.filePaths[0]
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

    win.loadFile("./index.html")

    win.on("close", (e) => {
        e.preventDefault()

        win.hide()
    }) 
}

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