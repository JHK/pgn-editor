abstract class HTMLEditor {
  private span: HTMLElement
  private edit: HTMLEditorEditElement
  private callback: (newValue: string) => any = () => { }

  protected placeholderValue: string

  constructor(element: HTMLElement, ...editElementArgs: any[]) {
    this.placeholderValue = element.textContent

    this.span = element
    this.span.addEventListener('click', this.internalOnEdit())
    this.span.hidden = false

    // TODO: allow input filter: https://jsfiddle.net/emkey08/zgvtjc51
    this.edit = this.setupEditElement(editElementArgs)
    this.edit.element().addEventListener('focusout', this.internalAfterEdit())
    this.edit.element().addEventListener('keypress', (e) => {
      if (e.key === 'Enter') { this.internalAfterEdit()() }
    })
    this.edit.element().hidden = true

    element.parentNode.insertBefore(this.edit.element(), element)
  }

  afterEdit(callback: (newValue: string) => any): HTMLEditor {
    this.callback = callback
    return this
  }

  protected abstract setupEditElement(...editElementArgs: any[]): HTMLEditorEditElement

  private internalOnEdit() {
    return () => {
      this.span.hidden = true
      this.edit.element().hidden = false
      this.edit.element().focus()
    }
  }

  private internalAfterEdit() {
    return () => {
      this.span.hidden = false
      this.edit.element().hidden = true

      if (this.edit.isEmpty()) {
        this.span.textContent = this.placeholderValue
        if (!this.span.classList.contains('placeholder'))
          this.span.classList.add('placeholder')
      } else {
        this.span.textContent = this.edit.getDisplayValue()
        this.span.classList.remove('placeholder')
      }

      this.callback(this.edit.getCallbackValue())
    }
  }
}

interface HTMLEditorEditElement {
  element(): HTMLElement
  setHint(hint: string): any
  isEmpty(): boolean
  getDisplayValue(): string
  getCallbackValue(): any
}

class HTMLEditorInputEditElement implements HTMLEditorEditElement {
  private inputElement = <HTMLInputElement>document.createElement('input')

  element(): HTMLInputElement {
    return this.inputElement
  }

  setHint(hint: string) {
    this.inputElement.placeholder = hint
  }

  isEmpty(): boolean {
    return isBlank(this.inputElement.value)
  }

  getDisplayValue(): string {
    return this.inputElement.value
  }

  getCallbackValue(): string {
    return this.inputElement.value
  }
}

class HTMLEditorInputEditDateElement extends HTMLEditorInputEditElement {
  constructor() {
    super()
    this.element().type = 'date'
  }
}

class HTMLEditorInputWithPrefixEditElement extends HTMLEditorInputEditElement {
  private prefix: string

  constructor(prefix: string) {
    super()
    this.prefix = prefix
  }

  getDisplayValue(): string {
    return this.prefix + this.element().value
  }
}

export class HTMLTextElementEditor extends HTMLEditor {
  protected setupEditElement() {
    return new HTMLEditorInputEditElement()
  }
}

export class HTMLDateElementEditor extends HTMLEditor {
  protected setupEditElement() {
    return new HTMLEditorInputEditDateElement
  }
}

export class HTMLTextWithPrefixElementEditor extends HTMLEditor {
  constructor(prefix: string, element: HTMLElement) {
    super(element, prefix)
  }

  protected setupEditElement(prefix: string) {
    return new HTMLEditorInputWithPrefixEditElement(prefix)
  }
}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
