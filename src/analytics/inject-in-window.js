/* eslint-disable */
import { getPath } from 'helpers/staticPath'

// prettier-ignore
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)};analytics.SNIPPET_VERSION="4.1.0";
}}();

let loaded = false
export const load = () => {
  if (loaded) return
  loaded = true
  var n = document.createElement('script')
  n.type = 'text/javascript'
  n.async = !0
  n.src = getPath('analytics.min.js')
  var a = document.getElementsByTagName('script')[0]
  a.parentNode.insertBefore(n, a)
}
