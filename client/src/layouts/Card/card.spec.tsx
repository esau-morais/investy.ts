import { getByTestId, render } from '@testing-library/react'
import Quote from '.'

describe('Quote', () => {
  it('should render quote anchor and check if link is safe', () => {
    let quoteContainer: HTMLElement
    const { container } = render(
      <>
        <Quote.Anchor href="" target="_blank" rel="noreferrer noopener">
          idk
        </Quote.Anchor>
      </>
    )
    quoteContainer = container
    const quoteAnchor = getByTestId(quoteContainer, 'quote')
    expect(quoteAnchor).toHaveAttribute('href', '')
    expect(quoteAnchor).toHaveAttribute('target', '_blank')
    expect(quoteAnchor).toHaveAttribute('rel', 'noreferrer noopener')
  })
})
