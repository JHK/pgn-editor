import "./css/overlay.css"

import * as FileSaver from "file-saver";
import { AlertMessage } from "./alert-message";
import { addTooltip } from "./tooltip";

export class SaveDialog {
  private overlay: Overlay

  constructor(parent: HTMLElement) {
    this.overlay = new Overlay("Save PGN")
    this.overlay.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.overlay.addAction(createHTMLButton("fa-times", "Close this dialog", ["red"], () => {
      this.overlay.hide()
    }))

    this.overlay.addAction(createHTMLButton("fa-save", "Save PGN to disk", [], () => {
      this.saveToDisk()
      this.overlay.hide()
    }))

    this.overlay.addAction(createHTMLButton("fa-clipboard", "Copy PGN to clipboard", [], () => {
      this.copyToClipboard()
    }))

    const lichessImage = document.createElement('img')
    lichessImage.src = new URL("../assets/images/lichess.svg", import.meta.url).toString()
    lichessImage.width = 28
    lichessImage.height = 28

    const lichessButton = document.createElement('button')
    addTooltip(lichessButton, "Import PGN on lichess")
    lichessButton.onclick = () => { this.copyToLichess() }
    lichessButton.append(lichessImage)
    this.overlay.addAction(lichessButton)

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

  private copyToClipboard() {
    if (navigator.clipboard == undefined) {
      this.overlay.alert.warning("Unable to write to clipboard")
      return
    }

    navigator.clipboard.writeText(this.content()).then(() => {
      this.overlay.alert.success("Copied PGN to clipboard")
    }, (reason) => {
      this.overlay.alert.warning(`Failed copying PGN to clipboard: ${reason}`)
    })
  }

  private copyToLichess() {
    const url = "https://lichess.org/paste?pgn=" + encodeURI(this.content())
    window.open(url, "_blank")
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
    this.overlay = new Overlay("Open PGN")
    this.overlay.textArea.addEventListener("keyup", this.textAreaKeyboardEvents())

    this.overlay.addAction(createHTMLButton("fa-times", "Close this dialog", ["red"], () => {
      this.close()
    }))

    this.overlay.addAction(createHTMLButton("fa-check", "Open this PGN", ["green"], () => {
      this.submit()
    }))

    const openFileInput = document.createElement("input")
    openFileInput.type = "file"
    openFileInput.addEventListener("change", this.loadFileToTextArea())

    const openFileIcon = document.createElement("i")
    openFileIcon.classList.add("fas", "fa-folder-open")

    const openFileLabel = document.createElement("label")
    openFileLabel.classList.add("custom-file-upload")
    openFileLabel.append(openFileInput)
    openFileLabel.append(openFileIcon)
    addTooltip(openFileLabel, "Load PGN from disk")
    this.overlay.addAction(openFileLabel)

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

function createHTMLButton(icon: string, tooltip: string, cssClasses: string[], onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null): HTMLButtonElement {
  const iconHTML = document.createElement("i")
  iconHTML.classList.add("fas", icon)

  const button = document.createElement("button")
  if (cssClasses.length) { button.classList.add(...cssClasses) }
  addTooltip(button, tooltip)
  button.append(iconHTML)
  button.onclick = onclick
  return button
}

class Overlay {
  public readonly alert = new AlertMessage(document.createElement("div"))
  public readonly textArea = document.createElement("textarea")
  public readonly html = document.createElement("div")

  private headerHTML: HTMLElement

  constructor(title: string) {
    const bodyHTML = document.createElement("div")
    const titleHTML = document.createElement("h1")
    titleHTML.textContent = title

    this.headerHTML = document.createElement("div")
    this.headerHTML.classList.add("headlineWithCommands")
    this.headerHTML.append(titleHTML)

    bodyHTML.classList.add("overlay-body")
    bodyHTML.append(this.headerHTML)
    bodyHTML.append(this.alert.element)
    bodyHTML.append(this.textArea)

    this.html.classList.add("overlay")
    this.html.append(bodyHTML)
  }

  addAction(action: HTMLElement) {
    this.headerHTML.append(action)
  }

  show() {
    this.html.style.display = "block"
    this.textArea.focus()
  }

  hide() {
    this.html.style.display = "none"
  }
}
