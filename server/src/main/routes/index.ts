import { CompareStocksUseCase } from '@app/core/use-cases/CompareStocks';
import { GainsStocksUseCase } from '@app/core/use-cases/GainsStocks';
import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { GetStockHistoryUseCase } from '@app/core/use-cases/GetStockHistory';
import { HttpRequest } from '@app/infra/http/HttpRequest';
import { Route } from '@app/infra/http/routes';
import { CompareStocksRoute } from '@app/infra/http/routes/CompareStocksRoute';
import { GetStockCurrentPriceRoute } from '@app/infra/http/routes/GetStockCurrentPriceRoute';
import { GetStockHistoryRoute } from '@app/infra/http/routes/GetStockHistoryRoute';
import { StockGainsRoute } from '@app/infra/http/routes/StockGainsRoute';
import { AlphaVantageStockingAPI } from '@app/services/AlphaVantageStockingAPI';
import { Request, Response, Router } from 'express';

const router = Router();

const stockingAPI = new AlphaVantageStockingAPI(process.env.API_KEY);
const getStockCurrentPriceUseCase = new GetStockCurrentPriceUseCase(stockingAPI);
const getStockCurrentPriceRoute = new GetStockCurrentPriceRoute(getStockCurrentPriceUseCase);

const getStockHistoryUseCase = new GetStockHistoryUseCase(stockingAPI);
const getStockHistoryRoute = new GetStockHistoryRoute(getStockHistoryUseCase);

const compareStocksUseCase = new CompareStocksUseCase(stockingAPI);
const compareStocksRoute = new CompareStocksRoute(compareStocksUseCase);

const stockGainsUseCase = new GainsStocksUseCase(stockingAPI);
const stockGainsRoute = new StockGainsRoute(stockGainsUseCase);

router.get('/stock/:stockName/quote', adaptToRoute(getStockCurrentPriceRoute));
router.get('/stocks/:stockName/history', adaptToRoute(getStockHistoryRoute));
router.get('/stocks/:stockName/compare', adaptToRoute(compareStocksRoute));
router.get('/stocks/:stockName/gains', adaptToRoute(stockGainsRoute));

export default router;

function adaptToRoute(route: Route) {
  return async (request: Request, response: Response) => {
    const routeResponse = await route.handle(HttpRequest.ofExpress(request));
    return response.status(routeResponse.statusCode).json(routeResponse.body);
  };
}
