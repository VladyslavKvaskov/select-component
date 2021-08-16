class SelectComponent extends HTMLSelectElement {
    constructor() {
        super();

        this._selectContainer = this.createElement({
            class: 'select-container',
        });

        this._shadowDOM = this._selectContainer.attachShadow({ mode: 'closed' });

        this._select = this.createElement({
            class: 'select',
        });

        this._value = this.createElement({
            class: 'value',
        });

        this._selectButton = this.createElement({
            tag: 'button',
        });

        this._optionsContainer = this.createElement({
            class: 'options',
        });

        this._dropdownContainer = this.createElement({
            class: 'dropdown-container',
        });

        this._selectDropdown = this.createElement({
            class: 'dropdown',
        });

        this._selectSearchContainer = this.createElement({
            class: 'search-container',
        });

        this._selectSearch = this.createElement({
            tag: 'input',
            type: 'text',
            placeholder: 'Search...',
        });

        this._selectSearchContainer.appendChild(this._selectSearch);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.select-container') !== this._selectContainer) {
                this._select.classList.remove('show');
                this.timeoutShow = setTimeout(() => {
                    this._selectDropdown.remove();
                }, 150);
            }
        });

        this._select.addEventListener('click', (e) => {
            clearTimeout(this.hideTimeout);
            clearTimeout(this.showTimeout);
            if (e.target.closest('button') === this._selectButton) {
                if (!this._select.classList.contains('show')) {
                    this._dropdownContainer.appendChild(this._selectDropdown);
                    this.showTimeout = setTimeout(() => {
                        this._select.classList.add('show');
                    }, 150);
                } else {
                    this._select.classList.remove('show');
                    this.hideTimeout = setTimeout(() => {
                        this._selectDropdown.remove();
                    }, 150);
                }
            }
        });

        this._options = [];

        for (let option of this.options) {
            this._options.push(
                this.createElement({
                    class: `option ${option.selected ? 'selected' : ''}`,
                    handler: (el) => {
                        el.addEventListener('click', () => {
                            if (this.getAttribute('multiple') === null) {
                                option.selected = true;
                            } else {
                                if (option.selected) {
                                    option.selected = false;
                                    el.classList.remove('selected');
                                } else {
                                    option.selected = true;
                                    el.classList.add('selected');
                                }
                            }
                            if (this.getAttribute('multiple') === null) {
                                for (let i = 0; i < this.options.length; i++) {
                                    if (this.options[i].selected) {
                                        this._options[i].classList.add('selected');
                                    } else {
                                        this._options[i].classList.remove('selected');
                                    }
                                }
                            }
                            this.dispatchEvent(new Event('change'));
                        });
                    },
                    text: option.textContent,
                })
            );

            this._optionsContainer.appendChild(this._options[this._options.length - 1]);
        }

        this._selectSearch.addEventListener('input', () => {
            for (this._tmp of this._options) {
                if (this._tmp.textContent.trim().toLowerCase().includes(this._selectSearch.value.trim().toLowerCase())) {
                    this._optionsContainer.appendChild(this._tmp);
                } else {
                    this._tmp.remove();
                }

                this.nodesUnhighlight(this._optionsContainer);
                this.nodesHighlight(this._optionsContainer, this._selectSearch.value.trim().toLowerCase());
            }
        });

        delete this._option;

        this._selectContainer.style['display'] = 'inline-block';
        this._selectContainer.style['min-width'] = '50px';

        this.insertAdjacentElement('beforebegin', this._selectContainer);
        this._selectContainer.appendChild(this);
        this._selectButton.appendChild(this._value);
        this._select.appendChild(this._selectButton);
        this._selectDropdown.appendChild(this._selectSearchContainer);
        this._selectDropdown.appendChild(this._optionsContainer);
        // this._dropdownContainer.appendChild(this._selectDropdown);
        this._select.appendChild(this._dropdownContainer);
        this._shadowDOM.appendChild(
            this.createElement({
                tag: 'style',
                html: `
                    button{
                        -webkit-appearance: button;
                        appearance: button;
                        background: #fff;
                        border: 1px solid #8a909d;
                        height: 30px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .dropdown-container{
                        position: relative;
                        transition: transform 0.15s, opacity 0.15s;
                        will-change: transform, opacity;
                        opacity: 0;
                        transform: scale(0.8);
                        min-width: 110px;
                    }
                    .show .dropdown-container{
                        opacity: 1;
                        transform: scale(1);
                    }
                    .dropdown{
                        position: absolute;
                        top: 0;
                        left: 0;
                        min-width: fit-content;
                        border: 1px solid #8a909d;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    span.highlight{
                        background: #fec400;
                        color: #000;
                    }
                    .value{
                        height: 100%;
                        display: flex;
                        align-items: center;
                        user-select: none;
                        white-space: nowrap;
                        width: fit-content;
                        margin-right: 10px;
                        position: relative;
                        min-width: 50px;
                    }
                    .value::after{
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: -10px;
                        transform: translateY(-50%);
                        background: #000;
                        width: 5px;
                        height: 10px;
                        transition: transform 0.15s;
                        will-change: transform;
                        clip-path: polygon(0 0, 100% 50%, 0 100%);
                    }
                    .show .value::after{
                        transform: translateY(-50%) rotate(90deg);
                    }
                    .options{
                        user-select: none;
                    }
                    .option:hover{
                        background: #e6f4fc;
                    }
                    .option{
                        cursor: pointer;
                        padding: 5px 10px;
                        white-space: nowrap;
                    }
                    .option.selected{
                        color: #fff;
                        background: #4c84ff;
                    }
                    input{
                        width: 100%;
                        outline: none;
                        border: none;
                        padding: 5px 10px;
                    }
                `,
            })
        );

        this._shadowDOM.appendChild(this._select);

        this.addEventListener('change', () => {
            this.setValue();
        });

        this.setValue();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'multiple') {
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].selected) {
                    this._options[i].classList.add('selected');
                } else {
                    this._options[i].classList.remove('selected');
                }
            }
        }

        this.setValue();
    }

    static get observedAttributes() {
        return ['multiple', 'nosearch'];
    }

    createElement(obj = {}) {
        this._elementTag = obj.tag ? obj.tag : 'div';
        this._tmpElement = obj.is ? document.createElement(this._elementTag, { is: obj.is }) : document.createElement(this._elementTag);

        for (this._prop in obj) {
            if (this._prop !== 'tag' && this._prop !== 'text' && this._prop !== 'html' && typeof obj[this._prop] !== 'function') {
                this._tmpElement.setAttribute(this._prop, obj[this._prop]);
            } else if (this._prop === 'text') {
                this._tmpElement.textContent = String(obj.text);
                this._tmpElement.value = String(obj.text);
            } else if (this._prop === 'html') {
                this._tmpElement.innerHTML = String(obj.html);
            } else if (typeof obj[this._prop] === 'function') {
                obj[this._prop](this._tmpElement);
            }
        }

        delete this._elementTag;
        delete this._prop;

        return this._tmpElement;
    }

    setValue() {
        this._value.textContent = `${(() => {
            this._tmp = [];

            for (this._option of this.options) {
                if (this._option.selected) {
                    this._tmp.push(this._option.textContent);
                }
            }

            delete this._option;
            if (this._tmp.length === 0) {
                this._value.classList.add('placeholder');
                return 'None selected';
            } else {
                this._value.classList.remove('placeholder');
                if (this._tmp.length === 1) {
                    return this._tmp.join(', ');
                } else {
                    return this._tmp.length + ' selected';
                }
            }
        })()}`;
    }

    nodesHighlight(node, re) {
        if (re) {
            this.re = new RegExp(re, 'i');
            if (node.nodeType === 3) {
                this.match = node.data.match(this.re);
                if (this.match) {
                    this.highlighter = document.createElement('span');
                    this.highlighter.className = 'highlight';
                    this.wordNode = node.splitText(this.match.index);
                    this.wordNode.splitText(this.match[0].length);
                    this.wordClone = this.wordNode.cloneNode(true);
                    this.highlighter.appendChild(this.wordClone);
                    this.wordNode.parentNode.replaceChild(this.highlighter, this.wordNode);
                    return 1; //skip added node in parent
                }
            } else if (
                node.nodeType === 1 &&
                node.childNodes && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === 'span'.toUpperCase() && node.className === 'highlight')
            ) {
                // skip if already highlighted
                for (let i = 0; i < node.childNodes.length; i++) {
                    i += this.nodesHighlight(node.childNodes[i], this.re, 'span', 'highlight');
                }
            }
            return 0;
        }
    }

    nodesUnhighlight(el) {
        for (this.highlighter of el.querySelectorAll('span.highlight')) {
            this.pNode = this.highlighter.parentNode;
            this.pNode.replaceChild(document.createTextNode(this.highlighter.textContent), this.highlighter);
            this.pNode.normalize();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    customElements.define('select-component', SelectComponent, {
        extends: 'select',
    });
});
