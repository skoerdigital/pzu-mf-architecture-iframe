import './app.element.css';

import manifest from './manifest.json';

export class AppElement extends HTMLElement {

  connectedCallback() {
    const title = 'iframe-integrator';
    this.innerHTML = `
    <iframe src="${manifest.iframeUrl}" title="${title}" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
  }
}
customElements.define('pzu-mf-architecture-root', AppElement);
