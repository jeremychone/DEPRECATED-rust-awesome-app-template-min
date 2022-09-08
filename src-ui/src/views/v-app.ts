import { invoke } from '@tauri-apps/api';
import { BaseHTMLElement, customElement, first, html, OnEvent, onEvent, onHub } from 'dom-native';

// dom-native JS Tagged templates to create a DocumentFragment (parse once)
const HTML = html`
  <header>
  <c-ico class="menu action" name="ico-menu"></c-ico>
  <label>Awesome App</label>
  </header>
  <nav>NAV</nav>
  <main>MAIN</main>
`

@customElement('v-app')
export class AppView extends BaseHTMLElement { // extends HTMLElement

  // #region    --- App Events
  @onHub("Data", "Counter", "update") // @onHub(hubName, topic, label?)
  onCounterUpdate(data: number) {
    first(this, "main")!.textContent = `MAIN ${data}`;
  }
  // #endregion --- App Events


  // #region    --- UI Events
  @onEvent("pointerup", "header > c-ico.menu") // @onEvent(eventType, elementSelectorFromThis)
  onMenuClick(evt: PointerEvent) {
    this.classList.toggle("min-nav");
  }

  @onEvent("pointerup", "nav")
  onNavClick(evt: PointerEvent & OnEvent) {
    // Note - In real app, would go through a Frontent Model Controller layer
    invoke("add_count", { num: 3 })
  }

  // #endregion --- UI Events


  init() { // Will be called by BaseHTMLElement once on first connectedCallback

    // clone the HTML documentFragment and replace this childrens
    this.replaceChildren(HTML.cloneNode(true));
  }
}
declare global { // trick to augment the global TagName with this component
  interface HTMLElementTagNameMap {
    'v-app': AppView;
  }
}
