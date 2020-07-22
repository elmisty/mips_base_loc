import os
import mips_link_loc

class find_fet:
    gap = None
    head = None
    table_size = None
    off = None
    FET_list = None

    def __init__(self, f_rough, bin, start, filesize, wnd, gap_max):
        self.pos = start
        self.end = start + filesize
        self.gap_max = gap_max
        self.FET_list = FET()

    def rule_match(self):
        max = 0
        min = 0xffffffff
        tbl_item_sz = (self.gap + 1) * 4
        real_off = self.pos + self.off * tbl_item_sz
        for i in wnd:
            ptr = real_off + i * tbl_item_sz
            func_addr_list = read()

    def do_find_fet(self):
        while self.pos >= start and self.pos < end:
            for self.gap in self.gap_max:
                self.off = 0
                if rule_match():
                    self.head = self.pos
                    self.table_size = self.wnd
                    self.off += self.wnd
                    while rule_match():
                        self.table_size += self.wnd
                        self.off = self.wnd
                    if f_rough:
                        self.pos += self.table_size * (self.gap + 1) * 4 - 1
                        FET_list.append(head = self.head, gap = self.gap, table_size = self.table_size)
                    if f_rough:
                        break
        self.pos += 1
        return FET_list

class find_load_base:
    fd = None
    filename = None
    filesize = None

    def __init__(self, filename, wnd, gap, T, f_gap_m, f_rough, boot, f_clear):
        find_load_base.filename = filename
        self.wnd = wnd
        self.gap = gap
        self.T = T
        self.f_gap_m = f_gap_m
        self.f_rough = f_rough
        self.boot = boot
        self.f_clear = f_clear

    def set_file_fd(self):
        fd = open(self.filename, 'rb')
        filesize = os.path.getsize(self.filename)
        fd.read()
        return fd

    def get_file_fd(self):
        return fd
