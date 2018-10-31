// must be on the gear page to use this function
const createGear = (code, fee, desc, category) => {
    browser.click("button*=Add New Gear");
    browser.setValue("[name=gearCode]", code);
    browser.setValue("[name=depositFee]", fee);
    browser.setValue("[name=gearDescription]", desc);
    browser.click("[name=gearCategory]");
    browser.selectByVisibleText("[name=gearCategory]", category);
    browser.click("button*=Submit");
    browser.waitForVisible(`td=${code}`, 3000);
};

/**
 * Tests are ordered, changing the order could break the tests.
 *
 * Covers:
 *      - Gear-Mgmt-01
 *      - Gear-Mgmt-04
 *      - Gear-Mgmt-07
 *      - Gear-Mgmt-06
 *      - Gear-Mgmt-03
 *
 * Indirectly:
 *      - Gear-Mgmt-02 (View Categories)
 *      - Gear-Mgmt-05 (View Gear)
 */
describe("Basic Gear Management", () => {
    it("Gear-Mgmt-01: Can Create A Category", () => {
        browser.url("/gear");

        browser.waitForVisible("[id=gear-view-tabs-tab-2]", 3000);
        browser.click("[id=gear-view-tabs-tab-2]");

        browser.waitForVisible("button*=Add New Category", 3000);
        browser.click("button*=Add New Category");

        browser.waitForVisible("[name=category]", 3000);
        browser.setValue("[name=category]", "backpack");

        browser.waitForVisible("button*=Submit", 3000);
        browser.click("button*=Submit");

        browser.waitForVisible("td=backpack", 3000);
        expect(browser.isExisting("td=backpack"), "there should be a row with the backpack category.").to.be.true;
    });

    it("Gear-Mgmt-04: Can Create Gear", () => {
        browser.url("/gear");
        browser.click("[id=gear-view-tabs-tab-1]");

        createGear("BP01", "50.00", "Brand new backpack! Red, fits lots.", "backpack");

        expect(browser.isExisting("td=BP01"), "there should be a row with the new gear.").to.be.true;
    });

    it("Gear-Mgmt-07: Edit Details on Gear", () => {
        createGear("BP02", "0.01", "Slighty oldr bckp. Fits some.", "backpack");
        expect(browser.isExisting("td=BP02"), "there should be a row with the new gear.").to.be.true;
        expect(browser.isExisting("td=Slighty oldr bckp. Fits some."), "there should be a row with the new description.").to.be.true;
        expect(browser.isExisting("td=0.01"), "there should be a row with the small fee.").to.be.true;

        // Test that we can open the editor for BP01
        browser.click("[name=edit-gear-BP01]");
        browser.waitForVisible("[name=gearCode]", 3000);
        expect(browser.getValue("[name=gearCode]")).to.equal("BP01");
        browser.waitForVisible("button*=Close");
        browser.click("button*=Close");
        browser.waitForVisible(".modal-open", 5000, true);

        // Open the editor for BP02
        browser.click("[name=edit-gear-BP02]");
        browser.waitForVisible("[name=gearCode]", 3000);
        expect(browser.getValue("[name=gearCode]")).to.equal("BP02");
        browser.clearElement("[name=gearDescription]");
        browser.setValue("[name=gearDescription]", "Slightly older blue backpack.");
        browser.clearElement("[name=depositFee]");
        browser.setValue("[name=depositFee]", "49.99");
        browser.click("button*=Submit");
        browser.waitForVisible("td=49.99", 3000);
        browser.waitForVisible("td=Slightly older blue backpack.", 3000);

        // expect the data we set and removed
        expect(browser.isExisting("td=Slighty oldr bckp. Fits some."), "we edited the description from this.").to.be.false;
        expect(browser.isExisting("td=0.01"), "we edited the deposit fee from this.").to.be.false;
        expect(browser.isExisting("td=Slightly older blue backpack."), "we edited the description to this.").to.be.true;
        expect(browser.isExisting("td=49.99"), "we edited the deposit fee to this.").to.be.true;
    });

    it("Gear-Mgmt-06: Delete Gear", () => {
        browser.click("[name=delete-gear-BP02]");
        browser.waitForVisible("button*=Submit");
        browser.click("button*=Submit");
        browser.waitForVisible("td=BP02", 3000, true);

        // ensure deletion
        browser.refresh();
        browser.waitForVisible("td=BP01");
        expect(browser.isExisting("td=BP02")).to.be.false;
    });

    it("Gear-Mgmt-03: Can Remove Gear Category.", () => {
        browser.waitForVisible("[id=gear-view-tabs-tab-2]", 3000);
        browser.click("[id=gear-view-tabs-tab-2]");

        // create a new category
        browser.waitForVisible("button*=Add New Category", 3000);
        browser.click("button*=Add New Category");
        browser.waitForVisible("[name=category]", 3000);
        browser.setValue("[name=category]", "Baaddd Nemme");
        browser.waitForVisible("button*=Submit", 3000);
        browser.click("button*=Submit");
        browser.waitForVisible(".modal-open", 5000, true);

        // See it, then delete it.
        browser.waitForVisible("td=Baaddd Nemme", 3000);
        browser.click("[name=delete-category-Baaddd-Nemme]");
        browser.waitForVisible("button*=Submit", 3000);
        browser.click("button*=Submit");
        browser.waitForVisible("td=Baaddd Nemme", 3000, true);

        // Ensure deletion isn't just in local state
        browser.refresh();
        browser.waitForVisible("[id=gear-view-tabs-tab-2]", 3000);
        browser.click("[id=gear-view-tabs-tab-2]");
        browser.waitForVisible("td=backpack");
        expect(browser.isExisting("td=Baaddd Nemme")).to.be.false;
    });
});
