import axios, { AxiosResponse } from 'axios'
import { getNewsFeed } from './getNewsFeed'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Feed', () => {
  it('should call the api', async () => {
    const posts = [
      {
        category: 'forex',
        datetime: 1648431186,
        headline:
          'Australia data - NAB quarterly business confidence for Q1 2022 comes in at 14 (prior 19)',
        id: 7068179,
        image: '',
        related: '',
        source: 'Forexlive',
        summary:
          'NAB Quarterly Business Survey has been released earlier than usual by the bank. \nconfidence to +14 \n\n    prior +19\n\nconditions +9 \n\n    prior +14\n\n\nThere are familiar themes in the report on supply chain disruption,  higher commodity prices and the tightening labour market. Says NAB:“The additional',
        url: 'https://www.forexlive.com/news/australia-data-nab-quarterly-business-confidence-for-q1-2022-comes-in-at-14-prior-19-20220328/',
      },
      {
        category: 'forex',
        datetime: 1648431186,
        headline:
          'Australia data - NAB quarterly business confidence for Q1 2022 comes in at 14 (prior 19)',
        id: 7068179,
        image: '',
        related: '',
        source: 'Forexlive',
        summary:
          'NAB Quarterly Business Survey has been released earlier than usual by the bank. \nconfidence to +14 \n\n    prior +19\n\nconditions +9 \n\n    prior +14\n\n\nThere are familiar themes in the report on supply chain disruption,  higher commodity prices and the tightening labour market. Says NAB:“The additional',
        url: 'https://www.forexlive.com/news/australia-data-nab-quarterly-business-confidence-for-q1-2022-comes-in-at-14-prior-19-20220328/',
      },
    ]

    const mockedResponse: AxiosResponse = {
      data: posts,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    mockedAxios.get.mockResolvedValueOnce(mockedResponse)
    expect(axios.get).not.toHaveBeenCalled()
    const data = await getNewsFeed()
    console.log(data)
    expect(axios.get).toHaveBeenCalled()
    expect(data).toEqual(posts)
  })
})
