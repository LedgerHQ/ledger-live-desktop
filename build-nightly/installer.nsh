!macro customInstall
  DeleteRegKey SHELL_CONTEXT "Software\Classes\ledgerlive"
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive" "" "Ledger Live"
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive" "URL Protocol" ""
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive\DefaultIcon" "" "$appExe,0"
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive\shell" "" ""
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive\shell\open" "" ""
  WriteRegStr SHELL_CONTEXT "Software\Classes\ledgerlive\shell\open\command" "" "$appExe %1"
!macroend

!macro customUnInstall
  DeleteRegKey SHELL_CONTEXT "Software\Classes\ledgerlive"
!macroend
