import { Page } from "@playwright/test";
import { fakerPT_BR as faker } from "@faker-js/faker";

import navigations from "./navigations";

// -------------------------------------------------------------------------------------------------

export default {

  populateListWithRandomItems: async (page: Page, numItems: number) => {
    for ( let i=0; i<numItems; i++ ) {
      const newItem = faker.commerce.productName();
      await navigations.addItemToList(page, newItem);
    }
  },

  markRandomItemsAsCompleted: async (page: Page, totalItems: number): Promise<number> => {
    var numItemsCompleted = 0;
    for ( let i=0; i<totalItems; i++ ) {
      let randInt = faker.number.int({ min: 0, max: 1});
      // Marks if randInt is odd
      if ( randInt & 0x01 ) {
        numItemsCompleted++;
        await navigations.markItemAsCompleted(page, i);
      }
    }
    return numItemsCompleted;
  },

}