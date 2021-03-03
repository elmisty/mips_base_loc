from bitstring import BitArray, ConstBitStream

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