import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; //pdfMake virtual filesystem for use fonts

const uciLogoBase64 = `data:image/png;base64,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`;
const uciLogoUrl = "https://www.uci.cu/sites/default/files/favicon_0_0.png";
const uciLogoSvg = `<svg
   version="1.1"
   id="Layer_1"
   x="0px"
   y="0px"
   viewBox="0 0 163 63"
   enable-background="new 0 0 163 63"
   xml:space="preserve"
   sodipodi:docname="logo_01.svg"
   inkscape:version="1.1.2 (0a00cf5339, 2022-02-04)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs101" /><sodipodi:namedview
   id="namedview99"
   pagecolor="#ffffff"
   bordercolor="#666666"
   borderopacity="1.0"
   inkscape:pageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   showgrid="false"
   inkscape:zoom="9.9570552"
   inkscape:cx="55.63894"
   inkscape:cy="31.535428"
   inkscape:window-width="1920"
   inkscape:window-height="1058"
   inkscape:window-x="0"
   inkscape:window-y="39"
   inkscape:window-maximized="1"
   inkscape:current-layer="Layer_1" />
<g
   id="g96"
   style="fill="#338"
   inkscape:export-filename="/home/carlosepc/Documents/Universidad_UCI/UCI/logo-uci-indigo.png"
   inkscape:export-xdpi="305.16299"
   inkscape:export-ydpi="305.16299">
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M98,38.7c2,0,3.1-1.2,3.1-3.5v-4.5h-1.3v4.6c0,2-1,2.4-1.8,2.4   c-0.7,0-1.8-0.3-1.8-2.4v-4.6H95v4.5C95,37.6,96,38.7,98,38.7"
   id="path2"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M105.6,33.8c0.8,0,1.2,0.6,1.2,1.6v3.2h1.3v-3.4   c0-2.2-1.5-2.4-2-2.4c-0.9,0-1.5,0.5-1.8,1l0,0.1h-0.2L104,33h-1.1c0,0.4,0,1,0,1.6v4h1.3v-3.3c0-0.2,0-0.4,0.1-0.5   C104.5,34.3,104.9,33.8,105.6,33.8"
   id="path4"
   style="fill="#338" />
	<rect
   x="109.9"
   y="33"
   fill="#338"
   width="1.3"
   height="5.6"
   id="rect6"
   style="fill="#338" />
	<path
   fill="#338"
   d="M110.5,30.5c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7c0.4,0,0.7-0.3,0.7-0.7   C111.2,30.8,110.9,30.5,110.5,30.5"
   id="path8"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M116.5,33l-0.9,2.9c-0.2,0.5-0.3,1-0.4,1.5l0,0.1H115l0-0.1   c-0.1-0.6-0.2-1-0.4-1.5l-0.9-2.9h-1.4l2.1,5.6h1.3l2.2-5.6H116.5z"
   id="path10"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M121.6,37.8c-0.9,0-1.9-0.4-1.9-1.6l0-0.1h3.9c0-0.1,0-0.3,0-0.5   c0-1.3-0.6-2.7-2.4-2.7c-1.9,0-2.8,1.6-2.8,3c0,1.8,1.1,2.8,2.9,2.8c0.9,0,1.5-0.2,1.9-0.3l-0.2-0.8   C122.7,37.7,122.2,37.8,121.6,37.8 M119.7,35.2c0.1-0.6,0.4-1.5,1.5-1.5c0.4,0,0.7,0.1,0.9,0.4c0.4,0.4,0.4,1,0.4,1.2l0,0.1h-2.8   L119.7,35.2z"
   id="path12"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M127.8,34c0.1,0,0.2,0,0.3,0v-1.2c-0.1,0-0.1,0-0.2,0   c-0.5,0-1.2,0.4-1.5,1.2l0,0.1h-0.2l0-1.1H125c0,0.5,0,1,0,1.8v3.9h1.3v-2.9c0-0.2,0-0.3,0.1-0.5C126.5,34.5,127.1,34,127.8,34"
   id="path14"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M132.9,37c0-0.8-0.5-1.3-1.5-1.7c-0.7-0.3-1.1-0.5-1.1-0.9   c0-0.4,0.4-0.7,0.9-0.7c0.5,0,1,0.2,1.2,0.3l0.2-0.8c-0.2-0.1-0.7-0.3-1.4-0.3c-1.2,0-2.1,0.7-2.1,1.7c0,0.7,0.5,1.3,1.5,1.6   c0.7,0.2,1,0.5,1,0.9c0,0.2-0.1,0.8-1,0.8c-0.5,0-1.1-0.2-1.4-0.4l-0.2,0.9c0.4,0.2,1,0.4,1.7,0.4C132,38.7,132.9,38.1,132.9,37"
   id="path16"
   style="fill="#338" />
	<rect
   x="134.3"
   y="33"
   fill="#338"
   width="1.3"
   height="5.6"
   id="rect18"
   style="fill="#338" />
	<path
   fill="#338"
   d="M135,31.9c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7   C134.2,31.6,134.5,31.9,135,31.9"
   id="path20"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M141.1,33.5c-0.3-0.5-0.9-0.7-1.6-0.7c-0.6,0-1.2,0.2-1.7,0.7   c-0.5,0.6-0.8,1.4-0.8,2.3c0,1.7,1,2.9,2.4,2.9c0.8,0,1.5-0.4,1.8-1l0-0.1h0.2l0,0.1l0.1,0.8h1.1c0-0.4,0-1,0-1.5v-6.8h-1.3v3.3   L141.1,33.5L141.1,33.5z M141.3,35.3v0.9c0,0.2,0,0.3-0.1,0.5c-0.2,0.7-0.7,1.1-1.4,1.1c-1,0-1.6-0.8-1.6-1.9c0-1.2,0.6-2,1.6-2   c0.7,0,1.2,0.5,1.4,1.1C141.3,35,141.3,35.2,141.3,35.3"
   id="path22"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M147.4,37.9h0.2l0.1,0.6h1.1c-0.1-0.4-0.1-0.9-0.1-1.3v-2.1   c0-1.1-0.4-2.4-2.3-2.4c-1,0-1.7,0.3-2,0.5l0.2,0.8c0.4-0.2,1-0.4,1.5-0.4c1.2,0,1.3,0.8,1.3,1.1V35l-0.2,0c-2.1,0-3.3,0.7-3.3,2.1   c0,0.8,0.6,1.6,1.7,1.6C146.4,38.7,147,38.5,147.4,37.9L147.4,37.9z M146.2,37.9c-0.6,0-0.9-0.4-0.9-0.9c0-0.5,0.3-1.2,2-1.2   c0,0,0.1,0,0.1,0l0.1,0v0.9c0,0.1,0,0.2-0.1,0.4C147.3,37.4,146.8,37.9,146.2,37.9"
   id="path24"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M154.3,37.7h0.2l0,0.1l0.1,0.8h1.1c0-0.4,0-1,0-1.5v-6.8h-1.3v3.3   h-0.2l-0.1,0c-0.3-0.5-0.9-0.7-1.6-0.7c-0.6,0-1.2,0.2-1.7,0.7c-0.5,0.6-0.8,1.4-0.8,2.3c0,1.7,1,2.9,2.4,2.9   C153.3,38.7,154,38.4,154.3,37.7L154.3,37.7z M153,37.7c-1,0-1.6-0.8-1.6-1.9c0-1.2,0.6-2,1.6-2c0.7,0,1.2,0.5,1.4,1.1   c0,0.1,0,0.3,0,0.4v0.9c0,0.2,0,0.3-0.1,0.5C154.2,37.3,153.6,37.7,153,37.7"
   id="path26"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M98.4,49.6h0.2l0,0.1l0,0.7h1c0-0.4,0-0.9,0-1.4v-6.2h-1.1v3h-0.2   l-0.1,0c-0.2-0.4-0.8-0.7-1.4-0.7c-0.6,0-1.1,0.2-1.5,0.6c-0.5,0.5-0.8,1.3-0.8,2.1c0,1.5,0.9,2.6,2.2,2.6   C97.5,50.6,98.1,50.2,98.4,49.6L98.4,49.6z M97.2,49.7c-0.9,0-1.4-0.7-1.4-1.8c0-1.1,0.6-1.9,1.4-1.9c0.6,0,1.1,0.4,1.3,1   c0,0.1,0,0.3,0,0.4v0.8c0,0.2,0,0.3,0,0.4C98.3,49.3,97.8,49.7,97.2,49.7"
   id="path28"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M105.6,47.7c0-1.2-0.6-2.5-2.2-2.5c-1.7,0-2.5,1.4-2.5,2.8   c0,1.6,1,2.6,2.6,2.6c0.8,0,1.4-0.2,1.7-0.3l-0.2-0.7c-0.4,0.1-0.9,0.2-1.4,0.2c-0.8,0-1.7-0.4-1.7-1.5l0-0.1h3.6   C105.6,48.1,105.6,47.9,105.6,47.7 M104.6,47.4H102l0-0.1c0.1-0.7,0.5-1.4,1.3-1.4c0.3,0,0.6,0.1,0.8,0.3   C104.6,46.6,104.6,47.2,104.6,47.4L104.6,47.4z"
   id="path30"
   style="fill="#338" />
	<rect
   x="109.2"
   y="42.9"
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   width="1.2"
   height="7.6"
   id="rect32"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M113.2,50.6c0.6,0,1.2-0.2,1.5-0.7l0,0h0.2l0.1,0.6h1   c0-0.4-0.1-0.8-0.1-1.2v-1.9c0-1-0.4-2.1-2.1-2.1c-0.9,0-1.6,0.3-1.8,0.4l0.2,0.7c0.4-0.2,0.9-0.3,1.4-0.3c1.1,0,1.2,0.7,1.2,1v0.2   l-0.2,0c-1.9,0-3,0.7-3,1.9C111.6,49.8,112.2,50.6,113.2,50.6 M114.6,47.8c0,0,0.1,0,0.1,0l0.1,0v0.8c0,0.1,0,0.2,0,0.3   c-0.1,0.4-0.5,0.8-1.1,0.8c-0.5,0-0.9-0.3-0.9-0.9C112.8,48.4,113.1,47.8,114.6,47.8"
   id="path34"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M120.8,49c0-0.7-0.4-1.2-1.4-1.5c-0.7-0.2-1-0.4-1-0.8   c0-0.4,0.3-0.7,0.8-0.7c0.5,0,0.9,0.2,1.1,0.3l0.2-0.8c-0.3-0.1-0.8-0.3-1.3-0.3c-1.1,0-1.9,0.6-1.9,1.6c0,0.6,0.5,1.1,1.4,1.5   c0.6,0.2,0.9,0.4,0.9,0.9c0,0.2-0.1,0.7-1,0.7c-0.4,0-1-0.2-1.3-0.3l-0.2,0.8c0.4,0.2,0.9,0.3,1.5,0.3C120,50.6,120.8,50,120.8,49"
   id="path36"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M127.9,49.6c-1.6,0-2.7-1.1-2.7-2.8c0-1.7,1-2.8,2.7-2.8   c0.5,0,1,0.1,1.4,0.2l0.2-0.9c-0.3-0.1-0.9-0.3-1.7-0.3c-2.3,0-3.8,1.5-3.8,3.8c0,2.2,1.4,3.6,3.7,3.6c0.8,0,1.5-0.1,1.8-0.3   l-0.2-0.9C129,49.6,128.4,49.6,127.9,49.6"
   id="path38"
   style="fill="#338" />
	<rect
   x="130.8"
   y="45.3"
   fill="#338"
   width="1.2"
   height="5.1"
   id="rect40"
   style="fill="#338" />
	<path
   fill="#338"
   d="M131.3,44.3c0.4,0,0.7-0.3,0.7-0.6c0-0.4-0.3-0.6-0.7-0.6c-0.4,0-0.7,0.3-0.7,0.6   C130.7,44.1,131,44.3,131.3,44.3"
   id="path42"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M135.9,50.6c0.8,0,1.4-0.2,1.7-0.3l-0.2-0.7   c-0.4,0.1-0.9,0.2-1.4,0.2c-0.8,0-1.7-0.4-1.7-1.5l0-0.1h3.6c0-0.1,0-0.3,0-0.5c0-1.2-0.6-2.5-2.2-2.5c-1.7,0-2.5,1.4-2.5,2.8   C133.2,49.6,134.3,50.6,135.9,50.6 M134.3,47.3c0.1-0.5,0.4-1.4,1.3-1.4c0.3,0,0.6,0.1,0.8,0.3c0.4,0.4,0.4,0.9,0.4,1.1l0,0.1h-2.6   L134.3,47.3z"
   id="path44"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M141.6,46.1c0.7,0,1.1,0.5,1.1,1.4v2.9h1.1v-3.1   c0-2-1.4-2.2-1.8-2.2c-0.8,0-1.4,0.5-1.6,0.9l0,0.1h-0.2l-0.1-0.8h-1c0,0.4,0,0.9,0,1.5v3.6h1.2v-3c0-0.2,0-0.4,0.1-0.5   C140.6,46.6,141,46.1,141.6,46.1"
   id="path46"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M147.8,50.6c0.6,0,1.1-0.1,1.4-0.2l-0.1-0.8   c-0.2,0.1-0.5,0.2-1,0.2c-1,0-1.7-0.7-1.7-1.8c0-0.5,0.2-1,0.5-1.3c0.3-0.3,0.7-0.5,1.2-0.5c0.4,0,0.7,0.1,0.9,0.2l0.2-0.8   c-0.3-0.1-0.8-0.2-1.2-0.2c-1.7,0-2.9,1.1-2.9,2.7C145.1,49.5,146.2,50.6,147.8,50.6"
   id="path48"
   style="fill="#338" />
	<rect
   x="150.4"
   y="45.3"
   fill="#338"
   width="1.2"
   height="5.1"
   id="rect50"
   style="fill="#338" />
	<path
   fill="#338"
   d="M151,44.3c0.4,0,0.7-0.3,0.7-0.6c0-0.4-0.3-0.6-0.7-0.6c-0.4,0-0.7,0.3-0.7,0.6   C150.3,44.1,150.6,44.3,151,44.3"
   id="path52"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M154.4,50.6c0.6,0,1.2-0.2,1.5-0.7l0,0h0.2l0.1,0.6h1   c0-0.4-0.1-0.8-0.1-1.2v-1.9c0-1-0.4-2.1-2.1-2.1c-0.9,0-1.6,0.3-1.8,0.4l0.2,0.7c0.4-0.2,0.9-0.3,1.4-0.3c1.1,0,1.2,0.7,1.2,1v0.2   l-0.2,0c-1.9,0-3,0.7-3,1.9C152.8,49.8,153.4,50.6,154.4,50.6 M155.8,47.8c0,0,0.1,0,0.1,0l0.1,0v0.8c0,0.1,0,0.2,0,0.3   c-0.1,0.4-0.5,0.8-1.1,0.8c-0.5,0-0.9-0.3-0.9-0.9C153.9,48.4,154.3,47.8,155.8,47.8"
   id="path54"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M162,49c0-0.7-0.4-1.2-1.4-1.5c-0.7-0.2-1-0.4-1-0.8   c0-0.4,0.3-0.7,0.8-0.7c0.5,0,0.9,0.2,1.1,0.3l0.2-0.8c-0.3-0.1-0.8-0.3-1.3-0.3c-1.1,0-1.9,0.6-1.9,1.6c0,0.6,0.5,1.1,1.4,1.5   c0.6,0.2,0.9,0.4,0.9,0.9c0,0.2-0.1,0.7-1,0.7c-0.4,0-1-0.2-1.3-0.3l-0.2,0.8c0.4,0.2,0.9,0.3,1.5,0.3C161.2,50.6,162,50,162,49"
   id="path56"
   style="fill="#338" />
	<rect
   x="95.1"
   y="54.5"
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   width="1.3"
   height="7.8"
   id="rect58"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M100.8,57.6c0.8,0,1.2,0.6,1.2,1.6v3.2h1.3V59   c0-2.2-1.5-2.4-1.9-2.4c-0.9,0-1.5,0.5-1.7,0.9l0,0.1h-0.2l-0.1-0.9h-1.1c0,0.4,0,0.9,0,1.6v4h1.3V59c0-0.2,0-0.4,0.1-0.5   C99.7,58.1,100.1,57.6,100.8,57.6"
   id="path60"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M108,55l0.1-0.9c-0.2-0.1-0.5-0.1-0.8-0.1c-0.6,0-1.1,0.2-1.4,0.5   c-0.4,0.4-0.7,1.1-0.7,1.9v0.3h-0.8v0.9h0.8v4.7h1.3v-4.7h1.3v-0.9h-1.3v-0.4c0-0.9,0.4-1.4,1.1-1.4C107.6,54.9,107.8,54.9,108,55"
   id="path62"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M111.1,56.6c-1.8,0-2.9,1.2-2.9,3c0,1.7,1.1,2.9,2.8,2.9   c1.4,0,2.9-0.9,2.9-3C113.9,57.7,112.8,56.6,111.1,56.6 M111.1,61.6c-0.9,0-1.5-0.8-1.5-2.1c0-0.9,0.4-2.1,1.5-2.1c1,0,1.5,1,1.5,2   C112.6,60.7,112,61.6,111.1,61.6"
   id="path64"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M118,57.8c0.1,0,0.2,0,0.3,0v-1.2c-0.1,0-0.1,0-0.2,0   c-0.5,0-1.2,0.4-1.5,1.2l0,0.1h-0.2l0-1.1h-1.1c0,0.5,0,1,0,1.8v3.8h1.3v-2.9c0-0.2,0-0.3,0-0.5C116.7,58.2,117.3,57.8,118,57.8"
   id="path66"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M125.5,57.6c0.7,0,1.1,0.6,1.1,1.6v3.1h1.2V59   c0-2.2-1.4-2.4-1.8-2.4c-0.4,0-0.8,0.1-1.1,0.3c-0.3,0.2-0.5,0.4-0.7,0.7l0,0h-0.1l0-0.1c-0.2-0.6-0.8-1-1.5-1   c-0.7,0-1.3,0.3-1.7,0.9l0,0h-0.2l-0.1-0.9h-1.1c0,0.4,0,0.9,0,1.6v4h1.2V59c0-0.2,0-0.4,0.1-0.5c0.1-0.4,0.5-0.9,1.1-0.9   c0.7,0,1.1,0.6,1.1,1.5v3.2h1.2v-3.4c0-0.1,0-0.3,0.1-0.5C124.5,57.9,125,57.6,125.5,57.6"
   id="path68"
   style="fill="#338" />
	<path
   fill="#338"
   d="M132.5,61.7h0.2l0.1,0.6h1.1c-0.1-0.4-0.1-0.9-0.1-1.3v-2.1c0-1.1-0.4-2.3-2.3-2.3c-1,0-1.7,0.3-2,0.5   l0.2,0.7c0.4-0.2,1-0.4,1.5-0.4c1.2,0,1.3,0.8,1.3,1.1v0.2l-0.2,0c-2.1,0-3.3,0.7-3.3,2.1c0,0.8,0.6,1.6,1.7,1.6   C131.5,62.4,132.1,62.2,132.5,61.7L132.5,61.7z M131.3,61.6c-0.6,0-0.9-0.4-0.9-0.9c0-0.5,0.3-1.2,2-1.2c0,0,0.1,0,0.1,0l0.1,0v0.9   c0,0.1,0,0.2,0,0.4C132.4,61.1,132,61.6,131.3,61.6"
   id="path70"
   style="fill="#338" />
	<polygon
   fill="#338"
   points="131.9,55.8 133.2,54.2 132,54.2 131.1,55.8  "
   id="polygon72"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M136.2,62c0.3,0.3,0.7,0.4,1.2,0.4c0.4,0,0.7,0,1-0.1l0-0.9   c-0.2,0-0.3,0-0.5,0c-0.8,0-0.8-0.6-0.8-1.2v-2.7h1.4v-0.9H137v-1.6l-1.2,0.3v1.3h-0.8v0.9h0.8v2.8C135.8,61.2,135.9,61.7,136.2,62   "
   id="path74"
   style="fill="#338" />
	<rect
   x="139.7"
   y="56.7"
   fill="#338"
   width="1.3"
   height="5.6"
   id="rect76"
   style="fill="#338" />
	<path
   fill="#338"
   d="M140.3,55.7c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7   C139.6,55.4,139.9,55.7,140.3,55.7"
   id="path78"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M145.4,56.6c-1.9,0-3.1,1.2-3.1,3c0,1.7,1.1,2.8,2.9,2.8   c0.7,0,1.2-0.1,1.5-0.3l-0.2-0.9c-0.3,0.1-0.6,0.2-1.1,0.2c-1.1,0-1.9-0.8-1.9-2c0-0.6,0.2-1.1,0.5-1.5c0.3-0.3,0.8-0.5,1.3-0.5   c0.5,0,0.8,0.1,1,0.2l0.2-0.9C146.4,56.7,145.9,56.6,145.4,56.6"
   id="path80"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M149.3,62.4c0.7,0,1.3-0.3,1.6-0.7l0,0h0.2l0.1,0.6h1.1   c-0.1-0.4-0.1-0.9-0.1-1.3v-2.1c0-1.1-0.4-2.3-2.3-2.3c-1,0-1.7,0.3-2,0.5l0.2,0.7c0.4-0.2,1-0.4,1.5-0.4c1.2,0,1.3,0.8,1.3,1.1   v0.2l-0.2,0c-2.1,0-3.3,0.7-3.3,2.1C147.6,61.6,148.2,62.4,149.3,62.4 M150.8,59.5c0,0,0.1,0,0.1,0l0.1,0v0.9c0,0.1,0,0.2-0.1,0.4   c-0.1,0.4-0.6,0.9-1.2,0.9c-0.6,0-0.9-0.4-0.9-0.9C148.9,60.1,149.2,59.5,150.8,59.5"
   id="path82"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M157.6,60.7c0-0.8-0.5-1.3-1.5-1.7c-0.7-0.3-1.1-0.5-1.1-0.9   c0-0.4,0.4-0.7,0.9-0.7c0.5,0,0.9,0.2,1.2,0.3l0.2-0.8c-0.2-0.1-0.7-0.3-1.4-0.3c-1.2,0-2.1,0.7-2.1,1.7c0,0.7,0.5,1.2,1.5,1.6   c0.7,0.2,1,0.4,1,0.9c0,0.2-0.1,0.7-1,0.7c-0.5,0-1.1-0.2-1.4-0.4l-0.2,0.9c0.4,0.2,1,0.4,1.6,0.4   C156.7,62.4,157.6,61.8,157.6,60.7"
   id="path84"
   style="fill="#338" />
	<rect
   x="75.7"
   y="40.9"
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   width="8"
   height="21.5"
   id="rect86"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M44.8,39.8c-0.8,2-1.2,4.3-1.2,6.8c0,2.4,0.4,4.6,1.2,6.6   c0.8,2,1.9,3.7,3.4,5.1c1.5,1.4,3.3,2.4,5.4,3.1c2.1,0.7,4.5,1.1,7.1,1.1h8.3v-6.5h-7.1c-1.5,0-2.8-0.2-4-0.7   c-1.2-0.4-2.3-1.1-3.1-2c-0.9-0.9-1.5-1.9-2-3.1C52.2,48.9,52,47.5,52,46c0-1.5,0.2-2.8,0.6-4c0.4-1.2,1.1-2.3,1.9-3.1   c0.8-0.9,1.9-1.5,3.1-2c1.2-0.5,2.5-0.7,3.9-0.7h7.3v-6.4h-7.7c-2.6,0-5,0.4-7.2,1.2c-2.2,0.8-4.1,2-5.7,3.5   C46.8,35.9,45.6,37.7,44.8,39.8"
   id="path88"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M35.1,58.8c1.1-1.2,2-2.8,2.6-4.6c0.6-1.8,0.9-4,0.9-6.4V30.3h-8   v18c0,1.3-0.1,2.5-0.3,3.4c-0.2,1-0.6,1.8-1,2.5c-0.5,0.7-1,1.2-1.7,1.5c-0.7,0.3-1.5,0.5-2.4,0.5c-0.9,0-1.7-0.2-2.3-0.5   c-0.7-0.3-1.3-0.9-1.7-1.6c-0.4-0.7-0.8-1.5-1-2.5c-0.2-1-0.3-2.1-0.3-3.4v-18h-8v17.3c0,2.5,0.3,4.8,0.9,6.6   c0.6,1.8,1.4,3.4,2.5,4.6c1.1,1.2,2.5,2.1,4.1,2.7c1.6,0.6,3.5,0.9,5.7,0.9c2.2,0,4.2-0.3,5.9-0.9C32.5,60.9,33.9,60,35.1,58.8"
   id="path90"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M81.7,31.7h-4.1v4.1h4.1V31.7z M83.7,37.8h-8.1v-8.1h8.1V37.8z    M83,37.1h-6.6v-6.6H83V37.1z"
   id="path92"
   style="fill="#338" />
	<path
   fill-rule="evenodd"
   clip-rule="evenodd"
   fill="#338"
   d="M90.1,17.4c0.1-1.3,0.1-2.6-0.1-3.8c-0.2-1.2-0.6-2.3-1.1-3.4   L88.7,10c-1.3-2.8-3.8-5.1-7.3-6.7c-3.5-1.6-8-2.6-13.2-2.7c-0.6,0-1.3,0-1.9,0c-4.7,0-9.8,0.6-15.2,1.7C45.1,3.5,39,5.5,33,8.1   c-0.4,0.2-0.9,0.4-1.3,0.6c-0.4,0.2-0.9,0.4-1.3,0.6c-3.4,1.6-6.8,3.4-10,5.4c-3.2,2-6.2,4.1-9.1,6.4c-2.8,2.3-5.4,4.7-7.7,7.1   c-0.9,1-1.8,2-2.6,3c0.7-0.7,1.3-1.4,2-2.1C5.2,27,7.6,25,10.2,23c2.6-2,5.5-3.9,8.6-5.7c3-1.8,6.3-3.6,9.7-5.2   c6.4-2.9,12.9-5.2,19.2-6.7c5.9-1.4,11.6-2.1,16.7-2.1c0.3,0,0.7,0,1,0c5.5,0.1,10.1,1,13.8,2.8c3.7,1.7,6.4,4.2,7.9,7.3   c0.4,0.9,0.7,1.9,0.9,2.9c0.2,0.9,0.3,1.9,0.4,2.9c0,1,0,2-0.1,3c-0.1,0.6-0.2,1.2-0.3,1.8c0.4-0.8,0.8-1.7,1.1-2.6   C89.7,20,90,18.7,90.1,17.4"
   id="path94"
   style="fill="#338" />
</g>
</svg>
`;
const defaultsForDocDef = {
  info: {
    creator:
      "Sistema de Gestión para el Proceso de Comisión Disciplinaria de la Facultad 4 (CDIS)",
  },
  //userPassword: "f4",
  //ownerPassword: "owner",
  // a string or { width: number, height: number }
  pageSize: "A4",
  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [40, 100, 40, 80],
  header: {
    columns: [
      { image: uciLogoBase64, width: 120 },
      {
        text: "FACULTAD 4",
        alignment: "right",
        margin: [0, 24, 0, 0],
        style: "textUci",
      },
    ],
    margin: [100, 30, 100, 0],
  },
  defaultStyle: {
    fontSize: 12,
    alignment: "justify",
    lineHeight: 1.5,
  },
  footer: {
    alignment: "right",
    margin: [0, 0, 80, 0],
    stack: [
      { text: "Universidad de las Ciencias Informáticas", style: "textUci" },
      "Carretera San Antonio Km 2 ½ Torrens. Boyeros.",
      "La Habana. Cuba.",
      "Teléfono: +53 7 8358181.",
    ],
    fontSize: 8,
  },
  styles: {
    header: {
      fontSize: 12,
      bold: true,
    },
    subheader: {
      fontSize: 15,
      bold: true,
    },
    strong: {
      bold: true,
    },
    textUci: {
      color: "#228",
    },
  },
};
function generatePdf(docDef = {}) {
  pdfMake.createPdf({ ...defaultsForDocDef, ...docDef }).open();
}
export default generatePdf;
