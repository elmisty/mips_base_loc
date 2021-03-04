import os
import struct

from os.path import join
from FINDTOOLS import *
from bitstring import BitArray, ConstBitStream

class SEARCHABSADDR:
    def __init__(self, imgpath, start, end, wnd_size):
        self.imgpath = imgpath
        self.start = start
        self.end = end
        self.wnd_size = wnd_size
        self.raw_data = 0

    def set_raw_data(self):
        self.raw_data = open_raw_data(self.imgpath)

    def search_abs_addr(self):
        ext_opcode(self.raw_data[0:4])
        ext_imm(self.raw_data[0:4])

    def do_analyze(self):
        self.set_raw_data()
        self.search_abs_addr()
        print(len(self.raw_data)/4)
        #search_lui_inst(self.raw_data)

test = SEARCHABSADDR('../B664', 0, 0, 4)
test.do_analyze()