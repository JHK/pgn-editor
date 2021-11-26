import "./css/overlay.css"

import * as FileSaver from "file-saver";
import { AlertMessage } from "./alert-message";

export class SaveDialog {
  private overlay: HTMLDivElement
  private textArea: HTMLTextAreaElement
  private saveButton: HTMLButtonElement
  private copyButton: HTMLButtonElement
  private cancelButton: HTMLButtonElement

  constructor(parent: HTMLElement, alert: AlertMessage) {
    this.textArea = document.createElement("textarea")
    this.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.saveButton = createHTMLButton("Save", "Save PGN to disk", ["save"], () => {
      this.saveToDisk()
      this.close()
    })

    this.copyButton = createHTMLButton("Copy", "Copy PGN to clipboard", ["copy"], () => {
      this.copyToClipboard()
      alert.info("Copied PGN to clipboard")
      this.close()
    })

    this.cancelButton = createHTMLButton("Cancel", "Close this dialog", ["cancel"], () => {
      this.close()
    });

    this.overlay = createOverlay("Save PGN", this.textArea, [this.saveButton, this.copyButton, this.cancelButton])
    parent.append(this.overlay)
  }

  show() {
    this.overlay.style.display = "block"
    this.textArea.focus()
  }

  updatePGN(pgn: string) {
    this.textArea.value = pgn
    this.textArea.scrollTop = this.textArea.scrollHeight
  }

  private textAreaKeyboardEvents() {
    return (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        this.close()
      }
    }
  }

  private content(): string {
    return this.textArea.value
  }

  private copyToClipboard() {
    navigator.clipboard.writeText(this.content())
  }

  private saveToDisk() {
    const blob = new Blob([this.content()], { type: "application/x-chess-pgn" })
    FileSaver.saveAs(blob, "game.pgn")
  }

  private close() {
    this.overlay.style.display = "none"
  }
}

export class LoadFromText {
  private overlay: HTMLDivElement
  private textArea: HTMLTextAreaElement
  private submitButton: HTMLButtonElement
  private openFileInput: HTMLInputElement
  private cancelButton: HTMLButtonElement
  private alert: AlertMessage
  private onSubmitFn: (pgn: string) => boolean = (pgn: string) => { return true }

  constructor(parent: HTMLElement) {
    this.textArea = document.createElement("textarea")
    this.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.submitButton = createHTMLButton("Submit", "Load PGN from textarea", ["submit"], () => {
      this.submit()
    })

    // TODO: styling: https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
    this.openFileInput = document.createElement("input")
    this.openFileInput.type = "file"
    this.openFileInput.addEventListener("change", this.loadFileToTextArea())

    this.cancelButton = createHTMLButton("Cancel", "Close this dialog", ["cancel"], () => {
      this.close()
    });

    this.alert = new AlertMessage(document.createElement('div'))
    this.overlay = createOverlay("Open PGN", this.textArea, [this.submitButton, this.openFileInput, this.cancelButton], this.alert)
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
      this.alert.warning("Cound not parse PGN", 5000)
      this.textArea.focus()
    }
  }

  private close() {
    this.overlay.style.display = "none"
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

function createTitleWithActions(content: string, ...actions: HTMLElement[]): HTMLHeadingElement {
  const title = document.createElement("h1")
  title.textContent = content
  title.append(...actions)
  return title
}

function createOverlay(title: string, textArea: HTMLTextAreaElement, actions: HTMLElement[], alert?: AlertMessage): HTMLDivElement {
  const overlayBody = document.createElement("div")
  overlayBody.append(createTitleWithActions(title, ...actions))
  if (alert) { overlayBody.append(alert.element) }
  overlayBody.classList.add("overlay-body")
  overlayBody.append(textArea)

  const overlay = document.createElement("div")
  overlay.classList.add("overlay")
  overlay.append(overlayBody)

  return overlay
}
