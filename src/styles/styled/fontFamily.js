export default props => {
  const prop = props.ff

  if (!prop) {
    return null
  }

  const [font, type = 'Regular'] = prop.split('|')
  const { style, weight } = props.theme.fontFamilies[font][type]

  return {
    fontFamily: font,
    fontWeight: weight,
    fontStyle: style,
  }
}
