<?php

namespace App\Services;

/**
 * Server-side authority for PC Builder pricing.
 *
 * The frontend shows an indicative range for immediate feedback, but that value
 * is user-controllable — a submitted `estimate` is stored purely so sales can
 * see what the customer was shown, never used for pricing.
 *
 * Weights mirror frontend/src/data/builder.ts. When one changes, change both,
 * and expect the two to diverge over time as real component pricing moves —
 * this is the copy that matters.
 */
class BuildEstimator
{
    /** Base cost by performance tier, in rupees. */
    private const BASE = [
        'entry' => 55_000,
        'mid' => 110_000,
        'high' => 210_000,
        'extreme' => 400_000,
    ];

    /** Multiplier by primary workload. */
    private const PURPOSE_WEIGHT = [
        'gaming' => 1.00,
        'editing' => 1.15,
        'office' => 0.55,
        'programming' => 0.95,
        'ai' => 1.75,
        'streaming' => 1.20,
        'architecture' => 1.35,
    ];

    private const ACCESSORY_PRICE = [
        'monitor' => 28_000,
        'keyboard' => 8_500,
        'mouse' => 5_500,
        'headset' => 9_500,
        'ups' => 21_500,
    ];

    /** Deliberately wide — component pricing moves week to week. */
    private const SPREAD = 0.12;

    /**
     * @param  list<string>  $accessories
     * @return array{low: int, high: int, system: int, accessories: int}
     */
    public function estimate(string $purpose, string $performance, array $accessories = []): array
    {
        $base = self::BASE[$performance] ?? self::BASE['mid'];
        $weight = self::PURPOSE_WEIGHT[$purpose] ?? 1.0;

        $system = (int) round($base * $weight);

        $extras = array_sum(array_map(
            fn (string $key) => self::ACCESSORY_PRICE[$key] ?? 0,
            $accessories
        ));

        $centre = $system + $extras;

        return [
            'low' => $this->roundToThousand($centre * (1 - self::SPREAD)),
            'high' => $this->roundToThousand($centre * (1 + self::SPREAD)),
            'system' => $system,
            'accessories' => $extras,
        ];
    }

    private function roundToThousand(float $value): int
    {
        return (int) (round($value / 1000) * 1000);
    }
}
