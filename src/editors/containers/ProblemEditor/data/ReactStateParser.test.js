import { ReactStateParser } from "./ReactStateParser";
import { checklistWithFeebackHints,
         dropdownWithFeedbackHints,
         numericWithHints,
         textInputWithHints,
         sigleSelectWithHints } from "./mockData/problemTestData";

describe("Check Markdown Parser", () => {
  test("Test Multiselect with hints and feedback", () => {
    let markdown = new ReactStateParser(checklistWithFeebackHints.problem).getMarkdown();
    expect(markdown).toBe(checklistWithFeebackHints.markdown);
  });
  test("Test Dropdown with hints and feedback", () => {
    let markdown = new ReactStateParser(dropdownWithFeedbackHints.problem).getMarkdown();
    expect(markdown).toBe(dropdownWithFeedbackHints.markdown);
  });
  test("Test Numeric with multiple correct and hints", () => {
    let markdown = new ReactStateParser(numericWithHints.problem).getMarkdown();
    expect(markdown).toBe(numericWithHints.markdown);
  });
  test("Test Text with multiple correct and hints", () => {
    let markdown = new ReactStateParser(textInputWithHints.problem).getMarkdown();
    // console.log(markdown);
    expect(markdown).toBe(textInputWithHints.markdown);
  });
  test("Test single select with hints", () => {
    let markdown = new ReactStateParser(sigleSelectWithHints.problem).getMarkdown();
    expect(markdown).toBe(sigleSelectWithHints.markdown);
  });
})
