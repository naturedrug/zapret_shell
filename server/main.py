from fastapi import FastAPI
from service import Zapret


app = FastAPI()

@app.get("/")
def main():
    return "Running"

@app.post("/game-filter-change")
def switch_game_filter(mode):

    return Zapret.switch_game_filter(mode)

