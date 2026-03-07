const switchBtn = document.querySelector(".switch")

const zapretFolder = document.querySelector(".zapretFolder")

const zapretFolderValue = document.querySelector(".zapretFolder .folderValue")

let zapretStatus = false // zapret turn status

const selectAlt = document.querySelector(".selectAlt select")

selectAlt.addEventListener("change", (e) => {
    console.log("chosen:" + selectAlt.value)

    window.electron.changeALT(selectAlt.value)
})

window.addEventListener("load", async () => {
    const config = await window.electron.getConfig()

    zapretFolderValue.textContent = config['zapret-directory']

    const alts = await window.electron.getALTS()

    alts.forEach(alt => {
        const newOption = document.createElement("option")
        newOption.textContent = alt

        selectAlt.appendChild(newOption)
    });
})




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