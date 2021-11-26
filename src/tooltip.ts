export function addTooltip(element: HTMLElement, tooltip: string) {
  const tooltipHTML = document.createElement("span")
  tooltipHTML.classList.add("tooltiptext")
  tooltipHTML.textContent = tooltip
  element.classList.add("tooltip")
  element.append(tooltipHTML)
}