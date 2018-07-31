# Maintainer: Meriadec Pillet <meriadec.pillet@gmail.com>
# shellcheck disable=SC2154,SC2034,SC2164

pkgname=ledger-live
pkgver=1.0.7
pkgrel=1
pkgdesc="Open source companion app for your Ledger devices"
arch=('x86_64')
url="https://www.ledgerwallet.com/live"
license=('MIT')
makedepends=(yarn python2)

# TODO generate changelog from release notes
changelog=

source=("https://github.com/LedgerHQ/ledger-live-desktop/archive/v${pkgver}.tar.gz"
        "ledger-live.desktop")
md5sums=('d60d772a03c0a1c59df07f93b0268a4c'
         '52705147909a0a988907a23a71199092')
# TODO sign with ledger pgp
validpgpkeys=()

extractedFolder=ledger-live-desktop-$pkgver

prepare() {
  cd $extractedFolder
  export JOBS=max
  yarn --ignore-scripts
}

build() {
  cd $extractedFolder
  export GIT_REVISION=$pkgver
  export JOBS=max
  yarn dist
}

package() {
  install -D -m644 \
    "${pkgname}.desktop" \
    "${pkgdir}/usr/share/applications/${pkgname}.desktop"

  cd $extractedFolder

  install -dm755 "${pkgdir}/opt"
  cp -r "dist/linux-unpacked" "${pkgdir}/opt/ledger-live"
  install -dm755 "${pkgdir}/usr/bin"
  ln -s "/opt/${pkgname}/ledger-live-desktop" "${pkgdir}/usr/bin/${pkgname}"

  install -D -m644 \
    "static/images/browser-window-icon-512x512.png" \
    "${pkgdir}/usr/share/icons/hicolor/512x512/apps/ledger-live.png"
}
