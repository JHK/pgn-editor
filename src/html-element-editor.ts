export interface HTMLEditor {
  setValue(value: string): HTMLEditor
  afterEdit(callback: (newValue: string) => any): HTMLEditor
}

abstract class AbstractHTMLEditor implements HTMLEditor {
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
    this.edit.setHint(this.placeholderValue)
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

  setValue(value: string): HTMLEditor {
    this.edit.setValue(value || "")
    this.setDisplayValueAndClasses()
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
      this.setDisplayValueAndClasses()
      this.callback(this.edit.getCallbackValue())
    }
  }

  private setDisplayValueAndClasses() {
    if (this.edit.isEmpty()) {
      this.span.textContent = this.placeholderValue
      if (!this.span.classList.contains('placeholder'))
        this.span.classList.add('placeholder')
    } else {
      this.span.textContent = this.edit.getDisplayValue()
      this.span.classList.remove('placeholder')
    }
  }
}

interface HTMLEditorEditElement {
  element(): HTMLElement
  setHint(hint: string): any
  isEmpty(): boolean
  setValue(value: string): any
  getDisplayValue(): string
  getCallbackValue(): any
}

class HTMLEditorInputEditElement implements HTMLEditorEditElement {
  protected inputElement = <HTMLInputElement> document.createElement('input')

  element(): HTMLInputElement {
    return this.inputElement
  }

  setHint(hint: string) {
    this.inputElement.placeholder = hint
  }

  isEmpty(): boolean {
    return isBlank(this.inputElement.value) || this.inputElement.value == "?"
  }

  setValue(value: string): void {
    this.inputElement.value = value
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

  // TODO: 8.1.1.3 of https://www.chessclub.com/help/PGN-spec (requires parsing as well)
  getCallbackValue(): string {
    const date = new Date(this.inputElement.value)
    if (isNaN(date.valueOf())) { return "" }

    return date.toLocaleDateString()
  }

  getDisplayValue(): string {
    const date = new Date(this.inputElement.value)
    if (isNaN(date.valueOf())) { return "" }

    return date.toDateString()
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

class HTMLEditorResultEditElement implements HTMLEditorEditElement {
  private selectElement = document.createElement('select') as HTMLSelectElement

  constructor() {
    const white = document.createElement('option')
    white.text = "1-0"
    white.value = "1-0"
    const draw = document.createElement('option')
    draw.text = "Draw"
    draw.value = "1/2-1/2"
    const black = document.createElement('option')
    black.text = "0-1"
    black.value = "0-1"
    const other = document.createElement('option')
    other.text = "Other"
    other.value = ""
    other.selected = true

    this.selectElement.add(white)
    this.selectElement.add(draw)
    this.selectElement.add(black)
    this.selectElement.add(other)
  }

  element(): HTMLElement {
    return this.selectElement
  }

  setHint(hint: string) {}

  isEmpty(): boolean {
    return this.selectElement.selectedOptions[0].text == "Other"
  }

  setValue(value: string) {
    for (var i = 0, n = this.selectElement.options.length; i < n; i++) {
      const option = this.selectElement.options[i]
      option.selected = option.value == value
    }
  }

  getDisplayValue(): string {
    return this.selectElement.selectedOptions[0].text
  }

  getCallbackValue() {
    return this.selectElement.selectedOptions[0].value
  }
}

export class HTMLTextElementEditor extends AbstractHTMLEditor {
  protected setupEditElement() {
    return new HTMLEditorInputEditElement()
  }
}

export class HTMLDateElementEditor extends AbstractHTMLEditor {
  protected setupEditElement() {
    return new HTMLEditorInputEditDateElement
  }
}

export class HTMLTextWithPrefixElementEditor extends AbstractHTMLEditor {
  constructor(prefix: string, element: HTMLElement) {
    super(element, prefix)
  }

  protected setupEditElement(prefix: string) {
    return new HTMLEditorInputWithPrefixEditElement(prefix)
  }
}

export class HTMLResultElementEditor extends AbstractHTMLEditor {
  protected setupEditElement(prefix: string) {
    return new HTMLEditorResultEditElement()
  }
}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
