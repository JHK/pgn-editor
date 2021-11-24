import "./css/overlay.css"

export class LoadFromText {
  private overlay: HTMLDivElement
  private textArea: HTMLTextAreaElement
  private errorText: HTMLParagraphElement
  private submitButton: HTMLButtonElement
  private openFileInput: HTMLInputElement
  private cancelButton: HTMLButtonElement
  private onSubmitFn: (pgn: string) => boolean = (pgn: string) => { return true }

  constructor(parent: HTMLElement) {
    this.textArea = document.createElement("textarea")
    this.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.submitButton = document.createElement("button")
    this.submitButton.textContent = "Submit"
    this.submitButton.classList.add("submit")
    this.submitButton.onclick = () => { this.submit() }

    // TODO: styling: https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
    this.openFileInput = document.createElement("input")
    this.openFileInput.type = "file"
    this.openFileInput.addEventListener("change", this.loadFileToTextArea())

    this.cancelButton = document.createElement("button")
    this.cancelButton.textContent = "Cancel"
    this.cancelButton.classList.add("cancel")
    this.cancelButton.onclick = () => { this.close() }

    const title = document.createElement("h1")
    title.textContent = "Load PGN"
    title.append(this.submitButton)
    title.append(this.openFileInput)
    title.append(this.cancelButton)

    const description = document.createElement("p")
    description.textContent = "Paste PGN or load from file"

    this.errorText = document.createElement("p")
    this.errorText.textContent = "Could not parse PGN"
    this.errorText.classList.add("error")
    this.errorText.style.display = "none"

    const overlayBody = document.createElement("div")
    overlayBody.append(title)
    overlayBody.append(description)
    overlayBody.append(this.errorText)
    overlayBody.append(this.textArea)

    this.overlay = document.createElement("div")
    this.overlay.classList.add("overlay")
    this.overlay.append(overlayBody)
    parent.append(this.overlay)
  }

  open() {
    this.overlay.style.display = "block"
    this.textArea.focus()
  }

  onSubmit(fn: (pgn: string) => boolean) {
    this.onSubmitFn = fn
  }

  private submit() {
    const pgn = this.textArea.value
    if (this.onSubmitFn(pgn)) {
      this.close()
    } else {
      this.errorText.style.display = "block"
      this.textArea.focus()
    }
  }

  private close() {
    this.overlay.style.display = "none"
    this.errorText.style.display = "none"
    this.textArea.value = ""
  }

  private textAreaKeyboardEvents() {
    return (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        this.close()
      }
      else if (e.key == "Enter" && e.shiftKey) {
        this.submit()
      }
    }
  }

  private loadFileToTextArea() {
    return (e: Event) => {
      const file = (e.target as HTMLInputElement).files[0]
      if (!file || file.type != "application/x-chess-pgn") {
        console.log(file)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const contents = e.target.result as string
        this.textArea.value = contents
      }
      reader.readAsText(file)
    }
  }
}
