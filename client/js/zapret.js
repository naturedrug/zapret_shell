const switchBtn = document.querySelector(".switch")

const zapretFolder = document.querySelector(".zapretFolder")

const zapretFolderValue = document.querySelector(".zapretFolder .folderValue")

let zapretStatus = false // zapret turn status

window.onload = async () => {

    const config = await window.electron.getConfig()
    
    console.log(config)
    zapretFolderValue.textContent = config['zapret-directory']
}



switchBtn.addEventListener("change", () => {
    if (!zapretStatus) {

        window.electron.switchon()

        zapretStatus = true
    } else {
        window.electron.switchoff()
        zapretStatus = false
    }
})

zapretFolder.addEventListener("click", async () => {
    const folder = await window.electron.selectZapretFolder()

    

    zapretFolderValue.textContent = folder
})