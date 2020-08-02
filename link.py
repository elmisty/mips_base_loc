from pyptr import *
import sys
import os

'''
from mips_link_loc import *

a = FET()
a.append(head=1, gap=2, table_size=3)
a.append(head=4, gap=5, table_size=6)
a.append(head=7, gap=8, table_size=9)

data = a.first()
print(data)
data = a.next()
print(data)
data = a.next()
print(data)
'''

fd = open('sony', 'rb')
bin = fd.read()
#print(bin)
print('bin : ', binascii.b2a_hex(bin[:4]))
print(int(binascii.b2a_hex(bin[:4]), 16))

filesize = sys.getsizeof(bin[0:4])
print(filesize)

#ref_val(bin[0:0+4])