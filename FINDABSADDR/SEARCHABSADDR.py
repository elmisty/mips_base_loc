from FINDABSADDR.FINDTOOLS import calc_with_pair, chk_lui, chk_lui_pair, ext_imm, ext_opcode
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
        self.fp = ''

    def set_raw_data(self):
        self.raw_data = open_raw_data(self.imgpath)
        self.fp = open(self.imgpath, 'rb')
        # self.raw_data = self.fp.read()

    def chk_mtc0_reg(self, borl):
        mtc0_ptr = self.fp.tell() - 4
        mtc0_ptr = mtc0_ptr - (self.wnd_size + 4)

        for i in range(0, self.wnd_size):
            insp_bytes = self.raw_data[mtc0_ptr:mtc0_ptr + (4 * i)]
            if borl == 'little':
                insp_bytes = ltob(insp_bytes)
            insp_bit = btob(insp_bytes)
            print(ext_rt(insp_bit))
    
    def search_pair_inst(self, imm_lui):
        ret_result = 0xffffffff

        for i in range(0, self.wnd_size):
            insp_bytes = ltob(self.fp.read(4))
            insp_bit = btob(insp_bytes)
            if chk_lui(insp_bit):
                self.fp.seek(-4, 1)
                return 1
            
            imm_pair = chk_lui_pair(insp_bit)
            if imm_pair:
                pair_inst = ext_opcode(insp_bit)
                ret_result = calc_with_pair(pair_inst, imm_lui, imm_pair)

        if ret_result != int(0xffffffff):
            print('DATA : 0x{}:08x'.format(ret_result))

    def search_abs_addr(self, borl):
        fp = self.fp
        sr = '01100'
        base = 0x8000
        base_hi = 0x8084
        # base = 0x0400
        idx = 0

        while True:
            insp_bytes = self.fp.read(4)
            if idx == 10000000:
                return 0
            if borl == 'little':
                insp_bytes = ltob(insp_bytes)
            
            insp_bit = btob(insp_bytes)
            # print(insp_bit)
            if chk_lui(insp_bit):
                # pair_reg = chk_lui(insp_bit)
                # if pair_reg:
                imm_a = ext_imm(insp_bit)
                """
                if int(imm_a, base = 2) > int(base) or int(imm_a, base = 2) < int(base_hi):
                    continue
                """
                if int(imm_a, base=2) >= int(base) and int(imm_a, base=2) < int(base_hi):
                    if self.search_pair_inst(imm_a) == 1:
                        continue
            """
            if chk_mtc0(insp_bit):
                if chk_rd(insp_bit, sr):
                    # self.chk_mtc0_reg(borl)
                    sys.exit(0)
            """

            idx += 1

    def do_analyze(self):
        self.set_raw_data()
        self.search_abs_addr('little')
        # self.search_abs_addr('big')

test = SEARCHABSADDR('../B664', 0, 0, 4)
test.do_analyze()

"""
| opcode |  $rs  |  $rt  |  $rd  |     func    |
| 010000 | 00100 | 11010 | 01100 | 00000000000 |
| 010000 | 00100 | 10001 | 01100 | 00000000000 |

# lui instruction
ex) lui $k1, 0x4000
| opcode |  $rs  |  $rt  \  $rd  |    func     |
| 001101 | 11010 | 11010 | 00000 | 00011100000 |
"""