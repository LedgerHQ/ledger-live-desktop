FROM node:12

ENV CHROMEDRIVER_PORT 9515
ENV CHROMEDRIVER_WHITELISTED_IPS ""
ENV SCREEN_WIDTH 1920
ENV SCREEN_HEIGHT 1080
ENV SCREEN_DEPTH 24
ENV DISPLAY :99.0
ENV TZ America/New_York

USER root

RUN apt-get update -qqy

#=====
# VNC
#=====
RUN apt-get -qqy install \
  x11vnc

#=======
# Fonts
#=======
RUN apt-get -qqy --no-install-recommends install \
    fonts-ipafont-gothic \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-cyrillic \
    xfonts-scalable

#=========
# fluxbox
# A fast, lightweight and responsive window manager
#=========
RUN apt-get -qqy install \
    xvfb fluxbox

#=====
# Chromedriver dependencies
#=====
RUN apt-get -qqy install \
  libnss3-dev libgconf-2-4 fuse libgtk2.0-0 libgtk-3-0 libasound2 \
  libudev-dev \
  libusb-1.0-0 \
  libusb-1.0-0-dev \
  lib32z1 \
  lib32ncurses5 \
  rpm \
  fakeroot \
  dpkg \
  libdbus-1-dev \
  libx11-dev \
  libavahi-compat-libdnssd-dev \
  g++ \
  gcc-multilib \
  g++-multilib \
  libgtk-3-dev \
  libxtst6 \
  libxss1 \
  libnss3

RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ADD tests/docker-electron-webdriver/entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

#==============================
# Generating the VNC password as node
# So the service can be started with node
#==============================

RUN mkdir -p ~/.vnc \
  && x11vnc -storepasswd secret ~/.vnc/passwd

CMD ["/bin/bash", "/entrypoint.sh"]

EXPOSE 5900
EXPOSE 9515
