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
  const margins = {
    top: hideAxis ? 5 : 10,
    bottom: hideAxis ? 5 : 30,
    right: hideAxis ? 5 : 40,
    left: hideAxis ? 5 : 80,
  }

  // FIXME: Forced to "use" margins here to prevent babel/uglify to believe
  //        there is a constant variable re-assignment. I don't get it, but it
  //        works, so, eh.
  void margins

  return margins
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
