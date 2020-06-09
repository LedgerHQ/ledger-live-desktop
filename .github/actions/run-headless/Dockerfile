FROM node:lts

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && apt-get update \
    && apt-get install -y \
    google-chrome-stable \
    libudev-dev \
    libusb-1.0-0 \
    libusb-1.0-0-dev \
    g++-multilib \
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
    libgtk-3-0 \
    libgtk-3-dev \
    xvfb \
    libxtst6 \
    libxss1 \
    libnss3 \
    libasound2 \
    libgconf-2-4 \
  && rm -rf /var/lib/apt/lists/*

ENV ELECTRON_ENABLE_STACK_DUMPING=true
ENV ELECTRON_ENABLE_LOGGING=true
ENV DISPLAY=:99

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]