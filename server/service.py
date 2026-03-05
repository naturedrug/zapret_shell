import subprocess
import json

with open("../config.json", encoding="utf-8") as file:
    file_d = json.load(file)

zapret_path = file_d["zapret-directory"]


class Zapret:
    def __init__(self, zapret_path):
        self.zapret_path = zapret_path


    @staticmethod
    def run(self, command: str):
        proc = subprocess.run(
            [f"{self.zapret_path}\\service.bat", command],
            cwd=zapret_path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            shell=True
        )

        return proc
    
    @staticmethod
    def status(self):
        return self.run("status_zapret")

    @staticmethod
    def check_updates(self):
        return self.run("check_updates").stdout
    
    @staticmethod
    def switch_game_filter(self, mode : str):

        # mode
        # all // tcp // udp

        game_filter_enabled = open(zapret_path + "/utils/game_filter.enabled", 'w+')

        game_filter_enabled.write(mode)

        game_filter_enabled.close()

        return 0