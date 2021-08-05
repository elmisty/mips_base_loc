from FINDMIPSBASE import *

if __name__ == "__main__":
    #do_find = FINDMIPSBASE('./Test_FW/EXIST_GP/54B5_wr543gv2', wnd_size=4, match_size=1500, byte_order='big')
    #do_find = FINDMIPSBASE('./Test_FW/EXIST_GP/1310_n604r_kr_8_88', wnd_size=4, match_size=1500, byte_order='big')
    #do_find = FINDMIPSBASE('./Test_FW/EXIST_GP/25062_EW7303APn', wnd_size=4, match_size=8000, byte_order='big')
    #do_find = FINDMIPSBASE('./Test_FW/EXIST_GP/B664_n604s_kr_8_96', wnd_size=4, match_size=1500, byte_order='little')
    #do_find = FINDMIPSBASE('./Test_FW/EXIST_GP/10400_TL-WR841N', wnd_size=4, match_size=1600, byte_order='little')
    #do_find = FINDMIPSBASE('./Test_FW/vmlinux_org.bin', wnd_size=4, match_size=1500, byte_order='big')
    do_find = FINDMIPSBASE('./Test_FW/40', wnd_size=4, match_size=9800, byte_order='big')
    #do_find.do_analyze()
    do_find.do_analyze(mode='manual', gp_reg=0x80304000)