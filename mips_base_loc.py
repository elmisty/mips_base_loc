import os
import binascii
from ctypes import *
from mips_link_loc import *
from pyptr import *

class find_fet:
    '''
    char* bin, int start, int filesize, int wnd, int gap_max
    '''
    def __init__(self, bin, start, filesize, wnd, gap_max):
        self.bin = bin
        self.start = start
        self.filesize = filesize
        self.wnd = wnd
        self.gap_max = gap_max

        self.FET_list = FET()
        self.func_addr_list = []

    # self.bin, pos, off, gap, self.wnd
    def rule_match(self, bin, pos, off, gap, wnd):
        max = 0
        min = 0xffffffff
        tbl_item_sz = (gap + 1) * 4
        real_off = pos + off * tbl_item_sz
        ptr = 0
        #print('bin :', self.bin[0:4])
        for i in range(0, wnd):
            #print('wnd', wnd)
            ptr = real_off + i * tbl_item_sz
            mov_ptr = int(binascii.b2a_hex(bin[ptr:ptr+4]), 16)
            print('bin : ', binascii.b2a_hex(self.bin[ptr:ptr+4]))
            print('int : ', binascii.b2a_hex(self.bin[ptr:ptr+4]))
            print('mov_ptr : ', mov_ptr)
            print('ref_val', ref_val(mov_ptr))
            self.func_addr_list.append(ref_val(bin))
        '''
        for i in range(0, wnd):
            ptr = real_off + i * tbl_item_sz
            func_addr_list[i] = ref_val(bin + ptr)
            if ref_val(bin+ptr) < min:
                min = ref_val(bin + ptr)
            if ref_val(bin + ptr) > max:
                max = ref_val(bin + ptr)
        for i in range(0, wnd):
            for j in range(0, wnd):
                if func_addr_list[i] == func_addr_list[j] and i != j:
                    return 0
        range = max - min
        if (range > F_GAP_MAX):
            return 0
        for i in wnd:
            if (func_addr_list[i] % 4 != 0) and (func_addr_list[i] % 2 != 1):
                return 0
        return 1
        '''

    '''
        self.bin = bin
        self.start = start
        self.filesize = filesize
        self.wnd = wnd
        self.gap_max

        self.FET_list = FET()
        self.func_addr_list = []
    '''
    def do_find_fet(self):
        pos = self.start
        end = self.start + self.filesize
        gap = 0
        off = 0
        print("gap? : ", self.gap_max)
        while pos >= self.start and pos < end:
            for gap in range(0, self.gap_max):
                #print("pos :", pos)
                off = 0
                if self.rule_match(self.bin, pos, off, gap, self.wnd):
                    self.head = self.pos
                    self.table_size = self.wnd
                    self.off += self.wnd
                    while self.rule_match(self.fd, pos, off, gap, self.wnd):
                        self.table_size += self.wnd
                        self.off = self.wnd
                    if f_rough:
                        self.pos += self.table_size * (self.gap + 1) * 4 - 1
                        FET_list.append(head = self.head, gap = self.gap, table_size = self.table_size)
                    if f_rough:
                        break
            pos += 1
        return self.FET_list
'''c
char *filename, int wnd, int gap, float T
unsigned int f_gap_m, int f_rough, unsigned int boot
int f_clear

filename, wnd, gap, T, f_gap_m, f_rough, boot, f_clear
'''
class find_load_base:
    def __init__(self, filename, wnd, gap, T, f_gap_m, f_rough, boot, f_clear):
        self.filename = filename
        self.wnd = wnd
        self.gap = gap
        self.T = T
        self.f_gap_m = f_gap_m
        self.f_rough = f_rough
        self.boot = boot
        self.f_clear = f_clear

    def set_file_fd(self):
        fd = open(self.filename, 'rb')
        self.bin = fd.read()
        self.filesize = os.path.getsize(self.filename)

    def set_init_val(self, wnd, gap, T, f_gap_m, f_rough, boot, f_clear):
        self.wnd = wnd
        self.gap = gap
        self.f_gap_m = f_gap_m
        self.f_rough = f_rough
        self.f_clear = f_clear
        self.T   = T
        self.f_clear = f_clear
    #char* bin, int start, int filesize, int wnd, int gap_max
    def do_find_lp(self):
        if not self.bin:
            return -1
        # bin, start, filesize, wnd, gap_max
        findlp = find_fet(self.bin, 0, self.filesize, self.wnd, self.gap)
        findlp.do_find_fet()

    def get_currnet_val(self, wnd, gap, T, f_gap_m, f_rough, boot, f_clear):
        init_val = {'wnd':self.wnd, 'gap':self.gap, 'T':self.T, 'f_gap_m':self.f_gap_m, 'f_rough':self.f_rough, 'boot':self.boot, 'f_clear':self.f_clear}
        return init_val

    def get_file_fd(self):
        return fd

if __name__ == "__main__":
    # filename, wnd, gap, T, f_gap_m, f_rough, boot, f_clear
    a = find_load_base("sony",3,3, 0.6, 0x1000, 0, 0x80BF029, 1)
    a.set_file_fd()
    a.do_find_lp()