import { splitMoney } from "@/newcore/pot";

describe("Poker Pot Tets", () => {
    it("should split one man lose three men chopped", () => {
        const result = splitMoney(
            ["boy", "girl", "texas"],
            ["lle"],
            new Map([
                ["boy", 3000],
                ["girl", 2000],
                ["texas", 1000],
                ["lle", 4000],
            ])
        );
        expect(result.get("boy")).toBe(4000 / 3 + 3000 / 2 + 2000 / 1);
        expect(result.get("girl")).toBe(4000 / 3 + 3000 / 2);
        expect(result.get("texas")).toBe(4000 / 3);
        expect(result.get("lle")).toBe(1000);
    });

    it("should split small one man lose three men chopped", () => {
        const result = splitMoney(
            ["boy", "girl", "texas"],
            ["lle"],
            new Map([
                ["boy", 3000],
                ["girl", 2000],
                ["texas", 1000],
                ["lle", 600],
            ])
        );
        expect(result.get("boy")).toBe(3600 / 3 + 2000 / 2 + 1000 / 1);
        expect(result.get("girl")).toBe(3600 / 3 + 2000 / 2);
        expect(result.get("texas")).toBe(3600 / 3);
        expect(result.get("lle")).toBe(0);
    });
});
