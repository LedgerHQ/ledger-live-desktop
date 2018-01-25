const list = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']

list.forEach(href => {
  const tag = document.createElement('link')
  tag.setAttribute('rel', 'stylesheet')
  tag.setAttribute('href', href)
  document.head.appendChild(tag)
})
