import os

from bitstring import BitArray, ConstBitStream

def btoi_little(bytes):
    return int.from_bytes(bytes, byteorder='little', signed=True)

def btoi_little(bytes):
    return int.from_bytes(bytes, byteorder='big', signed=True)

def btoh(bytes):
    return bytes.hex()

def btos(bytes):
    return bytes.decode().strip('\x00')

def ext_opcode(split_data):
    conv_bytes = ConstBitStream(split_data).bin
    ext_op = conv_bytes[0:6]
    return ext_op

def ext_imm(split_data):
    conv_bytes = ConstBitStream(split_data).bin
    ext_imm = conv_bytes[16:32]
    return ext_imm

def chk_opcode(split_data, opcode):
    if split_data == opcode:
        return split_data
    return 0

def get_file_stream(raw_data):
    return ConstBitStream(raw_data)

def open_raw_data(imgpath):
    try:
        fp = open(imgpath, 'rb')
        raw_data = fp.read()
        fp.close()
    except Exception as e:
        return e
    return raw_data

def search_lui_inst(suspect):
    print(suspect[0])