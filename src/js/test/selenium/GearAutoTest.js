// must be on the gear page to use this function
const createGear = (code, fee, desc, category) => {
    browser.click("button*=Add New Gear");
    browser.setValue("[name=gearCode]", code);
    browser.setValue("[name=depositFee]", fee);
    browser.setValue("[name=gearDescription]", desc);
    browser.click("[name=gearCategory]");
    browser.selectByVisibleText("[name=gearCategory]", category);
    browser.click("button*=Submit");
    browser.waitForVisible(`td=${code}`);
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

        browser.waitForVisible("[id=gear-view-tabs-tab-2]");
        browser.click("[id=gear-view-tabs-tab-2]");

        browser.waitForVisible("button*=Add New Category");
        browser.click("button*=Add New Category");

        browser.waitForVisible("[name=category]");
        browser.setValue("[name=category]", "Backpack");

        browser.waitForVisible("button*=Submit");
        browser.click("button*=Submit");

        browser.waitForVisible("td=Backpack");
        expect(browser.isExisting("td=Backpack"), "there should be a row with the backpack category.").to.be.true;
    });

    it("Gear-Mgmt-04: Can Create Gear", () => {
        browser.url("/gear");
        browser.click("[id=gear-view-tabs-tab-1]");

        createGear("BP01", "50.00", "Brand new backpack! Red, fits lots.", "Backpack");

        expect(browser.isExisting("td=BP01"), "there should be a row with the new gear.").to.be.true;
    });

    it("Gear-Mgmt-07: Edit Details on Gear", () => {
        createGear("BP02", "0.01", "Slighty oldr bckp. Fits some.", "Backpack");
        expect(browser.isExisting("td=BP02"), "there should be a row with the new gear.").to.be.true;
        expect(browser.isExisting("td=Slighty oldr bckp. Fits some."), "there should be a row with the new description.").to.be.true;
        expect(browser.isExisting("td=0.01"), "there should be a row with the small fee.").to.be.true;

        // Test that we can open the editor for BP01
        browser.click("[name=edit-gear-BP01]");
        browser.waitForVisible("[name=gearCode]");
        expect(browser.getValue("[name=gearCode]")).to.equal("BP01");
        browser.waitForVisible(".close");
        browser.click(".close");
        browser.waitForVisible(".modal-open", null, true);

        // Open the editor for BP02
        browser.click("[name=edit-gear-BP02]");
        browser.waitForVisible("[name=gearCode]");
        expect(browser.getValue("[name=gearCode]")).to.equal("BP02");
        browser.clearElement("[name=gearDescription]");
        browser.setValue("[name=gearDescription]", "Slightly older blue backpack.");
        browser.clearElement("[name=depositFee]");
        browser.setValue("[name=depositFee]", "49.99");
        browser.click("button*=Submit");
        browser.waitForVisible(".modal-open", null, true);
        browser.waitForVisible("td=49.99");
        browser.waitForVisible("td=Slightly older blue backpack.");

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
        browser.waitForVisible("td=BP02", null, true);

        // ensure deletion
        browser.refresh();
        browser.waitForVisible("td=BP01");
        expect(browser.isExisting("td=BP02")).to.be.false;
    });

    it("Gear-Mgmt-03: Can Remove Gear Category.", () => {
        browser.waitForVisible("[id=gear-view-tabs-tab-2]");
        browser.click("[id=gear-view-tabs-tab-2]");

        // create a new category
        browser.waitForVisible("button*=Add New Category");
        browser.click("button*=Add New Category");
        browser.waitForVisible("[name=category]");
        browser.setValue("[name=category]", "Baaddd Nemme");
        browser.waitForVisible("button*=Submit");
        browser.click("button*=Submit");
        browser.waitForVisible(".modal-open", null, true);

        // See it, then delete it.
        browser.waitForVisible("td=Baaddd Nemme");
        browser.click("[name=delete-category-Baaddd-Nemme]");
        browser.waitForVisible("button*=Submit");
        browser.click("button*=Submit");
        browser.waitForVisible("td=Baaddd Nemme", null, true);

        // Ensure deletion isn't just in local state
        browser.refresh();
        browser.waitForVisible("[id=gear-view-tabs-tab-2]");
        browser.click("[id=gear-view-tabs-tab-2]");
        browser.waitForVisible("td=Backpack");
        expect(browser.isExisting("td=Baaddd Nemme")).to.be.false;
    });
});
