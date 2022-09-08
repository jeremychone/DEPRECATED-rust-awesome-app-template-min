import { BaseHTMLElement, customElement, html } from 'dom-native';

const HTML = html`
<svg class='ico'><use xlink:href="" aria-hidden="true"></use></svg>
`;

@customElement('c-ico')
export class IcoComponent extends BaseHTMLElement { // extends HTMLElement
  get name() { return this.getAttribute('name') ?? '' }

  init() {
    const name = this.name;
    const content = HTML.cloneNode(true);
    const svgEl = content.firstElementChild!;
    svgEl.classList.add(name);
    svgEl.firstElementChild!.setAttribute('xlink:href', `#${name}`);
    this.replaceChildren(svgEl);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'c-ico': IcoComponent;
  }
}
