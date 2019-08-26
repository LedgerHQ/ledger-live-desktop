import debounce from 'lodash/debounce'
import c from 'color'

export function enrichData(data) {
  return data.map((d, i) => ({
    ...d,
    ref: d,
    index: i,
    // normalize all dates to start of day for graph display to prevent d3 from
    // rounding up
    // see https://github.com/LedgerHQ/ledger-live-desktop/issues/2266
    parsedDate: new Date(d.date).setHours(0, 0, 0, 0),
  }))
}

export function generateColors(color) {
  const cColor = c(color)
  return {
    line: color,
    focus: color,
    gradientStart: cColor.fade(0.7),
    gradientStop: cColor.fade(1),
    focusBar: '#d8d8d8',
  }
}

export function generateMargins(hideAxis) {
  const margins = {
    top: hideAxis ? 5 : 10,
    bottom: hideAxis ? 5 : 40,
    right: hideAxis ? 5 : 40,
    left: hideAxis ? 5 : 70,
  }

  // FIXME: Forced to "use" margins here to prevent babel/uglify to believe
  // there is a constant variable re-assignment. I don't get it, but it
  // works, so, eh.
  void margins

  return margins
}

export function observeResize(node, cb) {
  const onResize = debounce(
    () => {
      const { width } = node.getBoundingClientRect()
      cb(width)
    },
    100,
    { maxWait: 1000 },
  )

  const ro = new ResizeObserver(onResize)
  ro.observe(node)

  return () => {
    ro.unobserve(node)
  }
}
