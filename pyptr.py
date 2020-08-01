from ctypes import *

def ref_val(target):
    longsize = sizeof(c_long)
    return c_ulong.from_address(target + longsize * 3).value