import os
import struct
import sys

from os.path import join, getsize
from .FINDTOOLS import *
from bitstring import BitArray, ConstBitStream

class FINDMIPSBASE:
    def __init__(self, imgpath, wnd_size, byte_order):
        self.imgpath = imgpath
        self.wnd_size = wnd_size
        self.byte_order = byte_order

        self.raw_data = 0
        self.fp = ''

    def set_raw_data(self):
        self.raw_data = open_raw_data(self.imgpath)
        self.fp = open(self.imgpath, 'rb')
        self.raw_data = open(self.imgpath, 'rb').read()

    def chk_off_str(self, str_addr, candi_base, trg_str):
        raw_data = self.raw_data
        diff_word = ''

        trg_addr = str_addr - candi_base

        i = 0
        if btoh(raw_data[trg_addr-2:trg_addr]) == '0000':
            while True:
                suspect = raw_data[trg_addr+i:trg_addr+(i+1)]
                alpha = suspect.isalpha()
                special = suspect.isalnum()

                if alpha or special:
                    diff_word += btos(suspect)
                else:
                    break
                i+=1

            if diff_word.isalnum() or diff_word.isalpha() and (btoh(raw_data[trg_addr-4:trg_addr]) == '00000000'):
                if trg_str in diff_word:
                    print("[!] BASE ADDRESS FOUNDED!!... ", hex(candi_base))
                    sys.exit(0)
    
    def find_real_img(self, int_gp):
        #real_img = open(self.imgpath, 'rb)
        raw_data = self.raw_data

        print("[#] Finding real image size... ")
        for i in range(0, len(raw_data), 4):
            start_ptr = -1*i + int_gp
            end_ptr = -1*(i+4) + int_gp
            suspect = raw_data[end_ptr:start_ptr]

            if btoh(suspect) != '00000000':
                print("   → Founded {}...".format(hex(start_ptr)))
                return start_ptr                

    def search_pair_inst(self, str_rt, imm_lui):
        ret_result = 0xffffffff
        gp = '11100'

        for i in range(0, self.wnd_size):
            if self.byte_order == 'little':
                insp_bytes = ltob(self.fp.read(4))
            else:
                insp_bytes = self.fp.read(4)
            insp_bit = btob(insp_bytes)

            if chk_lui(insp_bit) and str_rt != gp:
                self.fp.seek(-4, 1)
                return 1
            
            imm_pair = chk_lui_pair(insp_bit)
            if imm_pair and ext_rt(insp_bit) == str_rt:
                pair_inst = ext_opcode(insp_bit)
                ret_result = calc_with_pair(pair_inst, imm_lui, imm_pair)

        if ret_result != int(0xffffffff):
            #calc_result = (ret_result - getsize(self.imgpath)) & 0xffff0000
            return ret_result
        
    def search_gp_addr(self):
        fp = self.fp
        borl = self.byte_order
        candi_base = 0
        idx = 0

        while True:
            insp_bytes = self.fp.read(4)
            if borl == 'little':
                insp_bytes = ltob(insp_bytes)
            
            insp_bit = btob(insp_bytes)

            if chk_lui(insp_bit):
                str_rt = ext_rt(insp_bit)
                if chk_gp(insp_bit):
                    gp_reg = self.search_pair_inst(str_rt, ext_imm(insp_bit))
                    print("[#] Finding $gp register value... ")
                    print("   → $gp : {}".format(hex(gp_reg)))

                    if gp_reg < getsize(self.imgpath):
                        real_img_sz = self.find_real_img(gp_reg)
                        candi_base = gp_reg - real_img_sz
                    else:
                        candi_base = gp_reg - getsize(self.imgpath)
                    print("CANDIDATE : ", hex(candi_base), hex(getsize(self.imgpath)))
                    candi_base &= 0xFFFF0000
                    print("   → Candidate Base addr : {}\n".format(hex(candi_base)))
                else:
                    str_addr = self.search_pair_inst(str_rt, ext_imm(insp_bit))

                    if str_addr != None and str_addr >= candi_base:
                        founded_addr = self.chk_off_str(str_addr, candi_base, '**TF')
            idx += 1

    def do_analyze(self):
        self.set_raw_data()
        self.search_gp_addr()

#test = SEARCHABSADDR('../B664', 0, 0, 4)
#test.do_analyze()

"""
| opcode |  $rs  |  $rt  |  $rd  |     func    |
| 010000 | 00100 | 11010 | 01100 | 00000000000 |
| 010000 | 00100 | 10001 | 01100 | 00000000000 |

# lui instruction
ex) lui $k1, 0x4000
| opcode |  $rs  |  $rt  |  $rd  |    func     |
| 001111 | 11010 | 11010 | 00000 | 00011100000 |

ex) lui $gp, *
| opcode |  $rs  |  $rt  |  $rd  |    func     |
                         |      immediate      |
| 001111 | 00000 | 11100 | 10000 | 00001110011 |
$rt = $gp = 11100
"""
