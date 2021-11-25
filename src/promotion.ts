import "./css/promotion.css"
import { Piece, PromotionPiece } from "./pgn-editor"

const DefaultPromotionPiece: PromotionPiece = Piece.Queen

export class PromotionButton {
  private element: HTMLElement

  private queenButton: HTMLButtonElement
  private rookButton: HTMLButtonElement
  private bishopButton: HTMLButtonElement
  private knightButton: HTMLButtonElement

  private promotionPiece: PromotionPiece = DefaultPromotionPiece
  private promotionPieceFn: (piece: PromotionPiece) => void = () => { }

  constructor(element: HTMLElement) {
    this.queenButton = createButton("Promote to Queen", "fa-chess-queen")
    this.queenButton.onclick = () => { this.updatePromotionPiece(Piece.Queen) }

    this.rookButton = createButton("Promote to Rook", "fa-chess-rook")
    this.rookButton.onclick = () => { this.updatePromotionPiece(Piece.Rook) }

    this.bishopButton = createButton("Promote to Bishop", "fa-chess-bishop")
    this.bishopButton.onclick = () => { this.updatePromotionPiece(Piece.Bishop) }

    this.knightButton = createButton("Promote to Knight", "fa-chess-knight")
    this.knightButton.onclick = () => { this.updatePromotionPiece(Piece.Knight) }

    element.append(document.createElement('hr'))
    element.append(this.queenButton)
    element.append(this.rookButton)
    element.append(this.bishopButton)
    element.append(this.knightButton)
    element.append(document.createElement('hr'))

    this.element = element
    this.element.classList.add('promotion')
    this.setActiveButton()

    // Do not "flash" on page load
    this.element.style.display = "none"
    setTimeout(() => { this.element.style.display = "block" }, 300)
  }

  setVisibility(isVisible: boolean): void {
    if (isVisible) {
      this.element.style.visibility = "visible"
      this.element.style.opacity = "1"
    } else {
      this.element.style.visibility = "hidden"
      this.element.style.opacity = "0"
    }
  }

  setPromotionPiece(fn: (piece: PromotionPiece) => void) {
    this.promotionPieceFn = fn
    fn(DefaultPromotionPiece)
  }

  private setActiveButton() {
    toggleActive(this.queenButton, this.promotionPiece == Piece.Queen)
    toggleActive(this.rookButton, this.promotionPiece == Piece.Rook)
    toggleActive(this.bishopButton, this.promotionPiece == Piece.Bishop)
    toggleActive(this.knightButton, this.promotionPiece == Piece.Knight)
  }

  private updatePromotionPiece(piece: PromotionPiece) {
    this.promotionPiece = piece
    this.setActiveButton()
    this.promotionPieceFn(piece)
  }
}

function createButton(title: string, cssClass: string): HTMLButtonElement {
  const inner = document.createElement('i')
  inner.classList.add("fas", cssClass)

  const button = document.createElement("button")
  button.title = title
  button.append(inner)

  return button
}

function toggleActive(element: HTMLElement, enable: boolean) {
  if (enable) {
    element.classList.add("active")
  } else {
    element.classList.remove("active")
  }
}
