const ipsetlistTextarea = document.querySelector(".ipsetlist")

async function initTextarea() {
    const ipset = await window.electron.getIpsetList()

    ipsetlistTextarea.value = ipset
}


async function newIpset(ipset) {
    await window.electron.newIpset(ipset)
}

ipsetlistTextarea.addEventListener("keydown", async (e) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();

        await newIpset(ipsetlistTextarea.value)
    }
})

initTextarea()