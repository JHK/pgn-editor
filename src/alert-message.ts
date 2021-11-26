export class AlertMessage {
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  success(message: string, timeout_ms: number = 5000) {
    this.element.append(createAlert("Success: ", message, "info", timeout_ms))
  }

  info(message: string, timeout_ms: number = 5000) {
    this.element.append(createAlert("Info: ", message, "info", timeout_ms))
  }

  warning(message: string, timeout_ms: number = 0) {
    this.element.append(createAlert("Warning: ", message, "info", timeout_ms))
  }
}

function createAlert(title: string, message: string, cssClass: string, timeout_ms: number): HTMLElement {
  const alertHTML = document.createElement("div")
  alertHTML.classList.add("alert", cssClass)

  const closeSpan = document.createElement("span")
  closeSpan.classList.add("closebtn")
  closeSpan.innerHTML = "&times;"
  closeSpan.onclick = () => { close(alertHTML) }
  alertHTML.append(closeSpan)

  const titleHTML = document.createElement("strong")
  titleHTML.textContent = title
  alertHTML.append(titleHTML)
  alertHTML.append(message)

  if (timeout_ms != 0) {
    setTimeout(() => { close(alertHTML) }, timeout_ms)
  }

  return alertHTML
}

function close(html: HTMLElement) {
  html.style.opacity = "0"
  setTimeout(() => {
    html.parentElement.removeChild(html)
  }, 600)
}
