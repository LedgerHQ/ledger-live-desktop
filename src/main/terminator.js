// @flow

//                                                       <((((((\\\
//                                                       /      . }\
//                                                       ;--..--._|}
//                                    (\                 '--/\--'  )
//        DISCLAIMER                   \\                | '-'  :'|
//        This is a dirty hack          \\               . -==- .-|
//                                       \\               \.__.'   \--._
//                                       [\\          __.--|       //  _/'--.
//                                       \ \\       .'-._ ('-----'/ __/      \
//                                        \ \\     /   __>|      | '--.       |
//                                         \ \\   |   \   |     /    /       /
//                                          \ '\ /     \  |     |  _/       /
//                                           \  \       \ |     | /        /
//                                            \  \      \        /

let INTERNAL_PROCESS_PID: ?number = null

function kill(processType, pid) {
  console.log(`-> Killing ${processType} process ${pid}`) // eslint-disable-line no-console
  process.kill(pid, 'SIGTERM')
}

exports.setInternalProcessPID = (pid: number) => (INTERNAL_PROCESS_PID = pid)

exports.terminateAllTheThings = () => {
  if (INTERNAL_PROCESS_PID) kill('internal', INTERNAL_PROCESS_PID)
}
