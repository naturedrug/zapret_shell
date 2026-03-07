import subprocess
import os
import json

# all paths from app.js!!!

class Zapret:
    def __init__(self):
        with open("./config.json", encoding="utf-8") as file:
            file_d = json.load(file)

            self.zapret_path = file_d["zapret-directory"]


    
    def run(self, command: str):
        proc = subprocess.run(
            [f"{self.zapret_path}\\service.bat", command],
            cwd=self.zapret_path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            shell=True
        )

        return proc
    
    
    def status(self):
        return self.run("status_zapret")

    
    def check_updates(self):
        return self.run("check_updates").stdout
    
    
    def switch_game_filter(self, mode : str):

        # mode
        # all // tcp // udp // none

        game_filter_path = self.zapret_path + "/utils/game_filter.enabled"

        if (mode == "none"):
            os.remove(game_filter_path)

        else:
            game_filter_enabled = open(game_filter_path,  'w+')

            game_filter_enabled.write(mode)

            game_filter_enabled.close()


        self.run("load_game_filter")
        
        return 0