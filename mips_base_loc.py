import os
import struct
from bitstring import BitArray, ConstBitStream

class search_abs_addr:
    def __init__(self, fd, start, end, wnd_size):
        self.fd = fd
        self.start = start
        self.end = end
        self.wnd_size = wnd_size

        self.file_stream = ConstBitStream(self.fd.read())

    def get_file_stream(self):
        return self.file_stream

    def set_code_stream(self):
        tmp_fd = self.tmp_fd
        read_stream = ConstBitStream(tmp_fd.read())
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
                return (trg_inst, readbit.bin[16:32])
        return (None, None)

    def calc_with_pair(self, pair_inst, h_bit, l_bit):
        imm_addr = 0
        h_bit = int(h_bit, 2)
        if(pair_inst == '100011' or pair_inst == '001001'):
            if l_bit[0] == '1':
                h_bit = h_bit-1
            else:
                return 0

            imm_addr = h_bit << 16
            imm_addr |= int(l_bit, 2)
            return imm_addr
    
    def calc_with_str_pair(self, pair_inst, h_bit, l_bit):
        str_imm_addr = 0
        h_bit = int(h_bit, 2)

        if(pair_inst == '001001'):
            if l_bit[0] =='1':
                h_bit = h_bit -1
        else:
            return 0
        
        str_imm_addr = h_bit << 16
        str_imm_addr |= int(l_bit, 2)
        return str_imm_addr

    def read_bit(self, stream):
        try:
            readbit = BitArray(hex = stream.read('hex:32'))
            return readbit
        except:
            return None

    def del_dup(self, trg_list):
        ret_list = []

        for element in trg_list:
            if element not in ret_list:
                ret_list.append(element)
        return ret_list

    def ref_chr(self, offset):
        try:
            stream = self.get_file_stream()
            stream.pos = offset
        except:
            return None
        read_byte = int.from_bytes(stream.read('bytes:1'), byteorder='big')
        return read_byte

    def match_string_ref(self, imm_addr, str_addr, filesize):
        saved_offset = []
        match_rate = {}
        match_result = {}
        str_addr_sz = len(str_addr)

        low_addr = imm_addr[0]
        high_addr = imm_addr[-1]

        for base in range(low_addr, high_addr):
            match_result[base] = 0
            for trg_addr in str_addr:
                saved_offset.append(trg_addr-base)
                idx = saved_offset.index(trg_addr-base)

                prev = self.ref_chr(saved_offset[idx]-1)
                current = self.ref_chr(saved_offset[idx])
                nxt = self.ref_chr(saved_offset[idx]+1)

                if(prev == 0 and current >= 0x20 and current <= 0x7E and nxt >= 0x20 and nxt <= 0x7E):
                    match_result[base] += 1
                else:
                    match_result[base] = 0
            match_rate[base] = match_result[base] / str_addr_sz
        return match_rate

    def do_find_aas(self):
        #pos = self.start
        #count = 0
        tmp_fd = self.fd
        wnd_size = self.wnd_size
        #trg_stream = ConstBitStream(tmp_fd.read())
        trg_stream = self.get_file_stream()
        lui_regnum = 0
        lui_imm = 0
        imm_addr_cnt = {}
        full_imm_addr = []
        full_str_addr = []

        # readbit.bin[0:6], readbit.bin[6:11], readbit.bin[11:16], readbit.bin[16:32]
        for trg_line in trg_stream:
            readbit = self.read_bit(trg_stream)
            #readbit = BitArray(hex = trg_stream.read('hex:32')
            if (readbit == None):
                break
            trg_inst = self.search_lui_inst(readbit)

            if(trg_inst != 0):
                lui_regnum = readbit.bin[11:16]
                lui_imm = readbit.bin[16:32]
                #print('1) lui data : {}'.format(trg_inst))
                for i in range(self.start, wnd_size):
                    readbit = self.read_bit(trg_stream)
                    trg_inst_lui = self.search_lui_inst(readbit)
                    (pair_inst, pair_imm) = self.search_lui_pair_inst(readbit, lui_regnum)
                    #print('2) regnum : {} {}'.format(lui_regnum, imm))

                    if(pair_inst != 0 and pair_inst != None):
                        trg_inst = readbit.bin[0:6]
                        imm_addr = self.calc_with_pair(pair_inst, lui_imm, pair_imm)
                        str_imm_addr = self.calc_with_str_pair(pair_inst, lui_imm, pair_imm)

                        if imm_addr != None and imm_addr not in imm_addr_cnt.keys():
                            imm_addr_cnt[imm_addr] = 0
                        elif (imm_addr != None):
                            #full_imm_addr.append(imm_addr)
                            imm_addr_cnt[imm_addr] += 1
                        
                        if(str_imm_addr != 0 or str_imm_addr != None):
                            full_str_addr.append(str_imm_addr)
                    elif(trg_inst_lui != 0):
                        trg_stream.pos -= 32
                        break
        return imm_addr_cnt, full_str_addr

class find_mips_base:
    fd = None
    filename = None
    filesize = None

    def __init__(self, filename, start_addr, wnd_size):
        self.filename = filename
        self.start_addr = start_addr
        self.wnd_size = wnd_size

    def set_file_fd(self):
        self.fd = open(self.filename, 'rb')
        self.filesize = os.path.getsize(self.filename)
        print("file size : %d" % self.filesize)

    def do_AAS(self):
        del_list = {}
        self.set_file_fd()

        if self.fd == None:
            return -1
        
        test = search_abs_addr(self.fd, self.start_addr, self.filesize, self.wnd_size)
        full_imm_addr, full_str_addr = test.do_find_aas()
        print('Num of indx : {}'.format(len(full_imm_addr)))

        print('imm_addr : ', full_imm_addr)
        #print('str_addr :', full_str_addr)

        print(type(full_imm_addr))

        for i in full_imm_addr:
            print('{} : {}'.format(hex(i), hex(full_imm_addr[i])))

        sorted_imm_addr = sorted(full_imm_addr.items())
  
        #print(sorted_imm_addr)

        for key, value in sorted_imm_addr:
            if(value != 0):
                del_list[key] = value
        
        for i in del_list.keys():
            print('{} : {}'.format(hex(i), del_list[i] + 1))

        match_rate = test.match_string_ref(list(del_list.keys()), full_str_addr, self.filesize)

        for i in match_rate:
            print('test : {}'.format(i))