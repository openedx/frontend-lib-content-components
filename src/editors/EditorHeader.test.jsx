import React from "react";
import EditorHeader from "./EditorHeader";
import { render, screen } from "@testing-library/react";
import { EditorPageContext } from "./EditorPageProvider";
import userEvent from "@testing-library/user-event";

describe("EditorHeader", () => {
    describe("It Renders correctly", () => {
        const title = "An Awesome Block"
        const context = {
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorHeader title={title}/>
              </EditorPageContext.Provider>
            );
        });
        it('Renders the title', () => {
            expect(screen.getbyText(title).toBeTruthy());
        });
        it('Renders the close button', () => {
            expect(screen.getByLabelText("Close").toBeTruthy());
        });
    });
    describe("It handles context correctly when not loaded", () => {
        const title = "An Awesome Block"
        const context = {
            unitUrl: null,
            unitUrlError: null,
            unitUrlLoading: true,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorHeader title={title}/>
              </EditorPageContext.Provider>
            );
            userEvent.click(screen.getByLabelText("Close"));
        });
        it('Nothing Happens on click of close', () => {
           // TODO: FINSIH THESE TESTS
        });
    });
    describe("It handles context correctly when loaded correctly", () => {
        const title = "An Awesome Block"
        const context = {
            unitUrl: 'edx.org',
            unitUrlError: null,
            unitUrlLoading: false,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorHeader title={title}/>
              </EditorPageContext.Provider>
            );
            userEvent.click(screen.getByLabelText("Close"));
        });
        it('Nothing Happens on click of close', () => {
            expect(screen.).toBeTruthy()
        });
    });
    describe("It handles context correctly when loaded with error", () => {
        const title = "An Error Block"
        const context = {
            unitUrl: 'edx.com',
            unitUrlError: {message: "Error: You Didn't go to the right unit",},
            unitUrlLoading: false,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorHeader title={title}/>
              </EditorPageContext.Provider>
            );
            userEvent.click(screen.getByLabelText("Close"));
        });
        it('Nothing Happens on click of close', () => {
            expect(screen.).toBeTruthy()
        });
    });



});