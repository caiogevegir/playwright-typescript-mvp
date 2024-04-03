import { Locator, Page } from "@playwright/test";

// -----------------------------------------------------------------------------

export default {

  getNewTodoTextBox: (page: Page): Locator => {
    return page.locator("input[class='new-todo']");
  },

  getTodoItems: (page: Page): Locator => {
    return page.getByTestId("todo-item");
  },

  getRemoveItemButtons: (page: Page): Locator => {
    return page.getByLabel("Delete");
  },

  getToggleAllButton: (page: Page): Locator => {
    return page.locator("input[id='toggle-all']");
  },

  getCompleteItemCheckboxes: (page: Page): Locator => {
    return page.getByLabel("Toggle Todo");
  },

  getFilterByAllItemsButton: (page: Page): Locator => {
    return page.locator("li").getByText("All");
  },

  getFilterByActiveItemsButton: (page: Page): Locator => {
    return page.locator("li").getByText("Active");
  },

  getFilterByCompletedItemsButton: (page: Page): Locator => {
    return page.locator("li").getByText("Completed");
  },

  getTodoCountText: (page: Page): Locator => {
    return page.locator("span[class='todo-count']");
  },

  getClearCompletedItemsButton: (page: Page): Locator => {
    return page.locator("button[class='clear-completed']");
  },

}
