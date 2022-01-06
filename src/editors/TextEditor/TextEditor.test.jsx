import React from "react";
import TextEditor from "./TextEditor";
import { render, screen } from "@testing-library/react";
import { EditorPageContext } from "../EditorPageProvider";

describe("EditorHeader", () => {
    describe("Loading State", () => {
        const context = {
            blockValue:null,
            blockError:null,
            blockLoading:true,
            editorRef: null,
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <TextEditor/>
              </EditorPageContext.Provider>
            );
        });
        it('Renders a spinner', () => {
            expect(screen.getbyText("Loading")).toBeTruthy();
        });
    });
    describe("Loaded State-- No Error", () => {
        const htmltext = '<p>Im baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps.</p>';
        const context = {
            blockValue: text,
            blockError:null,
            blockLoading:false,
            editorRef: React.useRef(null),
        };
        beforeEach(() => {
            render(
              <EditorPageContext.Provider value={context}>
                <TextEditor/>
              </EditorPageContext.Provider>
            );
        });
        it('Renders an Editor', () => {
            expect(screen.getbyRole("application")).toBeTruthy();
        });
        it('Can extract content from the editor with default content', () => {
            expect(context.editorRef.current.getContent()=== htmltext).toBeTruthy();
        });
    });
    describe("Loaded State-- Error",()=>{
        const error = { message: 'There was an error loading content'}
        const context = {
            blockValue: "",
            blockError: error,
            blockLoading:false,
            editorRef: null,
        };
        it('Renders an Editor and a toast', () => {
            expect(screen.findbyRole("alert")).toBeTruthy();
            expect(screen.getbyRole("application")).toBeTruthy();
        });
    });
});