import os
from bitstring import BitArray, ConstBitStream

class search_abs_addr:
    def __init__(self, fd, start, end, wnd_size):
        self.fd = fd
        self.start = start
        self.end = end
        self.wnd_size = wnd_size

    def _set_code_stream(self):
        tmp_fd = self.fd
        read_stream = ConstBitStream(tmp_fd.read())
        #print("test =", read_stream)
        return read_stream

    def search_lui_inst(self, readbit):
        trg_inst = readbit.bin[0:6]
        if(trg_inst == '001111'):
            return trg_inst
        return int(0)

    def search_lui_pair_inst(self, readbit, lui_regnum):
        trg_inst = readbit.bin[0:6]
        if(trg_inst == '001101' or trg_inst == '100011' or trg_inst == '001001'):
            if(readbit.bin[6:11] == lui_regnum):
                print('trg_inst {} {} {}'.format(trg_inst, readbit.bin[16:32], lui_regnum))
                return readbit.bin[16:32]
            return int(0)

    def do_find_aas(self):
        #pos = self.start
        #count = 0
        tmp_fd = self.fd
        wnd_size = self.wnd_size
        trg_stream = ConstBitStream(tmp_fd.read())
        lui_regnum = 0
        print('test = ', trg_stream)

        # readbit.bin[0:6], readbit.bin[6:11], readbit.bin[11:16], readbit.bin[16:32]
        for trg_line in trg_stream:
            readbit = BitArray(hex = trg_stream.read('hex:32'))
            trg_inst = self.search_lui_inst(readbit)

            if(trg_inst != 0):
                lui_regnum = readbit.bin[11:16]
                #print('1) lui data : {}'.format(trg_inst))
                for i in range(0, wnd_size):
                    readbit = BitArray(hex = trg_stream.read('hex:32'))
                    imm = self.search_lui_pair_inst(readbit, lui_regnum)
                    #print('2) regnum : {} {}'.format(lui_regnum, imm))
                    if(imm != None):
                        trg_inst = readbit.bin[0:6]
                        print('3) pair data : {} {}\n'.format(trg_inst, imm))
            #readbit_2 = readbit.bin[0:6]


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
        test = search_abs_addr(self.fd, 0, self.filesize, self.wnd_size)
        test.do_find_aas()

