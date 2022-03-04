import { filterRampCatalogEntries } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers"
import { RampCatalogEntry } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types"
import { Currency } from "@ledgerhq/live-common/lib/types"

type Params = { byId?: string, byTicker?: string }

export const getRampCatalogCurrencies(params: Params, entries: RampCatalogEntry[], allCurrencies: Currency[]): Currency[] {
    const currencies = filterRampCatalogEntries(entries, {  })
}
