FROM node:12

ENV CHROMEDRIVER_PORT 9515
ENV CHROMEDRIVER_WHITELISTED_IPS ""
ENV SCREEN_WIDTH 1920
ENV SCREEN_HEIGHT 1080
ENV SCREEN_DEPTH 24
ENV DISPLAY :99.0

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
  libnss3-dev libgconf-2-4 fuse libgtk2.0-0 libgtk-3-0 libasound2

RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ADD entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh

RUN npm install electron-chromedriver@9.0.0
RUN npm install electron@9.2.0
RUN npm install spectron@11.1.0

#==============================
# Generating the VNC password as node
# So the service can be started with node
#==============================

RUN mkdir -p ~/.vnc \
  && x11vnc -storepasswd secret ~/.vnc/passwd

CMD ["/bin/bash", "/entrypoint.sh"]

EXPOSE 5900
EXPOSE 9515
