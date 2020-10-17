import { boot, backtest } from "../../src/methods";
import { AnyAlgotia } from "../../src/types";

describe("Backtest method", () => {
	let algotia: AnyAlgotia;
	beforeAll(async () => {
		algotia = await boot({
			exchange: {
				binance: true,
				kucoin: true,
			},
			debug: false,
		});
	});

	afterAll(async () => {
		algotia.quit();
	});

	test(" multi works", async () => {
		try {
			const res = await backtest(algotia, {
				since: "1/10/2020",
				until: "1/11/2020",
				pair: "ETH/BTC",
				timeframe: "1h",
				type: "multi",
				exchanges: ["binance", "kucoin"],
				initialBalances: {
					kucoin: {
						eth: 1,
						btc: 1,
					},
					binance: {
						eth: 1,
						btc: 1,
					},
				},
				strategy: () => {},
			});
			expect(res).toBe(undefined);
			return res;
		} catch (err) {
			throw err;
		} finally {
			await algotia.redis.flushall();
		}
	}, 100000);
	test("works", async () => {
		try {
			const res = await backtest(algotia, {
				since: "1/08/2020",
				until: "1/09/2020",
				pair: "ETH/BTC",
				timeframe: "1h",
				type: "single",
				initialBalance: {
					BTC: 1,
					ETH: 0,
				},
				strategy: async (exchange, data) => {
					const balance = await exchange.fetchBalance();
					console.log(balance);
					const totalETH = balance["ETH"].free;
					/* if (totalETH > 0) { */
					/* } */
					/* if (balance["BTC"].free > data.close * 50) { */
					const order = await exchange.createOrder(
						"ETH/BTC",
						"market",
						"buy",
						10
					);
					/* await exchange.cancelOrder(order.id); */
				},
			});
			console.log(res);
			expect(res).toHaveProperty("balance");
			return res;
		} catch (err) {
			throw err;
		}
	}, 100000);
});