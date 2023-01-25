import os
import struct
import sys
import matplotlib.pyplot as plt

from os.path import join, getsize
from .FINDTOOLS import *
from bitstring import BitArray, ConstBitStream

class PREVFINDMIPSBASE:
    def __init__(self, imgpath, wnd_size, match_size, byte_order):
        self.imgpath = imgpath
        self.wnd_size = wnd_size
        self.match_size = match_size
        self.byte_order = byte_order

        self.flag = 0
        self.min_str_addr = 0xffffffff
        self.min_addr_list = []
        self.str_list = []
        self.rate_base_addr = {}

        self.raw_data = 0
        self.fp = ''

    def set_raw_data(self):
        print("[#] Target image : ", self.imgpath)
        print("[#] Target Firmware Size : %d-bytes" % getsize(self.imgpath))

        self.raw_data = open_raw_data(self.imgpath)
        self.fp = open(self.imgpath, 'rb')
        self.raw_data = open(self.imgpath, 'rb').read()

    def chk_off_str(self, str_addr, candi_base):
        raw_data = self.raw_data

        diff_word = ''

        trg_addr = str_addr - candi_base
        trg_null_pads = btoh(raw_data[trg_addr-1:trg_addr])

        if hex(candi_base) not in self.rate_base_addr.keys():
            self.rate_base_addr[hex(candi_base)] = 0

        i = 0
        null_pad = '00'

        if trg_null_pads == null_pad:
            while True:
                suspect = raw_data[trg_addr+i:trg_addr+(i+1)]
                alpha = suspect.isalpha()
                special = suspect.isalnum()
                num = suspect.isdigit()

                if alpha or special or num:
                    #print(suspect)
                    diff_word += btos(suspect)
                else:
                    break
                i+=1
            if len(diff_word) > 2 and btoh(raw_data[trg_addr+i:trg_addr+(i+1)]) == null_pad:
                #if self.min_str_addr > str_addr:
                #    self.min_str_addr = str_addr
                self.min_addr_list.append(str_addr)
                self.rate_base_addr[hex(candi_base)] += 1
        

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
        return 0
        
    def print_result(self, rate_base_addr):
        base_list = {}
        graph_data = {}
        freq_data = {}
        freq_list = []

        for candi_base in rate_base_addr.keys():
            if rate_base_addr[candi_base] == 0:
                continue
            else:
                base_list[candi_base] = rate_base_addr[candi_base]
        ret_base = dict(sorted(base_list.items(), key=lambda x:x[1], reverse=True))

        print('[=] Matching rate')
        idx = 0
        for i in ret_base.keys():
            if idx == 5:
                break
            print("   → {} : {}".format(i, ret_base[i]))
            idx += 1
        idx = 0

    def string_match(self, start_addr, end_addr):
        fp = self.fp.seek(0, 0)
        borl = self.byte_order
        str_addr = []

        idx = 0
        chk_sz = 0

        while True:
            if idx == self.match_size or chk_sz >= getsize(self.imgpath):
                self.min_addr_list = list(set(self.min_addr_list))
                self.min_addr_list = sorted(self.min_addr_list)

                self.print_result(self.rate_base_addr)
                break
            insp_bytes = self.fp.read(4)
            if borl == 'little':
                insp_bytes = ltob(insp_bytes)
            
            insp_bit = btob(insp_bytes)

            if chk_lui(insp_bit):
                str_rt = ext_rt(insp_bit)
                str_addr = self.search_pair_inst(str_rt, ext_imm(insp_bit))
            
                if str_addr >= start_addr:
                    self.str_list.append(str_addr)
                    i = start_addr
                    
                    if self.min_str_addr > str_addr:
                        self.min_str_addr = str_addr
                        self.min_addr_list.append(str_addr)

                    while i < end_addr:
                        self.chk_off_str(str_addr, i)
                        i += 0x1
                idx += 1
            chk_sz += 4
            

    def search_str_addr(self):
        borl = self.byte_order
        start_addr = 0xFFFFFFFF
        end_addr = 0xFFFFFFFF
        idx = 0
        chk_sz = 0

        print("[#] Finding Edge value... ")
        while True:
            if chk_sz >= getsize(self.imgpath):
                print("[#] Find Edge value! : {} {}".format(hex(start_addr), hex(end_addr)))
                break
                #sys.exit(-1)
            
            insp_bytes = self.fp.read(4)

            if borl == 'little':
                insp_bytes = ltob(insp_bytes)
            
            insp_bit = btob(insp_bytes)

            if chk_lui(insp_bit):
                str_rt = ext_rt(insp_bit)
                str_addr = self.search_pair_inst(str_rt, ext_imm(insp_bit))
                
                if 0x7FFEB940 <= str_addr and str_addr <= start_addr:
                    start_addr = str_addr
                if str_addr >= start_addr:
                    end_addr = str_addr
                    self.str_list.append(str_addr)
                idx += 1
            chk_sz += 4
        return start_addr, end_addr        

    def do_analyze(self, mode='auto', gp_reg=0):
        self.set_raw_data()
        start_addr, end_addr = self.search_str_addr()
        self.string_match(start_addr=start_addr, end_addr=end_addr)


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
