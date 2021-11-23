import './css/load-from-text.css'

export class LoadFromText {
  overlay = document.createElement('div')
  loadArea = document.createElement('textarea') as HTMLTextAreaElement

  constructor(element: HTMLElement) {
    this.overlay.classList.add('overlay')
    this.overlay.onclick = () => { this.close() }
    this.overlay.append(this.loadArea)
    element.append(this.overlay)
  }

  open(button: HTMLButtonElement) {
    button.onclick = () => {
      this.overlay.style.display = "block"
      this.loadArea.focus()
    }
  }

  private close() {
    this.overlay.style.display = "none"
  }
}
