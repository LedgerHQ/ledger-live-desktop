; Most of the code is shamelessly copied from https://github.com/uglide/RedisDesktopManager/tree/2020/build/windows/installer

!addplugindir ${BUILD_RESOURCES_DIR}\nsis-plugins

!include LogicLib.nsh
!include x64.nsh

!macro customInstall
  !define VCplus_URL "https://aka.ms/vs/16/release/vc_redist.x64.exe"

  ReadRegDWORD $0 HKLM "SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0\VC\Runtimes\X64" Bld
  IntCmp $0 28508 VCInstalled VCDownload VCInstalled

  VCDownload:
  DetailPrint "Beginning download of VC++ Redistributable."
  inetc::get /TIMEOUT=30000 ${VCplus_URL} "$TEMP\vc_redist.x64.exe" /END
  Pop $0
  DetailPrint "Result: $0"
  StrCmp $0 "OK" InstallVCplusplus
  StrCmp $0 "cancelled" VCCanceled
  inetc::get /TIMEOUT=30000 /NOPROXY ${VCplus_URL} "$TEMP\vc_redist.x64.exe" /END
  Pop $0
  DetailPrint "Result: $0"
  StrCmp $0 "OK" InstallVCplusplus

  MessageBox MB_ICONSTOP "Download failed: $0. Please install it manually and try again: $VCplus_URL"
  Abort

  InstallVCplusplus:
  DetailPrint "Completed download."
  Pop $0
  ${If} $0 == "cancel"
    MessageBox MB_YESNO|MB_ICONEXCLAMATION \
    "Download cancelled.  Continue Installation?" \
    IDYES VCInstalled IDNO VCCanceled
  ${EndIf}

  DetailPrint "Pausing installation while downloaded VC++ installer runs."
  DetailPrint "Installation could take several minutes to complete."
  ExecWait '$TEMP\vc_redist.x64.exe /passive /norestart'

  DetailPrint "Removing VC++ installer."
  Delete "$TEMP\vc_redist.x64.exe"

  DetailPrint "VC++ installer removed."
  goto VCInstalled

VCCanceled:
  Abort "Installation cancelled by user."

VCInstalled:
  Pop $0
!macroend
