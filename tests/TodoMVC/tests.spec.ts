import test from "@playwright/test";
import { fakerPT_BR as faker } from "@faker-js/faker";

import utils from "./utils";
import navigations from "./navigations";
import assertions from "./assertions";
import locators from "./locators";

const url = "https://demo.playwright.dev/todomvc/#/";

// -------------------------------------------------------------------------------------------------

test.beforeEach("Going to TodoMVC website", async ({ page }, testInfo) => {
  await page.goto(url, { waitUntil: "load" });
  
  await testInfo.attach("Initial state", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
});

test.describe("Adding items to the list", () => {

  test("Avoids adding an empty item", async ({ page }, testInfo) => {

    var numItems: number;

    await test.step("Adds a random item to the list", async () => {
      const newItem = faker.commerce.productName();

      await testInfo.attach("Item added", {
        body: newItem,
        contentType: "text/plain",
      });

      await navigations.addItemToList(page, newItem);

      await testInfo.attach("New item", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Counts number of items in the list", async () => {
      numItems = await locators.getTodoItems(page).count();

      await testInfo.attach("Number of items in the list", {
        body: numItems.toString(),
        contentType: "text/plain",
      });
    });

    await test.step("Attempts to add an empty item", async () => {
      await navigations.addItemToList(page, "");

      await testInfo.attach("Attempt to add an empty item", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step(
      "Asserts empty item has not been added and the number of items in the list has not changed", 
      async () => {
        await assertions.itemCountIsCorrect(page, numItems);
      }
    );

  });


  test("Adds new item to the list", async ({ page }, testInfo) => {

    var numItemsList: number;
    var newItem: string;

    await test.step("Checks current number of items in the list", async () => {
      numItemsList = await locators.getTodoItems(page).count();
    });

    await test.step("Adds new item to the list", async () => {
      newItem = faker.commerce.productName();

      await testInfo.attach("Item value", {
        body: newItem,
        contentType: "text/plain"
      });

      await navigations.addItemToList(page, newItem);

      await testInfo.attach("Item added to list", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts new item is the first one on the list", async () => {
      await assertions.newItemIsCreated(page, newItem);
    });

    await test.step("Asserts item counter is updated", async () => {
      await assertions.itemCountIsCorrect(page, numItemsList+1);
    });

  });
  
});

// -------------------------------------------------------------------------------------------------

test.describe("Removing items from the list", () => {

  test("Removes an item from a full list", async ({ page }, testInfo) => {

    const numItems = 5;
    
    await test.step("Populates the list with multiple items", async () => {
      await utils.populateListWithRandomItems(page, numItems);

      await testInfo.attach("New random items added", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Removes a random item from the list", async () => {
      const itemIdToRemove = faker.number.int({ min: 0, max: numItems-1 });

      await testInfo.attach("Item ID to remove", {
        body: itemIdToRemove.toString(),
        contentType: "text/plain"
      });

      await navigations.removeItemFromListByIndex(page, itemIdToRemove);

      await testInfo.attach("Random item is removed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts the number of items has been decreased", async () => {
      await assertions.itemCountIsCorrect(page, numItems-1);
    });

  });


  test("Removes the last item of the list, letting it empty", async ({ page }, testInfo) => {

    await test.step("Populates the list with one item", async () => {
      const newItem = faker.commerce.productName();
      await navigations.addItemToList(page, newItem);

      await testInfo.attach("New random item added", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Removes the last item from the list", async () => {
      await navigations.removeItemFromListByIndex(page, 0);

      await testInfo.attach("Last item is removed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts the list is empty", async () => {
      await assertions.itemCountComponentIsInexistent(page);
    });

  });

});

// -------------------------------------------------------------------------------------------------

test.describe("Marking items in the list", () => {

  const numItems = 5;

  test.beforeEach("Populates list with random items", async ({ page }, testInfo) => {
    await utils.populateListWithRandomItems(page, numItems);

    await testInfo.attach("New random items added", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });


  test("Marking an item in the list as completed", async ({ page }, testInfo) => {

    const randomId = faker.number.int({ min: 0, max: numItems-1 });
    
    await test.step("Marks a random item as completed in the list", async () => {
      await navigations.markItemAsCompleted(page, randomId);

      await testInfo.attach("Random item is marked as completed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts item text is risked", async () => {
      await assertions.itemTextIsRisked(page, randomId);
    });

    await test.step("Asserts items left counter is decreased", async () => {
      await assertions.itemCountIsCorrect(page, numItems-1);
    });

  });

  test("Unmarking an item in the list back to active", async ({ page }, testInfo) => {

    const randomId = faker.number.int({ min: 0, max: numItems-1 });
    
    await test.step("Marks a random items as completed in the list", async () => {
      await navigations.markItemAsCompleted(page, randomId);

      await testInfo.attach("Random item is marked as completed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts item text is risked", async () => {
      await assertions.itemTextIsRisked(page, randomId);
    });

    await test.step("Asserts items left counter is decreased", async () => {
      await assertions.itemCountIsCorrect(page, numItems-1);
    });

    await test.step("Unmarks the item previously marked", async () => {
      await navigations.markItemAsActive(page, randomId);

      await testInfo.attach("Item is unmarked back to active", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts item text has default display", async () => {
      await assertions.itemTextIsDefault(page, randomId);
    });

    await test.step("Asserts item count is increased back", async () => {
      await assertions.itemCountIsCorrect(page, numItems);
    });

  });


  test("Marking all the items in the list at once as completed", async ({ page }, testInfo) => {

    await test.step("Marks all items as completed", async () => {
      await navigations.markAllItemsAsCompleted(page);

      await testInfo.attach("All items are marked as completed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts items left counter is 0", async () => {
      await assertions.itemCountIsCorrect(page, 0);
    });

  });

  test("Unmarking all the items in the list at once back to active", async ({ page }, testInfo) => {

    await test.step("Marks all items as completed", async () => {
      await navigations.markAllItemsAsCompleted(page);

      await testInfo.attach("All items are marked as completed", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Unmarks all items back to active", async () => {
      await navigations.markAllItemsAsActive(page);

      await testInfo.attach("All items are unmarked back to active", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts items left counter counts all of them", async () => {
      await assertions.itemCountIsCorrect(page, numItems);
    });

  });

});

// -------------------------------------------------------------------------------------------------

test.describe("Filtering items in the list", () => {

  const numItems = 5;
  var numItemsCompleted = 0;

  test.beforeEach("Populates list with random items", async ({ page }, testInfo) => {
    await utils.populateListWithRandomItems(page, numItems);

    await testInfo.attach("New random items added", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });


  test.beforeEach("Marks random items as completed", async ({ page }, testInfo) => {
    numItemsCompleted = await utils.markRandomItemsAsCompleted(page, numItems);

    await testInfo.attach("Random items marked as completed", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });


  test("Filtering by completed items", async ({ page }, testInfo) => {

    await test.step("Filters by completed items", async () => {
      await navigations.filterByCompletedItems(page);

      await testInfo.attach("List filtered by completed items", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts only completed items are shown", async () => {
      for ( let i=0; i<numItemsCompleted; i++ ) {
        await assertions.itemTextIsRisked(page, i);
      }
    });

  });


  test("Filtering by active items", async ({ page }, testInfo) => {

    await test.step("Filters by active items", async () => {
      await navigations.filterByActiveItems(page);

      await testInfo.attach("List filtered by active items", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await test.step("Asserts only active items are shown", async () => {
      for ( let i=0; i<numItems-numItemsCompleted; i++ ) {
        await assertions.itemTextIsDefault(page, i);
      }
    });

  });

});

// -------------------------------------------------------------------------------------------------

test("Clearing completed items", async ({ page }, testInfo) => {

  const numItems = 5;
  var numItemsActive: number;
  var numItemsCompleted: number;

  await test.step("Populates list with random items", async () => {
    await utils.populateListWithRandomItems(page, numItems);

    await testInfo.attach("New random items added", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Marks random items as completed", async () => {
    numItemsCompleted = await utils.markRandomItemsAsCompleted(page, numItems);

    await testInfo.attach("Random items marked as completed", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Clears completed items", async () => {
    await navigations.clearCompletedItems(page);
    
    await testInfo.attach("Complete items cleared", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Asserts complete items were removed from the list", async () => {
    numItemsActive = await locators.getTodoItems(page).count();
    for ( let i=0; i<numItemsActive; i++ ) {
      await assertions.itemTextIsDefault(page, i);
    }
  });

  await test.step("Asserts items left count was decreased", async () => {
    await assertions.itemCountIsCorrect(page, numItemsActive);
  });

});

// -------------------------------------------------------------------------------------------------

test("Persisting items in the list on page reload", async ({ page }, testInfo) => {

  var newItem: string;

  await test.step("Adds new item to the list", async () => {
    newItem = faker.commerce.productName();

    await testInfo.attach("Item value", {
      body: newItem,
      contentType: "text/plain"
    });

    await navigations.addItemToList(page, newItem);

    await testInfo.attach("Item added to list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Reload page", async () => {
    await page.reload();

    await testInfo.attach("Page reloaded", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Asserts added item is still listed", async () => {
    await assertions.itemIsStillListed(page, newItem);
  });

});
