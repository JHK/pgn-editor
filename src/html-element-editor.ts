abstract class HTMLEditor {
  protected span: HTMLElement
  protected edit: HTMLElement

  protected placeholderValue: string

  constructor(element: HTMLElement) {
    this.placeholderValue = element.textContent

    this.span = element
    this.span.addEventListener('click', this.internalOnEdit())
    this.span.hidden = false

    // TODO: allow input filter: https://jsfiddle.net/emkey08/zgvtjc51
    this.edit = this.setupEditElement()
    this.edit.addEventListener('focusout', this.internalAfterEdit())
    this.edit.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') { this.internalAfterEdit()() }
    })
    this.edit.hidden = true

    element.parentNode.insertBefore(this.edit, element)
  }

  abstract getValue(): string

  protected abstract setupEditElement(): HTMLElement
  protected abstract afterEditHook(): any
  protected abstract isEmpty(): boolean

  private internalOnEdit() {
    return () => {
      this.span.hidden = true
      this.edit.hidden = false
      this.edit.focus()
    }
  }

  private internalAfterEdit() {
    return () => {
      this.span.hidden = false
      this.edit.hidden = true

      if (this.isEmpty()) {
        this.span.textContent = this.placeholderValue
        if (!this.span.classList.contains('placeholder'))
          this.span.classList.add('placeholder')
      } else {
        this.span.textContent = this.getValue()
        this.span.classList.remove('placeholder')
      }

      this.afterEditHook()
    }
  }
}

export class HTMLTextElementEditor extends HTMLEditor {
  private afterEditFn: (newValue: string) => any
  private afterResetFn: () => any

  constructor(element: HTMLElement) {
    super(element)
    this.afterEditFn = () => { }
    this.afterResetFn = () => { }
  }

  afterEdit(fn: (newValue: string) => any): HTMLTextElementEditor {
    this.afterEditFn = fn
    return this
  }

  afterReset(fn: () => any): HTMLTextElementEditor {
    this.afterResetFn = fn
    return this
  }

  getValue() { return this.inputElement().value }

  private inputElement() { return <HTMLInputElement>(this.edit) }

  protected isEmpty() { return isBlank(this.getValue()) }

  protected setupEditElement() {
    const edit = <HTMLInputElement>document.createElement('input')
    edit.placeholder = this.placeholderValue
    return edit
  }

  protected afterEditHook() {
    if (this.isEmpty()) {
      this.afterResetFn()
    } else {
      this.afterEditFn(this.getValue())
    }
  }
}

export class HTMLDateElementEditor extends HTMLTextElementEditor {

  protected setupEditElement() {
    const edit = <HTMLInputElement>document.createElement('input')
    edit.type = 'date'
    edit.placeholder = this.placeholderValue
    return edit
  }

}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
