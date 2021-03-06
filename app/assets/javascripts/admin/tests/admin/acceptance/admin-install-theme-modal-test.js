import { acceptance, query } from "discourse/tests/helpers/qunit-helpers";
import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";
import I18n from "I18n";

acceptance("Admin - Themes - Install modal", function (needs) {
  needs.user();
  test("closing the modal resets the modal inputs", async function (assert) {
    const urlInput = ".install-theme-content .repo input";
    const branchInput = ".install-theme-content .branch input";
    const privateRepoCheckbox = ".install-theme-content .check-private input";

    const themeUrl = "git@github.com:discourse/discourse.git";
    await visit("/admin/customize/themes");

    await click(".create-actions .btn-primary");
    await click("#remote");
    await fillIn(urlInput, themeUrl);
    await click(".install-theme-content .inputs .advanced-repo");
    await fillIn(branchInput, "tests-passed");
    await click(privateRepoCheckbox);
    assert.equal(query(urlInput).value, themeUrl, "url input is filled");
    assert.equal(
      query(branchInput).value,
      "tests-passed",
      "branch input is filled"
    );
    assert.ok(
      query(privateRepoCheckbox).checked,
      "private repo checkbox is checked"
    );

    await click(".modal-footer .d-modal-cancel");

    await click(".create-actions .btn-primary");
    await click("#remote");
    assert.equal(query(urlInput).value, "", "url input is reset");
    assert.equal(query(branchInput).value, "", "branch input is reset");
    assert.ok(
      !query(privateRepoCheckbox).checked,
      "private repo checkbox unchecked"
    );
  });

  test("modal can be auto-opened with the right query params", async function (assert) {
    await visit("/admin/customize/themes?repoUrl=testUrl&repoName=testName");
    assert.ok(query(".admin-install-theme-modal"), "modal is visible");
    assert.equal(
      query(".install-theme code").textContent.trim(),
      "testUrl",
      "repo url is visible"
    );
  });

  test("installed themes are matched with the popular list by URL", async function (assert) {
    await visit("/admin/customize/themes");
    await click(".create-actions .btn-primary");

    assert.notOk(
      query(
        '.popular-theme-item[data-name="Graceful"] .popular-theme-buttons button'
      ),
      "no install button is shown for installed themes"
    );
    assert.equal(
      query(
        '.popular-theme-item[data-name="Graceful"] .popular-theme-buttons'
      ).textContent.trim(),
      I18n.t("admin.customize.theme.installed")
    );

    assert.ok(
      query(
        '.popular-theme-item[data-name="Minima"] .popular-theme-buttons button'
      ),
      "install button is shown for not installed themes"
    );
  });
});
