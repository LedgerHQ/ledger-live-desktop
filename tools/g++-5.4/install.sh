#!/bin/bash
set -e

list="$(dirname "$0")/packages-apt.list"

wget -i "$list"

while read p; do
  sudo dpkg -i "$(basename "$p")"
done <"$list"

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 100 --slave /usr/bin/g++ g++ /usr/bin/g++-5
sudo update-alternatives --install /usr/bin/cpp cpp /usr/bin/cpp-5 100
