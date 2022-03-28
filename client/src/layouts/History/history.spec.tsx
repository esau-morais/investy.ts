import { render, waitFor } from '@testing-library/react'
import Graph from './recharts'

describe('BarGraph', () => {
  describe('given two data points at a particular size', () => {
    const data = [40, 60]
    const size = { width: 500, height: 1000 }

    let graphContainer: HTMLElement
    beforeEach(() => {
      const { container } = render(
        <div>
          <Graph data={data} width={size.width} height={size.height} />
        </div>
      )
      graphContainer = container
    })

    test.each`
      index | height   | x        | y
      ${0}  | ${'640'} | ${'100'} | ${'340'}
      ${1}  | ${'348'} | ${'300'} | ${'20'}
    `('renders rects', async ({ index, height, x, y }) => {
      // waits for the svg to show up due to animation in graph library
      await waitFor(() => {
        const bars = graphContainer.querySelectorAll(
          '.recharts-responsive-container'
        )
        expect(bars[index].getAttribute('height')).toBe(height)
        expect(bars[index].getAttribute('x')).toBe(x)
        expect(bars[index].getAttribute('y')).toBe(y)
      })
    })
  })
})
