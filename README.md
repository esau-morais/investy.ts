# investy

![Investy - Start investing now](./Cover.png)

## Table of content

- [About](#about)
- [Goals](#goals)
- [Built with](#built-with)
- [Folder structure](#folder-structure)
- [Installation](#how-do-i-start)
- [Credits](#credits)

## About

📈A simple stock market web app made for new investors.

## Goals

- [x] Get a specific stock latest price
- [x] Create a chart component with prices/date (daily) in a specific interval
  - [ ] Format chart XAxis (date)
  - [ ] Add a dynamic date picker (filtered by hours, days, months, years and all)
- [x] List stocks to compare
  - [x] Get the percentage (gain/loss)
  - [ ] Add dynamic chart based on gain/loss
- [X] Make a search input to find stocks
  - [ ] Name
  - [X] Symbol
- [ ] Create route that redirects to specific stocks
- [ ] Feature a news section

## Built with

- Vite
  - React.js + TypeScript
- Alpha Vantage
- Polygon
- Finnhub
- Tailwind CSS
- Recharts
- Jest

## Folder structure

### Client

```
src
├── assets // all public media (e.g.: favicon)
├── layouts // components in general and its styles
├── lib // declarations i'll need to use a lot
├── pages // where the components go most of the time
├── styles // global.css with tailwind functions
├── App.tsx
├── main.tsx
```

## How do I start?

1. Fork this project

![Forking the project](https://camo.githubusercontent.com/6f03010c651d060f8b7cfc17da7098c1757c4ead/68747470733a2f2f6669727374636f6e747269627574696f6e732e6769746875622e696f2f6173736574732f526561646d652f666f726b2e706e67)

2. Clone the forked repository

   `git clone https://github.com/user/investy` (if you use `git`)

   or

   `gh repo clone https://github.com/user/investy` (if you use `gh` cli)

3. Install the dependencies

   `npm install` (if you use `npm`)

   or

   `yarn` (if you use `yarn`)

4. Start the project

   `npm start` (if you `npm`)

   or

   `yarn start` (if you use `yarn`)

**_⚠️ Before installing the dependencies, make sure you have filled the `.env` file with each API Key._**

Get Alpha Vantage API Key [here](https://www.alphavantage.co/support/#api-key)

Purchase your Polygon API Key [here](https://polygon.io/dashboard/signup)

Don't forget about [Finnhub](https://finnhub.io/register) as well

---

[LICENSE](./LICENSE)
