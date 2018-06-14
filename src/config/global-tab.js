// Github like focus style:
// - focus states are not visible by default
// - first time user hit tab, enable global tab to see focus states
let IS_GLOBAL_TAB_ENABLED = false

export const isGlobalTabEnabled = () => IS_GLOBAL_TAB_ENABLED
export const enableGlobalTab = () => (IS_GLOBAL_TAB_ENABLED = true)
