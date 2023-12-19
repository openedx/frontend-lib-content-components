/* eslint-disable */
const mockPromise = (returnValue) => new Promise(resolve => resolve(returnValue));

export const fetchV1Libraries = ({ studioEndpointUrl }) => {
  return {
    "allow_course_reruns": true,
    "allow_to_create_new_org": true,
    "allow_unicode_course_id": false,
    "allowed_organizations": [],
    "archived_courses": [
      {
        "course_key": "course-v1:edX+P315+2T2023",
        "display_name": "Quantum Entanglement",
        "lms_link": "//localhost:18000/courses/course-v1:edX+P315+2T2023",
        "number": "P315",
        "org": "edX",
        "rerun_link": "/course_rerun/course-v1:edX+P315+2T2023",
        "run": "2T2023",
        "url": "/course/course-v1:edX+P315+2T2023",
      },
    ],
    "can_create_organizations": true,
    "course_creator_status": "granted",
    "courses": [
      {
        "course_key": "course-v1:edX+E2E-101+course",
        "display_name": "E2E Test Course",
        "lms_link": "//localhost:18000/courses/course-v1:edX+E2E-101+course",
        "number": "E2E-101",
        "org": "edX",
        "rerun_link": "/course_rerun/course-v1:edX+E2E-101+course",
        "run": "course",
        "url": "/course/course-v1:edX+E2E-101+course"
      },
    ],
    "in_process_course_actions": [],
    "libraries": [
      {
        "display_name": "My First Library",
        "library_key": "library-v1:new+CPSPR",
        "url": "/library/library-v1:new+CPSPR",
        "org": "new",
        "number": "CPSPR",
        "can_edit": true
      },
      {
        "display_name": "My Second Library",
        "library_key": "library-v1:new+CPSPRsadf",
        "url": "/library/library-v1:new+CPSPRasdf",
        "org": "new",
        "number": "CPSPRasdf",
        "can_edit": true
      },
      {
        "display_name": "My Third Library",
        "library_key": "library-v1:new+CPSPRqwer",
        "url": "/library/library-v1:new+CPSPRqwer",
        "org": "new",
        "number": "CPSPRqwer",
        "can_edit": true
      },
      {
        "display_name": "Really Big Library",
        "library_key": "library-v1:new+CPSPR+big",
        "url": "/library/library-v1:new+CPSPR+big",
        "org": "new",
        "number": "CPSPR+big",
        "can_edit": true
      },
    ],
    "libraries_enabled": true,
    "library_authoring_mfe_url": "//localhost:3001/course/course-v1:edX+P315+2T2023",
    "optimization_enabled": true,
    "redirect_to_library_authoring_mfe": false,
    "request_course_creator_url": "/request_course_creator",
    "rerun_creator_status": true,
    "show_new_library_button": true,
    "split_studio_home": false,
    "studio_name": "Studio",
    "studio_short_name": "Studio",
    "studio_request_email": "",
    "tech_support_email": "technical@example.com",
    "platform_name": "Your Platform Name Here",
    "user_is_active": true,
  };
};

export const fetchV2Libraries = ({ studioEndpointUrl }) => {
  return [
    {
      id: "lib:DeveloperInc:lib1",
      type: "complex",
      org: "DeveloperInc",
      slug: "lib1",
      bundle_uuid: "d0465545-96d2-4fe4-b503-0ed5e3b41517",
      title: "myfirstlib",
      description: "myfirstlib",
      num_blocks: null,
      version: 0,
      last_published: null,
      allow_lti: false,
      allow_public_learning: false,
      allow_public_read: false,
      has_unpublished_changes: null,
      has_unpublished_deletes: null,
      license: "",
    },
    {
      id: "lib:DeveloperInc:lib2",
      type: "complex",
      org: "DeveloperInc",
      slug: "lib2",
      bundle_uuid: "d0465545-96d2-4fe4-b503-0ed5e3b41518",
      title: "mysecondlib",
      description: "mysecondlib",
      num_blocks: null,
      version: 0,
      last_published: null,
      allow_lti: false,
      allow_public_learning: false,
      allow_public_read: false,
      has_unpublished_changes: null,
      has_unpublished_deletes: null,
      license: "",
    },
  ];
};

export const fetchV2LibraryContent = ({ studioEndpointUrl, libraryId }) => {
  if (libraryId === 'library-v1:new+CPSPR') {
    return {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "Text",
          "has_unpublished_changes": true
        },
      ],
    };
  } else if (libraryId === 'library-v1:new+CPSPRsadf') {
    return {
      "count": 3,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "Text",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "Lorem texts",
          "has_unpublished_changes": false
        },
      ],
    };
  } else if (libraryId === 'library-v1:new+CPSPRqwer') {
    return {
      "count": 3,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "Text",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "Lorem texts",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "Blank Problem",
          "has_unpublished_changes": true
        },
      ],
    };
  } else if (libraryId === 'library-v1:new+CPSPR+big') {
    return {
      "count": 20,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "a",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "b",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "c",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "d",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "e",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "f",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "g",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "h",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "i",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "j",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "k",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "l",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "m",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "n",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "o",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "p",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "q",
          "has_unpublished_changes": false
        },
        {
          "id": "lb:edx:test202:problem:86e480e4-e31c-492f-822e-1a8b2501cfde",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:problem:problem/86e480e4-e31c-492f-822e-1a8b2501cfde/definition.xml",
          "block_type": "problem",
          "display_name": "r",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/3eb918b1-6ebd-4172-b1e7-bd7c4eaa51ab/definition.xml",
          "block_type": "html",
          "display_name": "s",
          "has_unpublished_changes": true
        },
        {
          "id": "lb:edx:test202:html:b7c18081-0bec-4de0-8d16-8b255924722e",
          "def_key": "bundle-olx:539d7fcc-615c-4b6e-8b57-34cffc82bbd0:studio_draft:html:html/b7c18081-0bec-4de0-8d16-8b255924722e/definition.xml",
          "block_type": "html",
          "display_name": "t",
          "has_unpublished_changes": false
        },
      ],
    };
  }
};

export const fetchBlockContent = ({ blockId, studioEndpointUrl }) => {
};

export const emptyMock = () => mockPromise({});
