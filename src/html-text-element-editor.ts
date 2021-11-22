export class HTMLTextElementEditor {
  private span: HTMLElement
  private edit: HTMLInputElement

  private placeholderValue: string

  private afterEditFn: (newValue: string) => any
  private afterResetFn: () => any

  constructor(element: HTMLElement) {
    this.placeholderValue = element.textContent

    this.span = element
    this.span.addEventListener('click', this.internalOnEdit())
    this.span.hidden = false

    this.edit = <HTMLInputElement>document.createElement('input')
    this.edit.addEventListener('focusout', this.internalAfterEdit())
    this.edit.placeholder = this.placeholderValue
    this.edit.hidden = true

    element.parentNode.insertBefore(this.edit, element)

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

      if (isBlank(this.edit.value)) {
        this.span.textContent = this.placeholderValue
        if (!this.span.classList.contains('placeholder'))
          this.span.classList.add('placeholder')
        this.afterResetFn()
      } else {
        this.span.textContent = this.edit.value
        this.span.classList.remove('placeholder')
        this.afterEditFn(this.edit.value)
      }
    }
  }
}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
