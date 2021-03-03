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

    def search_lui_inst(self):
        


test = SEARCHABSADDR('../n604r_kr_8_88.bin', 0, 0, 4)
test.set_raw_data()