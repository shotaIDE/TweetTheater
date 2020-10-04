import base64
import hashlib

from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Util import Padding

_ENCODING = 'utf-8'
_PADDING_STYLE = 'pkcs7'


class AESCipher(object):
    def __init__(self, key):
        self.key = (
            hashlib.md5(
                key.encode(_ENCODING)).hexdigest()).encode(_ENCODING)

    def encrypt(self, text: str) -> str:
        initial_vector = Random.get_random_bytes(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, initial_vector)
        padded_data = Padding.pad(
            text.encode(_ENCODING), AES.block_size, _PADDING_STYLE)
        encrypted_base64_bin = base64.b64encode(
            initial_vector + cipher.encrypt(padded_data))
        encrypted_base64_str = encrypted_base64_bin.decode(_ENCODING)
        return encrypted_base64_str

    def decrypt(self, text: str) -> str:
        encrypted_base64_bin = text.encode(_ENCODING)
        padded_data = base64.b64decode(encrypted_base64_bin)
        initial_vector = padded_data[:AES.block_size]
        cipher = AES.new(self.key, AES.MODE_CBC, initial_vector)
        original_bin = Padding.unpad(
            cipher.decrypt(padded_data[AES.block_size:]),
            AES.block_size,
            _PADDING_STYLE)
        original_str = original_bin.decode(_ENCODING)
        return original_str
