// @flow
//
// Libcore implementation used to live here before libcore db encryption was added.
// Now libcore needs to be init with the user password from the renderer without relying on env variables (for security/privacy reasons),
// so we end up doing the following IPC dance when Internal process starts 💃
//
// Main Process------------------------------------+      Renderer Process-------------------------------------------+
// |                                               |      |                                                          |
// |            bridge-----------------------+     |      |   +----------+                          +-------------+  |
// |            |                            |     |      |   |          |----getLibcorePassword--->|             |  |
// |            |     +-------------------------------------->|  events  |                          | Redux Store |  |
// |            |     |                      |     |      |   |          |<-------password----------|             |  |
// |            |     |                      |     |      |   +----------+                          +-------------+  |
// |            |     |                      |     |      |        |                                                 |
// |            |     |                      |     |      |     password                                             |
// |            |     |                      |     |      |        |                                                 |
// |            |     |                      |     |      |        v                                                 |
// |            |     |                      |     |      |   +------------------------+                             |
// |            |     |                      |     |      |   |                        |                             |
// |            |     |               +-----------------------|  commands/libcoreInit  |                             |
// |            |     |               |      |     |      |   |                        |                             |
// |            +-----|---------------|------+     |      |   +------------------------+                             |
// |                  |               |            |      |                                                          |
// +------------------|---------------|------------+      +----------------------------------------------------------+
//                    |               |
//           'initLibcore'          implementLibcore(password)
//                    |               |
// Internal Process---|---------------|------------+
// |                  |               v            |
// | implement-libcore---+  commandHandler-------+ |
// | |                   |  |                    | |
// | |    You are here   |  |  Executes Payload  | |
// | |                   |  |                    | |
// | +-------------------+  +--------------------+ |
// +-----------------------------------------------+

process.send({
  type: 'initLibcore',
})
