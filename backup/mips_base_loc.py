import os
from bitstring import BitArray, ConstBitStream

class search_abs_addr:
    def __init__(self, fd, start, end, wnd_size):
        self.fd = fd
        self.start = start
        self.end = end
        self.wnd_size = wnd_size

    def conv_h2b(self, val):
        return bin(int(hex(val), 16))[2:8]

    def find_string(self):
        count = 0
        wnd_size = self.wnd_size

        while pos in range(self.start, self.end-wnd_size):
            if conv_h2b(pos)

class mips_base_loc:
    fd = None
    filename = None
    filesize = None

    def __init__(self, filename, wnd_size):
        self.filename = filename
        self.wnd_size = wnd_size
    
    def set_file_fd(self):
        self.fd = open(self.filename, 'rb')
        self.file_size = os.path.getsize(self.filename)
        print("file size : %d" % self.file_size)

    def do_AAS(self):
        if self.fd == None:
            return -1
        test = ConstBitStream(self.fd.read())