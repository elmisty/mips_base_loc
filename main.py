from mips_base_loc import *

if __name__ == "__main__":
    do_AAS = mips_base_loc("n604r_kr_8_88.bin", 4)
    do_AAS.set_file_fd()
    do_AAS.do_AAS()