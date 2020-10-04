import base64
import hashlib

from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES
from Crypto.Util import Padding


class AESCipher(object):
    def __init__(self, key):
        self.key = (
            hashlib.md5(
                key.encode('utf-8')).hexdigest()).encode('utf-8')

    def encrypt(self, text: str) -> str:
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        data = Padding.pad(text.encode('utf-8'), AES.block_size, 'pkcs7')
        encoded_data = base64.b64encode(iv + cipher.encrypt(data))
        encoded_str = encoded_data.decode('utf-8')
        return encoded_str

    def decrypt(self, text: str) -> str:
        encoded_data = text.encode('utf-8')
        encrypted = base64.b64decode(encoded_data)
        iv = encrypted[:AES.block_size]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        data = Padding.unpad(cipher.decrypt(
            encrypted[AES.block_size:]), AES.block_size, 'pkcs7')
        return data.decode('utf-8')
