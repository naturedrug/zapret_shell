from service import Zapret
import sys

zapret = Zapret()

def main(args):
    mode = args[0]

    zapret.switch_game_filter(mode)
    
    return 0

if (__name__ == "__main__"):
    main(sys.argv[1:])