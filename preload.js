const { contextBridge, ipcRenderer } =  require("electron");

contextBridge.exposeInMainWorld("electron", {
    switchon: () => ipcRenderer.invoke("zapret_switchon"),
    switchoff: () => ipcRenderer.invoke("zapret_switchoff"),
    selectZapretFolder: () => ipcRenderer.invoke("zapret_select_folder"),
    getConfig: () => ipcRenderer.invoke("get-config"),
    getALTS: () => ipcRenderer.invoke("get-alts"),
    changeALT: (altName) => ipcRenderer.invoke("change-alt", altName),


    openOptions: () => ipcRenderer.invoke("open-options"),

    getIpsetList: () => ipcRenderer.invoke("get-ipset"),

    newIpset: (ipset) => ipcRenderer.invoke("new-ipset", ipset)
})

ipcRenderer.invoke("get-alts")