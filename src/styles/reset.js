module.exports = `* {
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  user-select: none;
  min-width: 0;

  /* it will surely make problem in the future... to be inspected. */
  /* ;_; */
  flex-shrink: 0;
}

body {
  cursor: default;
  font-family: 'Museo Sans', 'Open Sans', Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

b {
  font-weight: bold;
}

em {
  font-style: italic;
}

#a11y-status-message {
  display: none;
}

.scroll-content {
  height: 100%;

  > div {
    height: 100%;
  }
}
.scrollbar-thumb {
  background: rgb(102, 102, 102) !important;
  padding: 2px;
  background-clip: content-box !important;
}
.scrollbar-track {
  background: transparent !important;
  transition: opacity 0.2s ease-in-out !important;
  z-index: 20 !important;
}

.tippy-tooltip {
  padding: 0;
}
.tippy-tooltip .tippy-content {
  background: transparent;
}`
