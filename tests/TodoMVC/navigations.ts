import { Page } from "@playwright/test";

import locators from "./locators";

// -------------------------------------------------------------------------------------------------

export default {
  
  addItemToList: async (page: Page, item: string) => {
    await locators.getNewTodoTextBox(page).fill(item);
    await locators.getNewTodoTextBox(page).press("Enter");
  },

  removeItemFromListByIndex: async (page: Page, index: number) => {
    // This button component changes when hovered. So, the item must be hovered first
    await locators.getTodoItems(page).nth(index).hover();
    await locators.getRemoveItemButtons(page).nth(index).click();
  },

  markAllItemsAsCompleted: async (page: Page) => {
    await locators.getToggleAllButton(page).check();
  },

  markAllItemsAsActive: async (page: Page) => {
    await locators.getToggleAllButton(page).uncheck();
  },

  markItemAsCompleted: async (page: Page, index: number) => {
    await locators.getCompleteItemCheckboxes(page).nth(index).check();
  },

  markItemAsActive: async (page: Page, index: number) => {
    await locators.getCompleteItemCheckboxes(page).nth(index).uncheck();
  },

  filterByCompletedItems: async (page: Page) => {
    await locators.getFilterByCompletedItemsButton(page).click();
  },

  filterByActiveItems: async (page: Page) => {
    await locators.getFilterByActiveItemsButton(page).click();
  },

  filterByAllItems: async (page: Page) => {
    await locators.getFilterByAllItemsButton(page).click();
  },

  clearCompletedItems: async (page: Page) => {
    await locators.getClearCompletedItemsButton(page).click();
  },

};
