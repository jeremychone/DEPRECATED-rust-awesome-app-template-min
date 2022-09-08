import { Event as TauriEvent, listen } from '@tauri-apps/api/event';
import { html, hub } from 'dom-native';
import type { HubEvent } from './bindings/index.js';
import './components/c-ico.js';
import { SYMBOLS } from './svg-symbols.js';
import './views/v-app.js';

// --- Initialize some assets on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function (event) {

  // Append the svg symbols to the body 
  // (this allows to use the <use xlink:href="#symbol_id" ...> and update fill from css)
  const svgEl = html(SYMBOLS).firstElementChild!;
  svgEl.setAttribute('style', 'display: none');
  document.body.appendChild(svgEl);
});


// --- Bridge Tauri HubEvent events to dom-native hub/pub/sub event
//     (optional, but allows to use hub("Data").sub(..) or
//      @onHub("Data", topic, label) on BaseHTMLElement custom elements)
listen("HubEvent", function (evt: TauriEvent<HubEvent<any>>) {
  const hubEvent = evt.payload;

  // Get or create the Hub by name (from dom-native)
  //   (a Hub is a event bus namespace silo)
  let _hub = hub(hubEvent.hub);

  // Publish event to the given Hub
  if (hubEvent.label != null) {
    _hub.pub(hubEvent.topic, hubEvent.label, hubEvent.data);
  } else {
    _hub.pub(hubEvent.topic, hubEvent.data);
  }
})