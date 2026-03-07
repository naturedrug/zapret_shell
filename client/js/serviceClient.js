const gameFilterSelect = document.querySelector(".gameFilter select")
const gameFilterLabel = document.querySelector(".gameFilter p")

let gameFilterState = ""

let config = {}

window.addEventListener("load", async () => {
    config = await window.electron.getConfig()

    gameFilterLabel.textContent = `Game Filter: ${config['game-filter']}`
    gameFilterSelect.value = config['game-filter']
})



gameFilterSelect.addEventListener("change", (e) => {

    
    gameFilterState = gameFilterSelect.value
    
    window.electron.switchGameFilter(gameFilterState)
    console.log(gameFilterState)



    gameFilterLabel.textContent = `Game Filter: ${gameFilterState}`
})