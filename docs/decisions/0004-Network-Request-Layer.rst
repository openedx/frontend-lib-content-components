Network Requests Layer

Synopsis
--------

For V2 Content Editors, we have defined a general abstraction for basic editor actions and content retrieval. This "Requests Layer" utilizes React Thunk middleware to track the status of ALL network requests in that Redux needs to track in the App.

Decision
------

The lifecycle of the acquisition of data from network and the updating of the global state with that data is termed to be a "request." The "states" of the lifecycle associated with a request are [inactive, pending, completed, failed], as defined in `src/editors/data/constants/requests`. This lifecycle provides information to the Redux consumer as to the status of their data.

Each unique request is given a key in `src/editors/data/constants/requests`. This key can be queried to ascertain the status of the request using a Redux selector by a consumer of the redux state. This allows for easy conditional rendering. By following this pattern, additional  async actions will be easy to write. 

The individual api methods are all defined in `data/services/cms/api`. The goal of the `requests` thunkActions is to first route the appropriate store data to the api request based on how they are being called.

The actual chain the an example request to save an xblock code is:

`thunkActions/app:saveBlock` -> `thunkActions/requests:saveBlock` `services/cms/api:saveBlock`

* The "app" thunk action updates the local block content, and then dispatches the request thunkAction
* The "request" thunkAction then loads relevant redux data for the save event and calls the api.saveBlock method, wrapped such that the UI can track the request state
* The "api" method provides the specifics for the actual network request, including prop format and url."

Status
------

Proposed

Context
-------

In building React Redux applications, asynchronous actions require a set of "Thunk" actions dispatched at relevant points. A common standard around the lifecycle helps prevent the boilerplate for these actions to spiral.

Consequences
------------

Network-based CRUD actions have a common language of lifecycle, as well as a common pattern to implement, allowing developers to use ready-made requests without issue for common actions, like xblock saving, content store retrieval, and even outside api access.