import { MoneyLog } from "@/app/lib/definitions";
import { splitMoney } from "@/core/pot";

function mapToLog(maps: Map<string, number>) {
    const result: MoneyLog[] = [];
    maps.forEach((money, player) => {
        result.push({ playerName: player, money: money });
    });
    return result;
}

describe("Poker Pot Tets", () => {
    it("should split one man lose three men chopped", () => {
        const result = splitMoney(
            ["boy", "girl", "texas"],
            ["lle"],
            mapToLog(
                new Map([
                    ["boy", 3000],
                    ["girl", 2000],
                    ["texas", 1000],
                    ["lle", 4000],
                ])
            )
        );
        expect(result.find((log) => log.playerName === "boy")!.money).toBe(
            4000 / 3 + 3000 / 2 + 2000 / 1
        );
        expect(result.find((log) => log.playerName === "girl")!.money).toBe(
            4000 / 3 + 3000 / 2
        );
        expect(result.find((log) => log.playerName === "texas")!.money).toBe(
            4000 / 3
        );
        expect(result.find((log) => log.playerName === "lle")!.money).toBe(
            1000
        );
    });

    it("should split small one man lose three men chopped", () => {
        const result = splitMoney(
            ["boy", "girl", "texas"],
            ["lle"],
            mapToLog(
                new Map([
                    ["boy", 3000],
                    ["girl", 2000],
                    ["texas", 1000],
                    ["lle", 600],
                ])
            )
        );
        expect(result.find((log) => log.playerName === "boy")!.money).toBe(
            3600 / 3 + 2000 / 2 + 1000 / 1
        );
        expect(result.find((log) => log.playerName === "girl")!.money).toBe(
            3600 / 3 + 2000 / 2
        );
        expect(result.find((log) => log.playerName === "texas")!.money).toBe(
            3600 / 3
        );
        expect(result.find((log) => log.playerName === "lle")!.money).toBe(0);
    });
});
