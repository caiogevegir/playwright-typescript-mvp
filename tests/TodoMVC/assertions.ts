import { expect, Page } from "@playwright/test";

import locators from "./locators";

// -----------------------------------------------------------------------------

export default {

  newItemIsCreated: async (page: Page, item: string) => {
    const newItem = locators.getTodoItems(page).nth(0);
    await expect.soft(newItem).toBeVisible();
    await expect.soft(newItem).toHaveText(item);
  },

  itemIsStillListed: async (page: Page, item: string) => {
    const listedItem = locators.getTodoItems(page).getByText(item);
    await expect.soft(listedItem).toBeVisible();
  },

  itemCountIsCorrect: async (page: Page, numItems: number) => {
    const textPattern = new RegExp(`^${numItems} item[s]? left$`);
    const itemCount = locators.getTodoCountText(page);
    await expect.soft(itemCount).toBeVisible()
    await expect.soft(itemCount).toHaveText(textPattern);
  },

  itemCountComponentIsInexistent: async (page: Page) => {
    const itemCount = locators.getTodoCountText(page);
    await expect.soft(itemCount).toHaveCount(0);
  },

  itemTextIsRisked: async (page: Page, index: number) => {
    const itemText = locators.getTodoItems(page).nth(index).locator('label');
    await expect.soft(itemText).toHaveCSS("text-decoration", /line-through/);
  },

  itemTextIsDefault: async (page: Page, index: number) => {
    const itemText = locators.getTodoItems(page).nth(index).locator('label');
    await expect.soft(itemText).not.toHaveCSS("text-decoration", /line-through/);
  }

};
