import os
from bitstring import BitArray, ConstBitStream

class search_abs_addr:
    def __init__(self, fd, start, end, wnd_size):
        self.fd = fd
        self.start = start
        self.end = end
        self.wnd_size = wnd_size

    def do_find_aas(self, fd):
        pos = self.start
        count = 0

class find_mips_base:
    fd = None
    filename = None
    filesize = None

    def __init__(self, filename, wnd_size):
        self.filename = filename
        self.wnd_size = wnd_size

    def set_file_fd(self):
        self.fd = open(self.filename, 'rb')
        self.filesize = os.path.getsize(self.filename)
        print("file size : %d" % self.filesize)

    def do_AAS(self):
        if self.fd == None:
            return -1
        test = ConstBitStream(self.fd.read())

        for i in range(0, 100, 1):
            readbit = BitArray(hex = test.read('hex:32'))
            readbit_2 = readbit.bin[0:6]
            print('bin data : {} {}'.format(readbit, readbit_2))

        #search_abs_addr(fd, 0, self.filesize, self.wnd_size)
