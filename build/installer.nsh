!macro customInstall
  NSISdl::download "https://aka.ms/vs/16/release/vc_redist.x64.exe" "vc_redist.x64.exe"

  Pop $0

  ${If} $0 == "success"
    ExecWait '"vc_redist.x64.exe"  /passive /norestart'	
  ${Else}
    MessageBox mb_iconstop "Error: $0"
  ${EndIf}
!macroend
