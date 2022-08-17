import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as module from './index';


import './index.scss';

import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { html } from "@codemirror/lang-html";

export const hooks = {

    createCodeMirrorDomNode: ({ref, initialText,upstreamRef}) =>{
        useEffect(() => {
            const state = EditorState.create({
                doc: initialText,
                extensions: [basicSetup, html()]
            });
            const view = new EditorView({ state, parent: ref.current });
            console.log(upstreamRef);
            upstreamRef.current = view;
            console.log(upstreamRef);
            return () => {
                // called on cleanup
                view.destroy();
            };
        },[]);
    }
}

export const RawEditor = ({
    innerRef, value
})=>{

    const DOMref = useRef();
    module.hooks.createCodeMirrorDomNode({ref: DOMref, initialText: value, upstreamRef: innerRef});

    return (
        <div>
            <div id="editor" ref={DOMref}></div>
        </div>
    )
};
export default RawEditor