const { contextBridge, ipcRenderer } =  require("electron");

contextBridge.exposeInMainWorld("electron", {
    switchon: () => ipcRenderer.invoke("zapret_switchon"),
    switchoff: () => ipcRenderer.invoke("zapret_switchoff"),
    selectZapretFolder: () => ipcRenderer.invoke("zapret_select_folder"),
    getConfig: () => ipcRenderer.invoke("get-config")
})