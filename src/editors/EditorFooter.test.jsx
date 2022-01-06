import React from "react";
import EditorFooter from "./EditorFooter";
import { render, screen } from "@testing-library/react";
import { EditorPageContext } from "./EditorPageProvider";
import userEvent from "@testing-library/user-event";

describe("EditorHeader", () => {
    describe("Rendering", () => {
        const context = {
            unitUrlLoading: false,
            editorRef:null,
            blockloading:false,
            setBlockContent: null,
            saveUnderway: false,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorFooter/>
              </EditorPageContext.Provider>
            );
        });
        it('Renders the buttons', () => {
            expect(screen.getbyText("Cancel")).toBeTruthy();
            expect(screen.getbyText("Add To Course")).toBeTruthy();
        });

    });
    describe("Rendering- loading url", () => {
        const context = {
            unitUrlLoading: true,
            editorRef:null,
            blockloading:true,
            setBlockContent: null,
            saveUnderway: false,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <EditorFooter/>
              </EditorPageContext.Provider>
            );
        });
        it('Renders the buttons', () => {
            expect(screen.getbyText("Cancel")).toBeTruthy();
            expect(screen.getbyText("Add To Course")).toBeFalse();
            expect(screen.getByText("Loading")).toBeTruthy();
        });
    });
});