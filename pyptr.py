from ctypes import *
import binascii


def ref_val(target):
    longsize = sizeof(c_long)
    #return c_uint.from_address(target + longsize * 3).value
    return c_uint.from_address(target).value
'''
if __name__ == '__main__':
    fd = open('sony', 'rb')
    fd2 = open('sony', 'rb')
    a = 0x1234
    b = id(a)
    all = fd.read()
    
    print(hex(b))
    c = ref_val(b)
    print('a : ', b)
    print('ref_val : ', c)
'''