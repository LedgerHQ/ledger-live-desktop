import c from 'color'

export function enrichData(data, parseTime) {
  return data.map((d, i) => ({
    ...d,
    ref: d,
    index: i,
    parsedDate: parseTime(d.date),
  }))
}

export function generateColors(color) {
  const cColor = c(color)
  return {
    line: color,
    focus: color,
    gradientStart: cColor.fade(0.7),
    gradientStop: cColor.fade(1),
    focusBar: cColor.fade(0.5),
  }
}

export function generateMargins(hideAxis) {
  return {
    top: hideAxis ? 5 : 10,
    bottom: hideAxis ? 5 : 40,
    right: hideAxis ? 5 : 10,
    left: hideAxis ? 5 : 70,
  }
}

export function observeResize(node, cb) {
  const ro = new ResizeObserver(() => {
    if (!node) {
      return
    }
    const { width } = node.getBoundingClientRect()
    cb(width)
  })

  ro.observe(node)
}
