import os
from genericpath import getsize
from bitstring import BitArray, ConstBitStream


"""
    Change Byte Order Series
    - btoi_little() : Byte-To-Integer to little endian
    - btoi_big() : Byte-To-Integer to big endian
    - ltob() : Little Endian-To-Big Endian
"""
# byte to integer to little endian
def btoi_little(bytes):
    return int.from_bytes(bytes, byteorder='little', signed=False)

# byte to integer to bit endian
def btoi_big(bytes):
    return int.from_bytes(bytes, byteorder='big', signed=False)

# little endian to big endian
def ltob(bytes):
    tmp = bytes
    return tmp[::-1]

"""
    Change Byte format
    - btoh() : Byte-To-Hex
    - btos() : Byte-To-String
    - btob() : Byte-To-Bit
"""
# byte to hex
def btoh(bytes):
    return bytes.hex()

# byte to string
def btos(bytes):
    return bytes.decode().strip('\x00')

# byte to bit
def btob(bytes):
    return ConstBitStream(bytes).bin

"""
def ext_opcode(split_data):
    conv_bytes = ConstBitStream(split_data).bin
    ext_op = conv_bytes[0:6]
    return ext_op

def ext_imm(split_data):
    conv_bytes = ConstBitStream(split_data).bin
    ext_imm = conv_bytes[16:32]
    return ext_imm
"""

# extract opcode
def ext_opcode(bits):
    ext_op = bits[0:6]
    return ext_op

# extract immediate value at an instruction
def ext_imm(bits):
    ext_imm = bits[16:32]
    return ext_imm

# Checking opcode according to instruction's opcode section
def chk_opcode(split_data, opcode):
    if split_data == opcode:
        return split_data
    return 0

# extract register from instruction bits
def ext_rs(bits):
    ext_rs = bits[6:11]
    return ext_rs

def ext_rt(bits):
    ext_rt = bits[11:16]
    return ext_rt

def ext_rd(bits):
    ext_rd = bits[16:21]
    return ext_rd

def ext_sa(bits):
    ext_sa = bits[21:26]
    return ext_sa

def ext_func(bits):
    ext_func = bits[26:32]
    return ext_func

def ext_imm(bits):
    ext_imm = bits[16:32]
    return ext_imm

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

def open_fp(imgpath):
    try:
        fp = open(imgpath, 'rb')
        return fp
    except Exception as e:
        return e

def chk_inst(bits, trg_opcode):
    if ext_opcode(bits) == trg_opcode:
        return bits
    else:
        return 0

def chk_func(bits, trg_opcode):
    if ext_func(bits) == trg_opcode:
        return bits
    else:
        return 0

def chk_rt(bits, trg_opcode):
    if ext_rt(bits) == trg_opcode:
        return bits
    else:
        return 0

def chk_rs(bits, trg_rs):
    if ext_rs(bits) == trg_rs:
        return bits
    else:
        return 0

def chk_rt(bits, trg_rt):
    if ext_rt(bits) == trg_rt:
        return bits
    else:
        return 0

def chk_rd(bits, trg_rd):
    if ext_rd(bits) == trg_rd:
        return bits
    else:
        return 0

def chk_mtc0(bits):
    mtc0 = '010000'
    mt = '001000'

    if chk_inst(bits, mtc0):
        if chk_rs(bits, mt):
            return bits
    return 0

def chk_lui(bits):
    lui = '001111'

    if chk_inst(bits, lui):
        return bits
    return 0

def chk_ori(bits):
    ori = '110101'

    if chk_inst(bits, ori):
        return bits
    return 0

def chk_k0_k1(bits):
    k0 = '11010'
    k1 = '11011'

    if chk_rt(bits, k0) or chk_rt(bits, k1):
        return ext_rt(bits)
    return 0

def chk_lui_pair(bits):
    ori = '001101'
    addiu = '001001'
    lw = '100011'

    if chk_inst(bits, ori) or chk_inst(bits, addiu) or chk_inst(bits, lw):
        # if chk_rt(bits, pair_reg):
        return ext_imm(bits)
    return 0

def chk_gp(bits):
    gp = '11100'

    if chk_rt(bits, gp):
        return bits
    return 0

def chk_addi_pair(bits):
    addiu = '001001'

    if chk_inst(bits, addiu):
        return ext_imm(bits)
    return 0

def calc_gp_addr(gp_reg, real_img_sz):
    calc_gp_off = gp_reg & 0x0000FFFF
    """
    if (calc_gp_off * 2) >= 0x10000:
        calc_with_off = (gp_reg & 0xFFFF0000) + 0xffff
        #calc_with_off = (gp_reg & 0xFFFF0000)
    else:
        calc_with_off = (gp_reg + calc_gp_off)
    """
    calc_with_off = (gp_reg & 0xFFFF0000)

    candi_base = (calc_with_off - real_img_sz) & 0xFFFF0000
    calc_gp_reg = calc_with_off
    #calc_gp_reg = calc_with_off - real_img_sz
    #candi_base = ((calc_with_off & 0xFFFF0000) - real_img_sz) & 0xFFFF0000
    return candi_base, calc_gp_reg

def calc_with_pair(pair_inst, imm_lui, imm_pair):
    ori = '001101'
    addiu = '001001'
    lw = '100011'

    imm_lui = int(imm_lui, base=2)

    if pair_inst == addiu or pair_inst == lw:
        if imm_pair[0] == '1':
            imm_lui = imm_lui - 1

    imm_addr = imm_lui << 16
    imm_addr |= int(imm_pair, base=2)
    return imm_addr

def calc_size(imgpath):
    tmp_sz = getsize(imgpath) % 4
    if tmp_sz:
        print('NONE : ', tmp_sz)
    else:
        print('ELSE : ', tmp_sz)
