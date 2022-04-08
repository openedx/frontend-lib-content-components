import { StrictDict } from '../../utils';

const listKeyStore = (list) => StrictDict(
  list.reduce((obj, val) => ({ ...obj, [val]: val }), {}),
);

const plugins = listKeyStore([
  'link',
  'codesample',
  'emoticons',
  'table',
  'charmap',
  'code',
  'autoresize',
  'image',
  'imagetools',
]);
const configKeys = listKeyStore([
  'aligncenter',
  'alignjustify',
  'alignleft',
  'alignright',
  'backcolor',
  'bold',
  'bullist',
  'charmap',
  'code',
  'codesample',
  'editimagesettings',
  'emoticons',
  'flipv',
  'fliph',
  'formatselect',
  'hr',
  'imageuploadbutton',
  'indent',
  'italic',
  'link',
  'numlist',
  'outdent',
  'redo',
  'removeformat',
  'rotateleft',
  'rotateright',
  'table',
  'undo',
]);

const mapToolbars = toolbars => toolbars.map(toolbar => toolbar.join(' ')).join(' | ');

export default StrictDict({
  plugins: [
    plugins.link,
    plugins.codesample,
    plugins.emoticons,
    plugins.table,
    plugins.charmap,
    plugins.code,
    plugins.autoresize,
    plugins.image,
    plugins.imagetools,
  ].join(' '),
  menubar: false,
  toolbar: mapToolbars([
    [configKeys.undo, configKeys.redo],
    [configKeys.formatselect],
    [configKeys.bold, configKeys.italic, configKeys.backcolor],
    [
      configKeys.alignleft,
      configKeys.aligncenter,
      configKeys.alignright,
      configKeys.alignjustify,
    ],
    [
      configKeys.bullist,
      configKeys.numlist,
      configKeys.outdent,
      configKeys.indent,
    ],
    [configKeys.imageuploadbutton],
    [configKeys.link],
    [configKeys.emoticons],
    [configKeys.table],
    [configKeys.codesample],
    [configKeys.charmap],
    [configKeys.removeformat],
    [configKeys.hr],
    [configKeys.code],
  ]),
  imageToolbar: mapToolbars([
    [configKeys.editimagesettings],
  ]),
  config: {
    branding: false,
    height: '100%',
    menubar: false,
    min_height: 500,
  },
});
