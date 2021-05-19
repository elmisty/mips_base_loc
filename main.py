from FINDMIPSBASE import *

if __name__ == "__main__":
    do_find = FINDMIPSBASE('./Test_FW/54B5_wr543gv2', wnd_size=4, byte_order='big', decoy="Wireless")
    #do_find = FINDMIPSBASE('./Test_FW/1310_n604r_kr_8_88', wnd_size=4, byte_order='big', decoy="PPPoE")
    #do_find = FINDMIPSBASE('./Test_FW/B664_n604s_kr_8_96', wnd_size=4, byte_order='little', decoy="invalid")
    do_find.do_analyze()