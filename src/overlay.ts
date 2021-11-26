import "./css/overlay.css"

import * as FileSaver from "file-saver";
import { AlertMessage } from "./alert-message";

export class SaveDialog {
  private overlay: Overlay

  constructor(parent: HTMLElement) {
    this.overlay = new Overlay("Save PGN")
    this.overlay.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.overlay.addAction(createHTMLButton("Save", "Save PGN to disk", ["save"], () => {
      this.saveToDisk()
      this.overlay.hide()
    }))

    this.overlay.addAction(createHTMLButton("Copy", "Copy PGN to clipboard", ["copy"], () => {
      this.copyToClipboard()
    }))

    this.overlay.addAction(createHTMLButton("Cancel", "Close this dialog", ["cancel"], () => {
      this.overlay.hide()
    }))

    parent.append(this.overlay.html)
  }

  show() {
    this.overlay.show()
  }

  updatePGN(pgn: string) {
    this.overlay.textArea.value = pgn
    this.overlay.textArea.scrollTop = this.overlay.textArea.scrollHeight
  }

  private textAreaKeyboardEvents() {
    return (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        this.overlay.hide()
      }
    }
  }

  private content(): string {
    return this.overlay.textArea.value
  }

  // TODO: doesn't work on my mobile
  private copyToClipboard() {
    navigator.clipboard.writeText(this.content()).then(() => {
      this.overlay.alert.success("Copied PGN to clipboard")
    }, (reason) => {
      this.overlay.alert.warning(`Failed copying PGN to clipboard: ${reason}`)
    })
  }

  private saveToDisk() {
    const blob = new Blob([this.content()], { type: "application/x-chess-pgn" })
    FileSaver.saveAs(blob, "game.pgn")
  }
}

export class LoadDialog {
  private overlay: Overlay
  private onSubmitFn: (pgn: string) => boolean = (pgn: string) => { return true }

  constructor(parent: HTMLElement) {
    this.overlay = new Overlay("Load PGN")
    this.overlay.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.overlay.addAction(createHTMLButton("Submit", "Load PGN from textarea", ["submit"], () => {
      this.submit()
    }))

    // TODO: styling: https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
    const openFileInput = document.createElement("input")
    openFileInput.type = "file"
    openFileInput.addEventListener("change", this.loadFileToTextArea())

    const openFileLabel = document.createElement("label") as HTMLLabelElement
    openFileLabel.classList.add("custom-file-upload")
    openFileLabel.append(openFileInput)
    openFileLabel.append("Open")
    this.overlay.addAction(openFileLabel)

    this.overlay.addAction(createHTMLButton("Cancel", "Close this dialog", ["cancel"], () => {
      this.close()
    }))

    parent.append(this.overlay.html)
  }

  open() {
    this.overlay.show()
  }

  onSubmit(fn: (pgn: string) => boolean) {
    this.onSubmitFn = fn
  }

  private submit() {
    const pgn = this.overlay.textArea.value
    if (this.onSubmitFn(pgn)) {
      this.close()
    } else {
      this.overlay.alert.warning("Cound not parse PGN", 5000)
      this.overlay.textArea.focus()
    }
  }

  private close() {
    this.overlay.hide()
    this.overlay.textArea.value = ""
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
        this.overlay.textArea.value = contents
      }
      reader.readAsText(file)
    }
  }
}

function createHTMLButton(content: string, tooltip: string, cssClasses: string[], onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null): HTMLButtonElement {
  const tooltipHTML = document.createElement('span')
  tooltipHTML.classList.add("tooltiptext")
  tooltipHTML.textContent = tooltip

  const button = document.createElement('button')
  button.textContent = content
  button.classList.add("tooltip")
  button.classList.add(...cssClasses)
  button.append(tooltipHTML)
  button.onclick = onclick
  return button
}

class Overlay {
  public readonly alert = new AlertMessage(document.createElement("div"))
  public readonly textArea = document.createElement("textarea")
  public readonly html = document.createElement("div")

  private titleHTML: HTMLHeadingElement

  constructor(title: string) {
    const bodyHTML = document.createElement("div")

    this.titleHTML = document.createElement("h1")
    this.titleHTML.textContent = title

    bodyHTML.classList.add("overlay-body")
    bodyHTML.append(this.titleHTML)
    bodyHTML.append(this.alert.element)
    bodyHTML.append(this.textArea)

    this.html.classList.add("overlay")
    this.html.append(bodyHTML)
  }

  addAction(action: HTMLElement) {
    this.titleHTML.append(action)
  }

  show() {
    this.html.style.display = "block"
    this.textArea.focus()
  }

  hide() {
    this.html.style.display = "none"
  }
}
