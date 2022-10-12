import { ReactStateParser } from './ReactStateParser';
import {
  checklistWithFeebackHints,
  dropdownWithFeedbackHints,
  numericWithHints,
  textInputWithHints,
  sigleSelectWithHints,
} from './mockData/problemTestData';

describe("Check Markdown Parser", () => {
  test("Test Multiselect with hints and feedback", () => {
    let markdown = new ReactStateParser(checklistWithFeebackHints.state).getMarkdown();
    expect(markdown).toBe(checklistWithFeebackHints.metadata.markdown);
  });
  test("Test Dropdown with hints and feedback", () => {
    let markdown = new ReactStateParser(dropdownWithFeedbackHints.state).getMarkdown();
    expect(markdown).toBe(dropdownWithFeedbackHints.metadata.markdown);
  });
  test("Test Numeric with multiple correct and hints", () => {
    let markdown = new ReactStateParser(numericWithHints.state).getMarkdown();
    expect(markdown).toBe(numericWithHints.metadata.markdown);
  });
  test("Test Text with multiple correct and hints", () => {
    let markdown = new ReactStateParser(textInputWithHints.state).getMarkdown();
    // console.log(markdown);
    expect(markdown).toBe(textInputWithHints.metadata.markdown);
  });
  test("Test single select with hints", () => {
    let markdown = new ReactStateParser(sigleSelectWithHints.state).getMarkdown();
    expect(markdown).toBe(sigleSelectWithHints.metadata.markdown);
  });
})

describe("Test State to Settings Parser", () => {
  test("Test settings parsed from react state", () => {
    const settings = new ReactStateParser(checklistWithFeebackHints.state).getSettings();
    const { markdown, ...settingsPayload } = checklistWithFeebackHints.metadata
    expect(settings).toStrictEqual(settingsPayload);
  });
})

describe("Test State to Metadata Parser", () => {
  test("Test settings parsed from react state", () => {
    let metadata = new ReactStateParser(checklistWithFeebackHints.state).getMetadata();
    expect(metadata).toStrictEqual(checklistWithFeebackHints.metadata);
  });
});
