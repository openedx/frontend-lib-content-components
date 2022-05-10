# frontend-lib-content-components
A library of high-level components for content handling (viewing, editing, etc. of HTML, video, problems, etc.), to be shared by multiple MFEs.

# How to develop this package
There are to distinct way to observe your changes. One can either either require your MFE to pull in its javascript from a local version of this package, or simply run the gallery view.

# Using your prexisting MFE and moduleconfig.js 
follow the below guide:
 https://github.com/openedx/frontend-build#local-module-configuration-for-webpack

# Using the gallery view.
The gallery view runs the editor components with mocked out block data, and sometimes does not replicate all desired behaviors, but can be used for faster iteration on UI related changes. To run the gallery view, from the root directory, run

$ cd www
$ npm start

and now the gallery will be live at http://localhost:8080/index.html. use the toggle at the top to switch between availible editors.

# Creating Your own editor
If you wish to make your own editor, to being coding the editor, simply run the command 

$ npm run-script addXblock <name of xblock>

from the frontend-lib-content-components source directory. It will create an editor you can then veiw at src/editors/containers. It will also configure the editor to be viewable in the gallery view. Adding the editor to be used in studio will require the following steps: 

