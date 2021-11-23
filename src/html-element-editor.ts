abstract class HTMLEditor {
  private span: HTMLElement
  private edit: HTMLElement

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

  protected abstract setupEditElement(): HTMLElement
  protected abstract afterEditHook(edit: HTMLElement): any
  protected abstract isEmpty(edit: HTMLElement): boolean
  protected abstract getValue(edit: HTMLElement): string

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

      if (this.isEmpty(this.edit)) {
        this.span.textContent = this.placeholderValue
        if (!this.span.classList.contains('placeholder'))
          this.span.classList.add('placeholder')
      } else {
        this.span.textContent = this.getValue(this.edit)
        this.span.classList.remove('placeholder')
      }

      this.afterEditHook(this.edit)
    }
  }
}

export class HTMLTextElementEditor extends HTMLEditor {
  protected afterEditFn: (newValue: string) => any
  protected afterResetFn: () => any

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

  protected getValue(edit: HTMLElement) { return (<HTMLInputElement> edit).value }

  protected isEmpty(edit: HTMLElement) { return isBlank((<HTMLInputElement>edit).value) }

  protected setupEditElement() {
    const edit = <HTMLInputElement>document.createElement('input')
    edit.placeholder = this.placeholderValue
    return edit
  }

  protected afterEditHook(edit: HTMLElement) {
    if (this.isEmpty(edit)) {
      this.afterResetFn()
    } else {
      this.afterEditFn((<HTMLInputElement>edit).value)
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

export class HTMLTextWithPrefixElementEditor extends HTMLTextElementEditor {

  private prefix: string

  constructor(prefix: string, element: HTMLElement) {
    super(element)
    this.prefix = prefix
  }

  protected getValue(edit: HTMLElement) { return this.prefix + (<HTMLInputElement> edit).value }
}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
