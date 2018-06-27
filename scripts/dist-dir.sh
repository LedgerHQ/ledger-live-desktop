#!/bin/bash

yarn compile && DEBUG=electron-builder electron-builder --dir -c.compression=store -c.mac.identity=null
