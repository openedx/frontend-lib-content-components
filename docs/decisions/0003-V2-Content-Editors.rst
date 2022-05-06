V2 Content Editors

Synopsis
--------

We have created a framework for creating improved editor experiences for existing xblocks. We call these new editors V2 Content Editors. V2 Content Editors, in keeping with the spirit of xblocks, provides tools for general content editing functionality, while also allowing those who create the editor to do so as they see fit. They, however, allow for an improved React-based experience.

Decision
------

I. All V2 content editors shall live in frontend-lib-content-components/src/editors/containers/<Editor>
II. These editors will be provided as input to the experience for a particular xblock: 
        - The block's data and metadata stored at the particular id which has been determined to be of the type which requires this editor.
        - a callback function to return to the learning context when editing is completed.
        - any information related to an error in retrieving the xblock data. 
III. The library also provides the following tools:
        - An abstraction for a state solution for the context for that editor.
        - An interface for making network requests, and handling the states of those requests. This is the /Requests layer in the redux store. This will be contained in ADR 0004 Network Request Layer
            * these may include network requests to outside apis, the content store for a course, or other sources.
        - An exposed EditorContainer component provides a header and footer to edit xblock titles, save the current state of the editor to the xblock api in the cms, and return to the learning context on "cancel."

IV. How to create, configure, and enable a new editor experience will exist in other documentation, but should be made as simple as possible.

V. The experience of editing will look like this under the hood in the example of a “course” learning context.

    For entering an editor page:

    .. image:: https://user-images.githubusercontent.com/49422820/166940630-51dfc25e-c760-4118-b4dd-ae1fa7fa73b9.png

    For saving content:

    .. image:: https://user-images.githubusercontent.com/49422820/166940624-068e8446-0c86-4c24-a2dd-3eb474984f08.png

    For exiting without saving:

    .. image:: https://user-images.githubusercontent.com/49422820/166940617-80455ade-0a5e-4e61-94b0-b9e2d7a0531e.png


Status
------

Proposed

Context
-------

We need self-contained xblock editing and configuration experiences. Changing requirements require that that experience be modernized to use Paragon, work across authoring for different learning contexts (course authoring and library authoring), and be flexible, extensible and repeatable.

Carving experiences out of studio is an architectural imperative. Editing, as xblocks are discrete pieces of content, can exist in a context independent of the learning context, so having an MFE.

Consequences
------------

A. We have added a new experience while simultaneously adding fuel to the fire to better "Reactify" xblocks.

B. Future work will be required to move this experience to the course authoring context inside an modal in the mfe when studio is deprecated, instead of a standalone page.

C. For the time being, the abstraction that ALL of an xblock’s behavior and code comes from a singular code source is broken.

D. There is no way best pull in editors from other non-openedx repos without forking. That needs to be solved.

