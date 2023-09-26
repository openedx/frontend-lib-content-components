tinymce.PluginManager.add("embediframe", function (editor) {
  const openInsertIframeModal = () => {
    editor.windowManager.open({
      title: "Insert iframe",
      body: {
        type: "panel",
        items: [
          {
            type: "input",
            name: "source",
            label: "Source URL",
            required: true,
          },
          {
            type: "input",
            name: "width",
            label: "Width",
            required: true,
          },
          {
            type: "input",
            name: "height",
            label: "Height",
            pattern: "^[0-9]+$",
            required: true,
          },
        ],
      },
      buttons: [
        {
          type: "cancel",
          name: "cancel",
          text: "Cancel",
        },
        {
          type: "submit",
          name: "save",
          text: "Save",
          primary: true,
        },
      ],
      onSubmit: function (api) {
        // Handle the form submission (Save button)
        const data = api.getData(); // Get the input values
        if (data.source) {
          const width = /^\d+$/.test(data.width) ? data.width : "300";
          const height = /^\d+$/.test(data.height) ? data.height : "300";

          const iframeCode =
            `<div class="resizable-iframe" style="width: ${width}px; height: ${height}px;">` +
            `<iframe src="${data.source}" width="100%" height="100%"></iframe>` +
            "</div>";
          editor.insertContent(iframeCode);
        }

        api.close();
      },
    });
  };

  editor.ui.registry.addButton("embediframe", {
    text: "Embed iframe",
    onAction: openInsertIframeModal,
  });
});
