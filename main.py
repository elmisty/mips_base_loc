from FINDMIPSBASE import *

if __name__ == "__main__":
    do_find = FINDMIPSBASE('./B664', wnd_size=4, byte_order='little')
    do_find.do_analyze()