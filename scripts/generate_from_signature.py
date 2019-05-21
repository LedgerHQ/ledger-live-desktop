#!/usr/bin/env python

'''
Given a data file, convert the associated signature and the pubkey to the
OpenSSL format.

Eg.

  $ echo -n blah >/tmp/data
  $ ./py/export_sig.py /tmp/data \
    049480b6ab237d74b51014f8faee94228ece4b0cd9a26c7e21f08e7fe635ffd942ad5df9181db7e3da81185e06119626ea09a0e7d87c7cacef36eb957db5adbfc9 \
    304602210088978fc799acca0851b24bce5b4c5f4b8a2bf6b68ab34fa90e556c82463c1dc6022100fc29698923a5c307a6fa269e39c4c803dc5401c9f7deea6478471ba269ef04e8
  $ openssl dgst -sha256 -verify /tmp/data.pem -signature /tmp/data.sig /tmp/data
    Verified OK
'''

import binascii
import sys

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes

class Convert:
    def __init__(self, pubkey, signature, filename):
        self.pubkey = ec.EllipticCurvePublicNumbers.from_encoded_point(ec.SECP256K1(), binascii.unhexlify(pubkey)).public_key(default_backend())
        self.signature = binascii.unhexlify(signature)
        self.filename = filename

        self.verify()

    def verify(self):
        '''Ensure that the signature is actually valid.'''

        with open(self.filename) as fp:
            data = fp.read()

        self.pubkey.verify(self.signature, data, ec.ECDSA(hashes.SHA256()))

    def to_openssl(self):
        '''
        Create .pem and .sig files, which can be provided to the
        following command to ensure that the signature is valid using
        OpenSSL:

          openssl dgst -sha256 -verify /tmp/x.pem -signature /tmp/x.sig /tmp/x.data
        '''
    
        pem = self.pubkey.public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo)
        with open(self.filename + '.pem', 'w') as fp:
            fp.write(pem)

        with open(self.filename + '.sig', 'w') as fp:
            fp.write(self.signature)

def test():
    data = b"this is some data I'd like to sign"
    with open('/tmp/data', 'w') as fp:
        fp.write(data)

    private_key = ec.generate_private_key(ec.SECP256K1(), default_backend())
    signature = binascii.hexlify(private_key.sign(data, ec.ECDSA(hashes.SHA256())))
    public_key = binascii.hexlify(private_key.public_key().public_numbers().encode_point())

    convert = Convert(public_key, signature, '/tmp/data')
    convert.to_openssl()


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print 'Usage: %s <datafile> <pubkey> <signature>' % sys.argv[0]

    convert = Convert(sys.argv[2], sys.argv[3], sys.argv[1])
    convert.to_openssl()
