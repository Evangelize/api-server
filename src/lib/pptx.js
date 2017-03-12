import JSZip from 'jszip';
import Color from 'color';
import { fromXML } from 'from-xml';
import shortid from 'shortid';
import Promise from 'bluebird';
import crypto from 'crypto';

export default class PPTX {
  MsgQueue = [];
  themeContent = null;
  chartID = 0;
  titleFontSize = 42;
  bodyFontSize = 20;
  otherFontSize = 16;
  styleTable = {};
  slides = {};
  fonts = [
    "Arial",
    "Courier New",
    "Droid Sans",
    "Droid Sans Mono",
    "Droid Serif",
    "Liberation Sans",
    "Open Sans",
    "Overpass",
    "PT Sans",
    "Raleway",
    "Roboto",
    "Times New Roman",
  ];
  spectacle = {
    presentation: {
      version: '0.1.3',
      slidePreviews: [],
      slides: [],
      paragraphStyles: {
        'Heading 1': {
           'color': '#3d3d3d',
           'fontFamily': 'Open Sans',
           'fontSize': 26,
           'fontStyle': 'normal',
           'lineHeight': 'normal',
           'fontWeight': 400,
           'minWidth': 20,
           'opacity': 1,
           'textAlign': 'center',
           'textDecoration': 'none',
        },
        'Heading 2': {
           'color': '#3d3d3d',
           'fontFamily': 'Open Sans',
           'fontSize': 20,
           'fontStyle': 'normal',
           'lineHeight': 'normal',
           'fontWeight': 400,
           'minWidth': 20,
           'opacity': 1,
           'textAlign': 'center',
           'textDecoration': 'none',
        },
        'Heading 3': {
           'color': '#3d3d3d',
           'fontFamily': 'Open Sans',
           'fontSize': 11,
           'fontStyle': 'normal',
           'lineHeight': 'normal',
           'fontWeight': 700,
           'minWidth': 20,
           'opacity': 1,
           'textAlign': 'center',
           'textDecoration': 'none',
        },
        'Body': {
           'color': '#3d3d3d',
           'fontFamily': 'Open Sans',
           'fontSize': 11,
           'fontStyle': 'normal',
           'lineHeight': 'normal',
           'fontWeight': 400,
           'minWidth': 20,
           'opacity': 1,
           'textAlign': 'center',
           'textDecoration': 'none',
        },
        'Body Small': {
           'color': '#3d3d3d',
           'fontFamily': 'Open Sans',
           'fontSize': 10,
           'fontStyle': 'normal',
           'lineHeight': 'normal',
           'fontWeight': 400,
           'minWidth': 20,
           'opacity': 1,
           'textAlign': 'center',
           'textDecoration': 'none',
        },
        'Caption': {
          'color': '#3d3d3d',
          'fontFamily': 'Open Sans',
          'fontSize': 11,
          'fontStyle': 'italic',
          'lineHeight': 'normal',
          'fontWeight': 400,
          'minWidth': 20,
          'opacity': 1,
          'textAlign': 'center',
          'textDecoration': 'none',
        },
      },
    },
  };

  async parse(data) {
    const dateBefore = new Date();
    const newZip = new JSZip();
    const self = this;
    const zip = await newZip.loadAsync(data);
    //console.log(zip);
    if (zip.file('docProps/thumbnail.jpeg') !== null) {
      const pptxThumbImg = await zip.file('docProps/thumbnail.jpeg').async("uint8array");
      self.slides.pptxThumbImg = this.base64ArrayBuffer(pptxThumbImg);
    }
    const filesInfo = await self.getContentTypes(zip);
    const slideSize = await self.getSlideSize(zip);
    self.themeContent = await self.loadTheme(zip);

    self.slides.slideSize = slideSize;
    const numOfSlides = filesInfo.slides.length;
    // console.log('numOfSlides', numOfSlides);
    let slides = [];
    for (const slide of filesInfo.slides) {
      // console.log(slide);
      const filename = slide;
      const obj = await self.processSingleSlide(zip, filename, slideSize);
      slides.push(obj.html);
      self.spectacle.presentation.slides.push(obj.slide);
      /*
      self.postMessage({
        'type': 'progress-update',
        'data': (i + 1) * 100 / numOfSlides,
      });
      */
    }
    self.slides.slides = slides;
    self.slides.globalCSS = self.genGlobalCSS();

    const dateAfter = new Date();
    self.postMessage({
      'type': 'ExecutionTime',
      'data': dateAfter - dateBefore,
    });
    //console.log('slides', self.slides);
    return self.spectacle;

  } 

  postMessage = (message) => {
    // console.log(message);
  }

  async readXmlFile(zip, filename) {
    const data = await zip.file(filename).async("string");
    return fromXML(data);
  }

  async getContentTypes(zip) {
    const ContentTypesJson = await this.readXmlFile(zip, '[Content_Types].xml');
    const subObj = ContentTypesJson['Types']['Override'];
    const slidesLocArray = [];
    const slideLayoutsLocArray = [];
    for (const s of subObj) {
      switch (s['@ContentType']) {
        case 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml':
          slidesLocArray.push(s['@PartName'].substr(1));
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml':
          slideLayoutsLocArray.push(s['@PartName'].substr(1));
          break;
        default:
      }
    }
    return {
      'slides': slidesLocArray,
      'slideLayouts': slideLayoutsLocArray,
    };
    
  }

  async getSlideSize(zip) {
    // Pixel = EMUs * Resolution / 914400;  (Resolution = 96)
    const content = await this.readXmlFile(zip, 'ppt/presentation.xml');
    const sldSzAttrs = content['p:presentation']['p:sldSz'];
    //console.log('sldSzAttrs', sldSzAttrs);
    return {
      'width': parseInt(sldSzAttrs['@cx'], 10) * 96 / 914400,
      'height': parseInt(sldSzAttrs['@cy'], 10) * 96 / 914400,
    };
  }

  async loadTheme(zip) {
    const preResContent = await this.readXmlFile(zip, 'ppt/_rels/presentation.xml.rels');
    const relationshipArray = preResContent.Relationships.Relationship;
    let themeURI;
    if (Array.isArray(relationshipArray)) {
      for (const r of relationshipArray) {
        if (r['@Type'] === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme') {
          themeURI = r['@Target'];
          break;
        }
      }
    } else if (relationshipArray['@Type'] === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme') {
      themeURI = relationshipArray['@Target'];
    }

    if (!themeURI) {
      throw Error('Can\'t open theme file.');
    }
    const theme = await this.readXmlFile(zip, 'ppt/' + themeURI)
    return theme;
  }

  async processSingleSlide(zip, sldFileName, slideSize) {
    const slide = {
      id: shortid.generate(),
      props: {
        style: {
          backgroundColor: '#fcfcfc',
          opacity: 1,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'none',
          backgroundSize: 'cover',
        },
        transition: [],
        backgroundImageName: null,
        backgroundImageSrc: null,
      },
      children: [],
    };
    // =====< Step 1 >=====
    // Read relationship filename of the slide (Get slideLayoutXX.xml)
    // @sldFileName: ppt/slides/slide1.xml
    // @resName: ppt/slides/_rels/slide1.xml.rels
    const resName = sldFileName.replace('slides/slide', 'slides/_rels/slide') + '.rels';
    const resContent = await this.readXmlFile(zip, resName);
    let RelationshipArray = resContent.Relationships.Relationship;
    let layoutFilename = '';
    const slideResObj = {};
    if (Array.isArray(RelationshipArray)) {
      for (const Relationship of RelationshipArray) {
        switch (Relationship['@Type']) {
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout':
            layoutFilename = Relationship['@Target'].replace('../', 'ppt/');
            break;
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide':
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image':
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart':
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink':
          default:
            slideResObj[Relationship['@Id']] = {
              'type': Relationship['@Type'].replace('http://schemas.openxmlformats.org/officeDocument/2006/relationships/', ''),
              'target': Relationship['@Target'].replace('../', 'ppt/'),
            };
        }
      }
    } else {
      layoutFilename = RelationshipArray['@Target'].replace('../', 'ppt/');
    }

    // Open slideLayoutXX.xml
    const slideLayoutContent = await this.readXmlFile(zip, layoutFilename);
    const slideLayoutTables = this.indexNodes(slideLayoutContent);
    //this.debug(slideLayoutTables);

    // =====< Step 2 >=====
    // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
    // @resName: ppt/slideLayouts/slideLayout1.xml
    // @masterName: ppt/slideLayouts/_rels/slideLayout1.xml.rels
    const slideLayoutResFilename = `${layoutFilename.replace('slideLayouts/slideLayout', 'slideLayouts/_rels/slideLayout')}.rels`;
    const slideLayoutResContent = await this.readXmlFile(zip, slideLayoutResFilename);
    RelationshipArray = slideLayoutResContent.Relationships.Relationship;
    let masterFilename = '';
    if (Array.isArray(RelationshipArray)) {
      for (const Relationship of RelationshipArray) {
        switch (Relationship['@Type']) {
          case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster':
            masterFilename = Relationship['@Target'].replace('../', 'ppt/');
            break;
          default:
        }
      }
    } else {
      masterFilename = RelationshipArray['@Target'].replace('../', 'ppt/');
    }
    // Open slideMasterXX.xml
    const slideMasterContent = await this.readXmlFile(zip, masterFilename);
    const slideMasterTextStyles = this.getTextByPathList(slideMasterContent, ['p:sldMaster', 'p:txStyles']);
    const slideMasterTables = this.indexNodes(slideMasterContent);
    //this.debug(slideMasterTables);


    // =====< Step 3 >=====
    const content = await this.readXmlFile(zip, sldFileName);
    let bgColor = this.getTextByPathList(content, ['p:sld', 'p:cSld', 'p:bg', 'p:bgPr', 'a:solidFill', 'a:srgbClr', 'val']);
    if (!bgColor) {
      bgColor = 'FFF';
    }
    const nodes = content['p:sld']['p:cSld']['p:spTree'];
    const warpObj = {
      zip,
      slideLayoutTables,
      slideMasterTables,
      slideResObj,
      slideMasterTextStyles,
    };
    slide.props.style.backgroundColor = `#${bgColor}`;
    let html = '<section style=\'width:' + slideSize.width + 'px; height:' + slideSize.height + 'px; background-color: #' + bgColor + '\'>'
    // console.log('# of nodes', Object.keys(nodes).length);
    for (const nodeKey of Object.keys(nodes)) {
      if (Array.isArray(nodes[nodeKey])) {
        for (const n of nodes[nodeKey]) {
          const result = await this.processNodesInSlide(nodeKey, n, warpObj);
          html += result.html;
          slide.children = slide.children.concat(result.els);
        }
      } else {
       const result =await this.processNodesInSlide(nodeKey, nodes[nodeKey], warpObj);
       html += result.html;
       slide.children = slide.children.concat(result.els);
      }
    }
    html += '</section>';

    return {
      html,
      slide,
    };
  }

  indexNodes = (content) => {
    const keys = Object.keys(content);
    const spTreeNode = content[keys[1]]['p:cSld']['p:spTree'];

    const idTable = {};
    const idxTable = {};
    const typeTable = {};

    for (const key of Object.keys(spTreeNode)) {
      if (key === 'p:nvGrpSpPr' || key === 'p:grpSpPr') {
        continue;
      }

      const targetNode = spTreeNode[key];

      if (Array.isArray(targetNode)) {
        for (const node of targetNode) {
          const nvSpPrNode = node['p:nvSpPr'];
          // console.log(nvSpPrNode);
          const id = this.getTextByPathList(nvSpPrNode, ['p:cNvPr', '@id']);
          const idx = this.getTextByPathList(nvSpPrNode, ['p:nvPr', 'p:ph', '@idx']);
          const type = this.getTextByPathList(nvSpPrNode, ['p:nvPr', 'p:ph', '@type']);

          if (id) {
            idTable[id] = node;
          }
          if (idx) {
            idxTable[idx] = node;
          }
          if (type) {
            typeTable[type] = node;
          }
        }
      } else {
        const nvSpPrNode = targetNode['p:nvSpPr'];
        const id = this.getTextByPathList(nvSpPrNode, ['p:cNvPr', 'id']);
        const idx = this.getTextByPathList(nvSpPrNode, ['p:nvPr', 'p:ph', 'idx']);
        const type = this.getTextByPathList(nvSpPrNode, ['p:nvPr', 'p:ph', 'type']);

        if (id) {
          idTable[id] = targetNode;
        }
        if (idx) {
          idxTable[idx] = targetNode;
        }
        if (type) {
          typeTable[type] = targetNode;
        }
      }

    }

    return {
      idTable,
      idxTable,
      typeTable,
    };
  }

  async processNodesInSlide(nodeKey, nodeValue, warpObj) {
    // console.log('processNodesInSlide',nodeKey);
    let result = {
      html: '',
      els: [],
    };

    switch (nodeKey) {
      case 'p:sp': // Shape, Text
        result = this.processSpNode(nodeValue, warpObj);
        break;
      case 'p:cxnSp': // Shape, Text (with connection)
        result = this.processCxnSpNode(nodeValue, warpObj);
        break;
      case 'p:pic': // Picture
        result = await this.processPicNode(nodeValue, warpObj);
        break;
      case 'p:graphicFrame': // Chart, Diagram, Table
        result = this.processGraphicFrameNode(nodeValue, warpObj);
        break;
      case 'p:grpSp': // 群組
        result = await this.processGroupSpNode(nodeValue, warpObj);
        break;
      default:
    }

    return result;

  }

  async processGroupSpNode(node, warpObj) {
    // console.log('processGroupSpNode');
    const factor = 96 / 914400;

    const xfrmNode = node['p:grpSpPr']['a:xfrm'];
    const x = parseInt(xfrmNode['a:off']['@x'], 10) * factor;
    const y = parseInt(xfrmNode['a:off']['@y'], 10) * factor;
    const chx = parseInt(xfrmNode['a:chOff']['@x'], 10) * factor;
    const chy = parseInt(xfrmNode['a:chOff']['@y'], 10) * factor;
    const cx = parseInt(xfrmNode['a:ext']['@cx'], 10) * factor;
    const cy = parseInt(xfrmNode['a:ext']['@cy'], 10) * factor;
    const chcx = parseInt(xfrmNode['a:chExt']['@cx'], 10) * factor;
    const chcy = parseInt(xfrmNode['a:chExt']['@cy'], 10) * factor;

    const order = node['@order'] || '0';
    let els = [];
    let html = '<div class=\'block group\' style=\'z-index: ' + order + '; top: ' + (y - chy) + 'px; left: ' + (x - chx) + 'px; width: ' + (cx - chcx) + 'px; height: ' + (cy - chcy) + 'px;\'>';

    // Procsee all child nodes
    for (const nodeKey of Object.keys(node)) {
      if (Array.isArray(node[nodeKey])) {
        for (const n of node[nodeKey]) {
          const result = await this.processNodesInSlide(nodeKey, n, warpObj);
          html += result.html;
          els = els.concat(result.els);
        }
      } else {
        const result = await this.processNodesInSlide(nodeKey, node[nodeKey], warpObj);
        html += result.html;
        els = els.concat(result.els);
      }
    }

    html += '</div>';

    return {
      html,
      els,
    };
  }

  processSpNode = (node, warpObj) => {

    /*
    *  958	<xsd:complexType name="CT_GvmlShape">
    *  959   <xsd:sequence>
    *  960     <xsd:element name="nvSpPr" type="CT_GvmlShapeNonVisual"     minOccurs="1" maxOccurs="1"/>
    *  961     <xsd:element name="spPr"   type="CT_ShapeProperties"        minOccurs="1" maxOccurs="1"/>
    *  962     <xsd:element name="txSp"   type="CT_GvmlTextShape"          minOccurs="0" maxOccurs="1"/>
    *  963     <xsd:element name="style"  type="CT_ShapeStyle"             minOccurs="0" maxOccurs="1"/>
    *  964     <xsd:element name="extLst" type="CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
    *  965   </xsd:sequence>
    *  966 </xsd:complexType>
    */
    // console.log('node', node['p:nvSpPr']['p:nvPr']);
    const id = node['p:nvSpPr']['p:cNvPr']['@id'];
    const name = node['p:nvSpPr']['p:cNvPr']['@name'];
    const idx = (node['p:nvSpPr']['p:nvPr'] && 'p:ph' in node['p:nvSpPr']['p:nvPr']) ? node['p:nvSpPr']['p:nvPr']['p:ph']['@idx'] : null;
    let type = (node['p:nvSpPr']['p:nvPr'] && 'p:ph' in node['p:nvSpPr']['p:nvPr']) ? node['p:nvSpPr']['p:nvPr']['p:ph']['@type'] : null;
    const order = node['@order'] || '0';

    let slideLayoutSpNode;
    let slideMasterSpNode;

    if (type) {
      if (idx) {
        slideLayoutSpNode = warpObj['slideLayoutTables']['typeTable'][type];
        slideMasterSpNode = warpObj['slideMasterTables']['typeTable'][type];
      } else {
        slideLayoutSpNode = warpObj['slideLayoutTables']['typeTable'][type];
        slideMasterSpNode = warpObj['slideMasterTables']['typeTable'][type];
      }
    } else {
      if (idx) {
        slideLayoutSpNode = warpObj['slideLayoutTables']['idxTable'][idx];
        slideMasterSpNode = warpObj['slideMasterTables']['idxTable'][idx];
      } else {
        // Nothing
      }
    }

    if (!type) {
      type = this.getTextByPathList(slideLayoutSpNode, ['p:nvSpPr', 'p:nvPr', 'p:ph', 'type']);
      if (!type) {
        type = this.getTextByPathList(slideMasterSpNode, ['p:nvSpPr', 'p:nvPr', 'p:ph', 'type']);
      }
    }

    this.debug({
      id,
      name,
      idx,
      type,
      order,
    });
    //this.debug( JSON.stringify( node ) );

    return this.genShape(node, slideLayoutSpNode, slideMasterSpNode, id, name, idx, type, order, warpObj.slideMasterTextStyles);
  }

  processCxnSpNode = (node, warpObj) => {

    const id = node['p:nvCxnSpPr']['p:cNvPr']['@id'];
    const name = node['p:nvCxnSpPr']['p:cNvPr']['@name'];
    //let idx = (node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined) ? undefined : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["idx"];
    //let type = (node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined) ? undefined : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["type"];
    //<p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
    const order = node['@order'] || '0';

    this.debug({
      id,
      name,
      order,
    });

    return this.genShape(node, null, null, id, name, null, null, order, warpObj.slideMasterTextStyles);
  }

  genShape = (node, slideLayoutSpNode, slideMasterSpNode, id, name, idx, type, order, slideMasterTextStyles) => {
    // console.log('genShape');
    const xfrmList = ['p:spPr', 'a:xfrm'];
    const slideXfrmNode = this.getTextByPathList(node, xfrmList);
    const slideLayoutXfrmNode = this.getTextByPathList(slideLayoutSpNode, xfrmList);
    const slideMasterXfrmNode = this.getTextByPathList(slideMasterSpNode, xfrmList);
    let els = [];
    let html = '';
    const shapType = this.getTextByPathList(node, ['p:spPr', 'a:prstGeom', 'prst']);

    let isFlipV = false;
    if (this.getTextByPathList(slideXfrmNode, ['@flipV']) === '1' || this.getTextByPathList(slideXfrmNode, ['@flipH']) === '1') {
      isFlipV = true;
    }

    if (shapType) {

      const off = this.getTextByPathList(slideXfrmNode, ['a:off']);
      const x = parseInt(off['@x'], 10) * 96 / 914400;
      const y = parseInt(off['@y'], 10) * 96 / 914400;

      const ext = this.getTextByPathList(slideXfrmNode, ['a:ext']);
      const w = parseInt(ext['@cx'], 10) * 96 / 914400;
      const h = parseInt(ext['@cy'], 10) * 96 / 914400;

      html += '<svg class=\'drawing\' _id=\'' + id + '\' _idx=\'' + idx + '\' _type=\'' + type + '\' _name=\'' + name +
        '\' style=\'' +
        this.formatPosition(this.getPosition(slideXfrmNode)) +
        this.formatSize(this.getSize(slideXfrmNode)) +
        ' z-index: ' + order + ';' +
        '\'>';

      // Fill Color
      const fillColor = this.getFill(node, true);

      // Border Color		
      const border = this.getBorder(node, true);

      const headEndNodeAttrs = this.getTextByPathList(node, ['p:spPr', 'a:ln', 'a:headEnd']);
      const tailEndNodeAttrs = this.getTextByPathList(node, ['p:spPr', 'a:ln', 'a:tailEnd']);
      // type: none, triangle, stealth, diamond, oval, arrow
      if ((headEndNodeAttrs && (headEndNodeAttrs['@type'] === 'triangle' || headEndNodeAttrs['@type'] === 'arrow')) ||
        (tailEndNodeAttrs && (tailEndNodeAttrs['@type'] === 'triangle' || tailEndNodeAttrs['@type'] === 'arrow'))) {
        const triangleMarker = '<defs><marker id="markerTriangle" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>';
        html += triangleMarker;
      }
      let d = '';
      switch (shapType) {
        case 'accentBorderCallout1':
        case 'accentBorderCallout2':
        case 'accentBorderCallout3':
        case 'accentCallout1':
        case 'accentCallout2':
        case 'accentCallout3':
        case 'actionButtonBackPrevious':
        case 'actionButtonBeginning':
        case 'actionButtonBlank':
        case 'actionButtonDocument':
        case 'actionButtonEnd':
        case 'actionButtonForwardNext':
        case 'actionButtonHelp':
        case 'actionButtonHome':
        case 'actionButtonInformation':
        case 'actionButtonMovie':
        case 'actionButtonReturn':
        case 'actionButtonSound':
        case 'arc':
        case 'bevel':
        case 'blockArc':
        case 'borderCallout1':
        case 'borderCallout2':
        case 'borderCallout3':
        case 'bracePair':
        case 'bracketPair':
        case 'callout1':
        case 'callout2':
        case 'callout3':
        case 'can':
        case 'chartPlus':
        case 'chartStar':
        case 'chartX':
        case 'chevron':
        case 'chord':
        case 'cloud':
        case 'cloudCallout':
        case 'corner':
        case 'cornerTabs':
        case 'cube':
        case 'decagon':
        case 'diagStripe':
        case 'diamond':
        case 'dodecagon':
        case 'donut':
        case 'doubleWave':
        case 'downArrowCallout':
        case 'ellipseRibbon':
        case 'ellipseRibbon2':
        case 'flowChartAlternateProcess':
        case 'flowChartCollate':
        case 'flowChartConnector':
        case 'flowChartDecision':
        case 'flowChartDelay':
        case 'flowChartDisplay':
        case 'flowChartDocument':
        case 'flowChartExtract':
        case 'flowChartInputOutput':
        case 'flowChartInternalStorage':
        case 'flowChartMagneticDisk':
        case 'flowChartMagneticDrum':
        case 'flowChartMagneticTape':
        case 'flowChartManualInput':
        case 'flowChartManualOperation':
        case 'flowChartMerge':
        case 'flowChartMultidocument':
        case 'flowChartOfflineStorage':
        case 'flowChartOffpageConnector':
        case 'flowChartOnlineStorage':
        case 'flowChartOr':
        case 'flowChartPredefinedProcess':
        case 'flowChartPreparation':
        case 'flowChartProcess':
        case 'flowChartPunchedCard':
        case 'flowChartPunchedTape':
        case 'flowChartSort':
        case 'flowChartSummingJunction':
        case 'flowChartTerminator':
        case 'folderCorner':
        case 'frame':
        case 'funnel':
        case 'gear6':
        case 'gear9':
        case 'halfFrame':
        case 'heart':
        case 'heptagon':
        case 'hexagon':
        case 'homePlate':
        case 'horizontalScroll':
        case 'irregularSeal1':
        case 'irregularSeal2':
        case 'leftArrow':
        case 'leftArrowCallout':
        case 'leftBrace':
        case 'leftBracket':
        case 'leftRightArrowCallout':
        case 'leftRightRibbon':
        case 'lightningBolt':
        case 'lineInv':
        case 'mathDivide':
        case 'mathEqual':
        case 'mathMinus':
        case 'mathMultiply':
        case 'mathNotEqual':
        case 'mathPlus':
        case 'moon':
        case 'nonIsoscelesTrapezoid':
        case 'noSmoking':
        case 'octagon':
        case 'parallelogram':
        case 'pentagon':
        case 'pie':
        case 'pieWedge':
        case 'plaque':
        case 'plaqueTabs':
        case 'plus':
        case 'quadArrowCallout':
        case 'ribbon':
        case 'ribbon2':
        case 'rightArrowCallout':
        case 'rightBrace':
        case 'rightBracket':
        case 'round1Rect':
        case 'round2DiagRect':
        case 'round2SameRect':
        case 'rtTriangle':
        case 'smileyFace':
        case 'snip1Rect':
        case 'snip2DiagRect':
        case 'snip2SameRect':
        case 'snipRoundRect':
        case 'squareTabs':
        case 'star10':
        case 'star12':
        case 'star16':
        case 'star24':
        case 'star32':
        case 'star4':
        case 'star5':
        case 'star6':
        case 'star7':
        case 'star8':
        case 'sun':
        case 'teardrop':
        case 'trapezoid':
        case 'upArrowCallout':
        case 'upDownArrowCallout':
        case 'verticalScroll':
        case 'wave':
        case 'wedgeEllipseCallout':
        case 'wedgeRectCallout':
        case 'wedgeRoundRectCallout':
        case 'rect':
          html += '<rect x=\'0\' y=\'0\' width=\'' + w + '\' height=\'' + h + '\' fill=\'' + fillColor +
            '\' stroke=\'' + border.color + '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' />';
          break;
        case 'ellipse':
          html += '<ellipse cx=\'' + (w / 2) + '\' cy=\'' + (h / 2) + '\' rx=\'' + (w / 2) + '\' ry=\'' + (h / 2) + '\' fill=\'' + fillColor +
            '\' stroke=\'' + border.color + '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' />';
          break;
        case 'roundRect':
          html += '<rect x=\'0\' y=\'0\' width=\'' + w + '\' height=\'' + h + '\' rx=\'7\' ry=\'7\' fill=\'' + fillColor +
            '\' stroke=\'' + border.color + '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' />';
          break;
        case 'bentConnector2': // (path)
          if (isFlipV) {
            d = 'M 0 ' + w + ' L ' + h + ' ' + w + ' L ' + h + ' 0';
          } else {
            d = 'M ' + w + ' 0 L ' + w + ' ' + h + ' L 0 ' + h;
          }
          html += '<path d=\'' + d + '\' stroke=\'' + border.color +
            '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' fill=\'none\' ';
          if (headEndNodeAttrs && (headEndNodeAttrs['@type'] === 'triangle' || headEndNodeAttrs['@type'] === 'arrow')) {
            html += 'marker-start=\'url(#markerTriangle)\' ';
          }
          if (tailEndNodeAttrs && (tailEndNodeAttrs['@type'] === 'triangle' || tailEndNodeAttrs['@type'] === 'arrow')) {
            html += 'marker-end=\'url(#markerTriangle)\' ';
          }
          html += '/>';
          break;
        case 'line':
        case 'straightConnector1':
        case 'bentConnector3':
        case 'bentConnector4':
        case 'bentConnector5':
        case 'curvedConnector2':
        case 'curvedConnector3':
        case 'curvedConnector4':
        case 'curvedConnector5':
          if (isFlipV) {
            html += '<line x1=\'' + w + '\' y1=\'0\' x2=\'0\' y2=\'' + h + '\' stroke=\'' + border.color +
              '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' ';
          } else {
            html += '<line x1=\'0\' y1=\'0\' x2=\'' + w + '\' y2=\'' + h + '\' stroke=\'' + border.color +
              '\' stroke-width=\'' + border.width + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' ';
          }
          if (headEndNodeAttrs && (headEndNodeAttrs['@type'] === 'triangle' || headEndNodeAttrs['@type'] === 'arrow')) {
            html += 'marker-start=\'url(#markerTriangle)\' ';
          }
          if (tailEndNodeAttrs && (tailEndNodeAttrs['@type'] === 'triangle' || tailEndNodeAttrs['@type'] === 'arrow')) {
            html += 'marker-end=\'url(#markerTriangle)\' ';
          }
          html += '/>';
          break;
        case 'rightArrow':
          html += '<defs><marker id="markerTriangle" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="2.5" markerHeight="2.5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>';
          html += '<line x1=\'0\' y1=\'' + (h / 2) + '\' x2=\'' + (w - 15) + '\' y2=\'' + (h / 2) + '\' stroke=\'' + border.color +
            '\' stroke-width=\'' + (h / 2) + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' ';
          html += 'marker-end=\'url(#markerTriangle)\' />';
          break;
        case 'downArrow':
          html += '<defs><marker id="markerTriangle" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="2.5" markerHeight="2.5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>';
          html += '<line x1=\'' + (w / 2) + '\' y1=\'0\' x2=\'' + (w / 2) + '\' y2=\'' + (h - 15) + '\' stroke=\'' + border.color +
            '\' stroke-width=\'' + (w / 2) + '\' stroke-dasharray=\'' + border.strokeDasharray + '\' ';
          html += 'marker-end=\'url(#markerTriangle)\' />';
          break;
        case 'bentArrow':
        case 'bentUpArrow':
        case 'stripedRightArrow':
        case 'quadArrow':
        case 'circularArrow':
        case 'swooshArrow':
        case 'leftRightArrow':
        case 'leftRightUpArrow':
        case 'leftUpArrow':
        case 'leftCircularArrow':
        case 'notchedRightArrow':
        case 'curvedDownArrow':
        case 'curvedLeftArrow':
        case 'curvedRightArrow':
        case 'curvedUpArrow':
        case 'upDownArrow':
        case 'upArrow':
        case 'uturnArrow':
        case 'leftRightCircularArrow':
          break;
        case 'triangle':
          break;
        default:
          console.warn('Undefine shape type.');
      }

      html += '</svg>';
      const base64 = new Buffer(html);
      const svg = {
        type: 'Image',
        props: {
          src: `data:image/svg+xml;base64,${base64.toString('base64')}`,
          style: {
            width: w,
            height: h,
            opacity: 1,
            position: 'absolute',
            left: y,
            top: x,
          },
          'width': w,
          'height': h,
          'imageName': `${shortid.generate()}.svg`,
        },
        'children': [],
        'id': shortid.generate(),
      };
      els.push(svg);
      const pos = this.getPosition(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode);
      const size = this.getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode);
      html += '<div class=\'block content ' + this.getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) +
        '\' _id=\'' + id + '\' _idx=\'' + idx + '\' _type=\'' + type + '\' _name=\'' + name +
        '\' style=\'' +
        this.formatPosition(pos) +
        this.formatSize(size) +
        ' z-index: ' + order + ';' +
        '\'>';

      // TextBody
      if (node['p:txBody']) {
        const text = this.genTextBody(node['p:txBody'], slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
        html += text.html;
        els = els.concat(text.els);
      }
      html += '</div>';

    } else {

      html += '<div class=\'block content ' + this.getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) +
        '\' _id=\'' + id + '\' _idx=\'' + idx + '\' _type=\'' + type + '\' _name=\'' + name +
        '\' style=\'' +
        this.formatPosition(this.getPosition(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode)) +
        this.formatSize(this.getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode)) +
        this.getBorder(node, false) +
        this.getFill(node, false) +
        ' z-index: ' + order + ';' +
        '\'>';

      // TextBody
      if (node['p:txBody']) {
        const text = this.genTextBody(node['p:txBody'], slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
        html += text.html;
        els = els.concat(text.els);
      }
      html += '</div>';

    }
    //console.log('genShape');
    // console.dir(els);
    return {
      html,
      els,
    };
  }

  async processPicNode(node, warpObj) {
    //this.debug( JSON.stringify( node ) );
    // console.log('processPicNode');
    const order = node['@order'] || '0';
    const rid = node['p:blipFill']['a:blip']['@r:embed'];
    const imgName = warpObj['slideResObj'][rid]['target'];
    const imgFileExt = this.extractFileExtension(imgName).toLowerCase();
    const zip = warpObj['zip'];
    const imgArrayBuffer = await zip.file(imgName).async("uint8array");
    let mimeType = '';
    const xfrmNode = node['p:spPr']['a:xfrm'];
    const pos = this.getPosition(xfrmNode);
    const size = this.getSize(xfrmNode);
    switch (imgFileExt) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'emf': // Not native support
        mimeType = 'image/x-emf';
        break;
      case 'wmf': // Not native support
        mimeType = 'image/x-wmf';
        break;
      default:
        mimeType = 'image/*';
    }
    const base64 = new Buffer(imgArrayBuffer); // this.base64ArrayBuffer
    const el = {
      type: 'Image',
      props: {
        src: `data:image/${mimeType};base64,${base64.toString('base64')}`,
        style: {
          width: size.width,
          height: size.height,
          opacity: 1,
          position: 'absolute',
          left: pos.left,
          top: pos.top,
        },
        width: size.width,
        height: size.height,
        imageName: `${shortid.generate()}.${imgFileExt}`,
      },
      'children': [],
      'id': shortid.generate(),
    };
    const html = '<div class=\'block content\' style=\'' + this.formatPosition(pos) + this.formatSize(size) +
      ' z-index: ' + order + ';' +
      '\'><img src="data:' + mimeType + ';base64,' + base64.toString('base64') + '" style=\'width: 100%; height: 100%\'/></div>';
    
    return {
      html,
      els: [el],
    };
  }

  processGraphicFrameNode = (node, warpObj) => {

    let result = '';
    const graphicTypeUri = this.getTextByPathList(node, ['a:graphic', 'a:graphicData', '@uri']);
    // console.log(node, graphicTypeUri);
    switch (graphicTypeUri) {
      case 'http://schemas.openxmlformats.org/drawingml/2006/table':
        result = this.genTable(node, warpObj);
        break;
      case 'http://schemas.openxmlformats.org/drawingml/2006/chart':
        result = this.genChart(node, warpObj);
        break;
      case 'http://schemas.openxmlformats.org/drawingml/2006/diagram':
        result = this.genDiagram(node, warpObj);
        break;
      default:
    }

    return result;
  }

  processSpPrNode = (node, warpObj) => {

    /*
    * 2241 <xsd:complexType name="CT_ShapeProperties">
    * 2242   <xsd:sequence>
    * 2243     <xsd:element name="xfrm" type="CT_Transform2D"  minOccurs="0" maxOccurs="1"/>
    * 2244     <xsd:group   ref="EG_Geometry"                  minOccurs="0" maxOccurs="1"/>
    * 2245     <xsd:group   ref="EG_FillProperties"            minOccurs="0" maxOccurs="1"/>
    * 2246     <xsd:element name="ln" type="CT_LineProperties" minOccurs="0" maxOccurs="1"/>
    * 2247     <xsd:group   ref="EG_EffectProperties"          minOccurs="0" maxOccurs="1"/>
    * 2248     <xsd:element name="scene3d" type="CT_Scene3D"   minOccurs="0" maxOccurs="1"/>
    * 2249     <xsd:element name="sp3d" type="CT_Shape3D"      minOccurs="0" maxOccurs="1"/>
    * 2250     <xsd:element name="extLst" type="CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
    * 2251   </xsd:sequence>
    * 2252   <xsd:attribute name="bwMode" type="ST_BlackWhiteMode" use="optional"/>
    * 2253 </xsd:complexType>
    */

    // TODO:
  }

  genTextBody = (textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) => {
    // console.log('genTextBody');
    let html = '';
    let els = [];
    let result;
    const checkBullet = (bullet, el) => {
      if (bullet.bullet) {
        const prior = els.slice(-1)[0];
        if (prior) {
          prior.props.isList = 'unordered';
          prior.children = prior.children.concat(el.children);
        } else {
          result.el.props.listType = 'unordered';
          els.push(result.el);
        }
      } else {
        els.push(result.el);
      }
    };
    if (!textBodyNode) {
      return {
        html,
        els,
      };
    }

    if (Array.isArray(textBodyNode['a:p'])) {
      // multi p
      for (const n of textBodyNode['a:p']) {
        const pNode = n;
        const rNode = pNode['a:r'];
        html += '<div class=\'' + this.getHorizontalAlign(pNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) + '\'>';
        const bullet = this.genBuChar(pNode);
        html += bullet.html;
        if (!rNode) {
          // without r
          result = this.genSpanElement(pNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
          html += result.html;
          checkBullet(bullet, result.el);
        } else if (Array.isArray(rNode)) {
          // with multi r
          for (const r of rNode) {
            //console.log('genTextBody: in for loop 2');
            result = this.genSpanElement(r, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
            html += result.html;
            checkBullet(bullet, result.el);
          }
        } else {
          // with one r
          result = this.genSpanElement(rNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
          html += result.html;
          checkBullet(bullet, result.el);
        }
        html += '</div>';
      }
    } else {
      // one p
      const pNode = textBodyNode['a:p'];
      const rNode = pNode['a:r'];
      html += '<div class=\'' + this.getHorizontalAlign(pNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) + '\'>';
      const bullet = this.genBuChar(pNode);
      html += bullet.html;
      if (!rNode) {
        // without r
        result = this.genSpanElement(pNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
        html += result.html;
        checkBullet(bullet, result.el);
      } else if (Array.isArray(rNode)) {
        // with multi r
        for (const r of rNode) {
          result = this.genSpanElement(r, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
          checkBullet(bullet, result.el);
          html += result.html;
        }
      } else {
        // with one r
        result = this.genSpanElement(rNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles);
        checkBullet(bullet, result.el);
        html += result.html;
      }
      html += '</div>';
    }
    return {
      html,
      els,
    };
  }

  genBuChar = (node) => {

    const pPrNode = node['a:pPr'];
    let html = '';
    let bullet = false;
    let lvl = parseInt(this.getTextByPathList(pPrNode, ['@lvl']), 10);
    if (isNaN(lvl)) {
      lvl = 0;
    }

    const buChar = this.getTextByPathList(pPrNode, ['a:buChar', '@char']);
    if (buChar) {
      const buFontAttrs = this.getTextByPathList(pPrNode, ['a:buFont']);
      if (buFontAttrs) {
        bullet = true;
        let marginLeft = parseInt(this.getTextByPathList(pPrNode, ['@marL']), 10) * 96 / 914400;
        let marginRight = parseInt(buFontAttrs['@pitchFamily'], 10);
        if (isNaN(marginLeft)) {
          marginLeft = 328600 * 96 / 914400;
        }
        if (isNaN(marginRight)) {
          marginRight = 0;
        }
        const typeface = buFontAttrs['@typeface'];

        html = '<span style=\'font-family: ' + typeface +
          '; margin-left: ' + marginLeft * lvl + 'px' +
          '; margin-right: ' + marginRight + 'px' +
          '; font-size: 20pt' +
          '\'>' + buChar + '</span>';
      }
    } else {
      //buChar = '•';
      html = '<span style=\'margin-left: ' + 328600 * 96 / 914400 * lvl + 'px' +
        '; margin-right: ' + 0 + 'px;\'></span>';
    }

    return {
      html,
      bullet,
    };
  }

  genSpanElement = (node, slideLayoutSpNode, slideMasterSpNode, elType, slideMasterTextStyles) => {
    //console.log('genSpanElement');
    const type = 'span';
    const font = this.getFontType(node, elType, slideMasterTextStyles);

    const cssEl = {
      color: this.getFontColor(node, elType, slideMasterTextStyles),
      fontFamily: (this.fonts.indexOf(font) > -1) ? font : "Open Sans",
      fontSize: this.getFontSize(node, slideLayoutSpNode, slideMasterSpNode, elType, slideMasterTextStyles),
      fontStyle: this.getFontItalic(node, elType, slideMasterTextStyles),
      lineHeight: 'normal',
      fontWeight: this.getFontBold(node, elType, slideMasterTextStyles),
      minWidth: 20,
      opacity: 1,
      textAlign: 'center',
      verticalAlign: this.getTextVerticalAlign(node, elType, slideMasterTextStyles),
      textDecoration: this.getFontDecoration(node, elType, slideMasterTextStyles),
    };

    const el = {
      type: 'Text',
      defaultWidth: 52,
      defaultHeight: 36,
      defaultText: [
        'Text',
      ],
      resizeVertical: false,
      props: {
        paragraphStyle: 'Heading 1',
        isQuote: false,
        size: 4,
        listType: null,
        style: {
          wordBreak: 'break-word',
          position: 'absolute',
          left: 0,
          top: 0,
        },
      },
      'children': [],
      'id': shortid.generate(),
    };
    let text = node['a:t'];
    if (typeof text !== 'string') {
      text = this.getTextByPathList(node, ['a:fld', 'a:t']);
      if (typeof text !== 'string') {
        text = '&nbsp;';
        //this.debug("XXX: " + JSON.stringify(node));
      }
    }
    el.children.push(text);

    const styleText = `
      color: ${cssEl.color};
      font-size: ${cssEl.fontSize};
      font-family: ${cssEl.fontFamily};
      font-weight: ${cssEl.fontWeight};
      font-style: ${cssEl.fontStyle};
      text-decoration: ${cssEl.textDecoration};
      vertical-align: ${cssEl.verticalAlign};`;

    let cssName = '';
    const hash = this.sha256(styleText);
    //console.log(hash);
    if (hash in this.styleTable) {
      //console.log('found hash');
      cssName = this.styleTable[hash].name;
    } else {
      cssName = `Custom_Style_${(Object.keys(this.styleTable).length + 1)}`;
      this.styleTable[hash] = {
        name: cssName,
        text: styleText,
        object: cssEl,
      };
    }
    //console.log('set cssName');
    el.props.paragraphStyle = cssName;
    const html = '<span class=\'text-block ' + cssName + '\'>' + text.replace(/\s/i, '&nbsp;') + '</span>';
    //console.log('genSpanElement', el);
    return {
      type,
      html,
      el,
    };
  }

  genGlobalCSS = () => {
    let cssText = '';
    for (const key of Object.keys(this.styleTable)) {
      const css = this.styleTable[key];
      // console.log(css.name);
      cssText += 'section .' + css.name + '{' + css.text + '}\n';
      this.spectacle.presentation.paragraphStyles[css.name] = css.object;
    }
    return cssText;
  }

  genTable = (node, warpObj) => {
    // console.log('genTable', node);
    const type = 'table';
    const el = {
      type: 'Text',
      defaultWidth: 52,
      defaultHeight: 36,
      defaultText: [
        'Text',
      ],
      resizeVertical: false,
      props: {
        paragraphStyle: 'Heading 1',
        isQuote: false,
        size: 4,
        listType: null,
        style: {
          wordBreak: 'break-word',
          position: 'absolute',
          left: 0,
          top: 0,
        },
      },
      'children': [],
      'id': shortid.generate(),
    };
    const order = node['@order'] || '0';
    const tableNode = this.getTextByPathList(node, ['a:graphic', 'a:graphicData', 'a:tbl']);
    const xfrmNode = this.getTextByPathList(node, ['p:xfrm']);
    const els = [];
    let html  = '<table style=\'' + this.formatPosition(this.getPosition(xfrmNode)) + this.formatSize(this.getSize(xfrmNode)) + ' z-index: ' + order + ';\'>';

    const trNodes = tableNode['a:tr'];
    if (Array.isArray(trNodes)) {
      for (const tr of trNodes) {
        html  += '<tr>';
        const tcNodes = tr['a:tc'];

        if (Array.isArray(tcNodes)) {
          for (const tc of tcNodes) {
            const text = this.genTextBody(tc['a:txBody']);
            const rowSpan = this.getTextByPathList(tc, ['@rowSpan']);
            const colSpan = this.getTextByPathList(tc, ['@gridSpan']);
            const vMerge = this.getTextByPathList(tc, ['@vMerge']);
            const hMerge = this.getTextByPathList(tc, ['@hMerge']);
            if (rowSpan) {
              html  += '<td rowspan=\'' + parseInt(rowSpan, 10) + '\'>' + text.html + '</td>';
            } else if (colSpan) {
              html  += '<td colspan=\'' + parseInt(colSpan, 10) + '\'>' + text.html + '</td>';
            } else if (!vMerge && !hMerge) {
              html  += '<td>' + text.html + '</td>';
            }
          }
        } else {
          const text = this.genTextBody(tcNodes['a:txBody']);
          html  += '<td>' + text.html + '</td>';
        }
        html  += '</tr>';
      }
    } else {
      html  += '<tr>';
      const tcNodes = trNodes['a:tc'];
      if (Array.isArray(tcNodes)) {
        for (const tc of tcNodes) {
          const text = this.genTextBody(tc['a:txBody']);
          html  += '<td>' + text.html + '</td>';
        }
      } else {
        const text = this.genTextBody(tcNodes['a:txBody']);
        html  += '<td>' + text.html + '</td>';
      }
      html  += '</tr>';
    }
    html += "</table>";
    el.children.push(html);
    els.push(el);
    return {
      type,
      html,
      els, 
    };
  }

  genChart = (node, warpObj) => {
    const type = 'chart';
    const order = node['@order'] || '0';
    const xfrmNode = this.getTextByPathList(node, ['p:xfrm']);
    const html  = '<div id=\'chart' + this.chartID + '\' class=\'block content\' style=\'' +
      this.formatPosition(this.getPosition(xfrmNode)) + this.formatSize(this.getSize(xfrmNode)) +
      ' z-index: ' + order + ';\'></div>';

    const rid = node['a:graphic']['a:graphicData']['c:chart']['@r:id'];
    const refName = warpObj.slideResObj[rid]['target'];
    this.readXmlFile(warpObj.zip, refName).then(
      (content) => {
        const plotArea = this.getTextByPathList(content, ['c:chartSpace', 'c:chart', 'c:plotArea']);
        let chartData = null;
        for (const key in plotArea) {
          switch (key) {
            case 'c:lineChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'lineChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:barChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'barChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:pieChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'pieChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:pie3DChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'pie3DChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:areaChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'areaChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:scatterChart':
              chartData = {
                'type': 'createChart',
                'data': {
                  'chartID': 'chart' + this.chartID,
                  'chartType': 'scatterChart',
                  'chartData': this.extractChartData(plotArea[key]['c:ser']),
                },
              };
              break;
            case 'c:catAx':
              break;
            case 'c:valAx':
              break;
            default:
          }
        }

        if (chartData) {
          this.MsgQueue.push(chartData);
        }

        this.chartID++;
        return {
          type,
          html,
          els: [],
        };
      }
    );
    
  }

  genDiagram = (node, warpObj) => {
    const type = 'diagram';
    const order = node['@order'] || '0';
    const xfrmNode = this.getTextByPathList(node, ['p:xfrm']);
    const html = '<div class=\'block content\' style=\'border: 1px dotted;' +
      this.formatPosition(this.getPosition(xfrmNode)) + this.formatSize(this.getSize(xfrmNode)) +
      '\'>TODO: diagram</div>';
    const els = [];

    return {
      type,
      html,
      els,
    }
  }

  getPosition = (slideSpNode, slideLayoutSpNode, slideMasterSpNode) => {

    //this.debug(JSON.stringify(slideLayoutSpNode));
    //this.debug(JSON.stringify(slideMasterSpNode));
    const el = {
      top: 0,
      left: 0,
    };
    let off;
    let x = -1,
      y = -1;

    if (slideSpNode) {
      off = slideSpNode['a:off'];
    } else if (slideLayoutSpNode) {
      off = slideLayoutSpNode['a:off'];
    } else if (slideMasterSpNode) {
      off = slideMasterSpNode['a:off'];
    }

    if (off) {
      x = parseInt(off['@x'], 10) * 96 / 914400;
      y = parseInt(off['@y'], 10) * 96 / 914400;
      if (!isNaN(x) && !isNaN(y)) {
        el.top = y;
        el.left = x;
      }
    }
    return el;
  }

  formatPosition = (el) => `top: ${el.top}px; left: ${el.left}px;`;

  getSize = (slideSpNode, slideLayoutSpNode, slideMasterSpNode) => {

    //this.debug(JSON.stringify(slideLayoutSpNode));
    //this.debug(JSON.stringify(slideMasterSpNode));
    const el = {
      width: 0,
      height: 0,
    };
    let ext;
    let w = -1,
      h = -1;

    if (slideSpNode) {
      ext = slideSpNode['a:ext'];
    } else if (slideLayoutSpNode) {
      ext = slideLayoutSpNode['a:ext'];
    } else if (slideMasterSpNode) {
      ext = slideMasterSpNode['a:ext'];
    }

    if (ext) {
      w = parseInt(ext['@cx'], 10) * 96 / 914400;
      h = parseInt(ext['@cy'], 10) * 96 / 914400;
      if (!isNaN(w) && !isNaN(h)) {
        el.width = w;
        el.height = h;
      }
    }
    return el;
  }

  formatSize = (el) => `width: ${el.width}px; height: ${el.height}px;`;

  getHorizontalAlign = (node, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) => {
    //this.debug(node);
    let algn = this.getTextByPathList(node, ['a:pPr', 'algn']);
    if (!algn) {
      algn = this.getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:p', 'a:pPr', 'algn']);
      if (!algn) {
        algn = this.getTextByPathList(slideMasterSpNode, ['p:txBody', 'a:p', 'a:pPr', 'algn']);
        if (!algn) {
          switch (type) {
            case 'title':
            case 'subTitle':
            case 'ctrTitle':
              algn = this.getTextByPathList(slideMasterTextStyles, ['p:titleStyle', 'a:lvl1pPr', 'alng']);
              break;
            default:
              algn = this.getTextByPathList(slideMasterTextStyles, ['p:otherStyle', 'a:lvl1pPr', 'alng']);
          }
        }
      }
    }
    // TODO:
    if (!algn) {
      if (type === 'title' || type === 'subTitle' || type === 'ctrTitle') {
        return 'h-mid';
      } else if (type === 'sldNum') {
        return 'h-right';
      }
    }
    return algn === 'ctr' ? 'h-mid' : algn === 'r' ? 'h-right' : 'h-left';
  }

  getVerticalAlign = (node, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) => {

    // 上中下對齊: X, <a:bodyPr anchor="ctr">, <a:bodyPr anchor="b">
    let anchor = this.getTextByPathList(node, ['p:txBody', 'a:bodyPr', 'anchor']);
    if (!anchor) {
      anchor = this.getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:bodyPr', 'anchor']);
      if (!anchor) {
        anchor = this.getTextByPathList(slideMasterSpNode, ['p:txBody', 'a:bodyPr', 'anchor']);
      }
    }

    return anchor === 'ctr' ? 'v-mid' : anchor === 'b' ? 'v-down' : 'v-up';
  }

  getFontType = (node, type, slideMasterTextStyles) => {
    let typeface = this.getTextByPathList(node, ['a:rPr', 'a:latin', '@typeface']);

    if (!typeface) {
      let fontSchemeNode = this.getTextByPathList(this.themeContent, ['a:theme', 'a:themeElements', 'a:fontScheme']);
      if (type === 'title' || type === 'subTitle' || type === 'ctrTitle') {
        typeface = this.getTextByPathList(fontSchemeNode, ['a:majorFont', 'a:latin', '@typeface']);
      } else if (type === 'body') {
        typeface = this.getTextByPathList(fontSchemeNode, ['a:minorFont', 'a:latin', '@typeface']);
      } else {
        typeface = this.getTextByPathList(fontSchemeNode, ['a:minorFont', 'a:latin', '@typeface']);
      }
    }

    return (!typeface) ? 'inherit' : typeface;
  }

  getFontColor = (node, type, slideMasterTextStyles) => {
    let color = this.getTextByPathStr(node, 'a:rPr a:solidFill a:srgbClr @val');
    return (!color) ? '#000' : '#' + color;
  }

  getFontSize = (node, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles) => {
    let fontSize;
    let sz;
    // console.log('getFontSize', node);
    if (node['a:rPr'] && node['a:rPr']['@sz']) {
      fontSize = parseInt(node['a:rPr']['@sz']) / 100;
    }

    if ((isNaN(fontSize) || !fontSize)) {
      sz = this.getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:lstStyle', 'a:lvl1pPr', 'a:defRPr', '@sz']);
      fontSize = parseInt(sz) / 100;
    }

    if (!isNaN(fontSize) || !fontSize) {
      if (type === 'title' || type === 'subTitle' || type === 'ctrTitle') {
        sz = this.getTextByPathList(slideMasterTextStyles, ['p:titleStyle', 'a:lvl1pPr', 'a:defRPr', '@sz']);
      } else if (type === 'body') {
        sz = this.getTextByPathList(slideMasterTextStyles, ['p:bodyStyle', 'a:lvl1pPr', 'a:defRPr', '@sz']);
      } else if (type === 'dt' || type === 'sldNum') {
        sz = '1200';
      } else if (!type) {
        sz = this.getTextByPathList(slideMasterTextStyles, ['p:otherStyle', 'a:lvl1pPr', 'a:defRPr', '@sz']);
      }
      fontSize = parseInt(sz) / 100;
    }

    const baseline = this.getTextByPathList(node, ['a:rPr', '@baseline']);
    if (baseline && !isNaN(fontSize)) {
      fontSize -= 10;
    }

    return isNaN(fontSize) ? 20 : fontSize;
  }

  getFontBold = (node, type, slideMasterTextStyles) => {
    return (node['a:rPr'] && node['a:rPr']['@b'] === '1') ? 'bold' : 'initial';
  }

  getFontItalic = (node, type, slideMasterTextStyles) => {
    return (node['a:rPr'] && node['a:rPr']['@i'] === '1') ? 'italic' : 'normal';
  }

  getFontDecoration = (node, type, slideMasterTextStyles) => {
    return (node['a:rPr'] && node['a:rPr']['@u'] === 'sng') ? 'underline' : 'initial';
  }

  getTextVerticalAlign = (node, type, slideMasterTextStyles) => {
    let baseline = this.getTextByPathList(node, ['a:rPr', 'baseline']);
    return !baseline ? 'baseline' : (parseInt(baseline) / 1000) + '%';
  }

  getBorder = (node, isSvgMode) => {

    this.debug(JSON.stringify(node));
    if (node['p:spPr']) {
      let cssText = 'border: ';

      // 1. presentationML
      const lineNode = node['p:spPr']['a:ln'];

      // Border width: 1pt = 12700, default = 0.75pt
      const borderWidth = parseInt(this.getTextByPathList(lineNode, ['@w']), 10) / 12700;
      if (isNaN(borderWidth) || borderWidth < 1) {
        cssText += '1pt ';
      } else {
        cssText += borderWidth + 'pt ';
      }

      // Border color
      let borderColor = this.getTextByPathList(lineNode, ['a:solidFill', 'a:srgbClr', 'val']);
      if (!borderColor) {
        const schemeClrNode = this.getTextByPathList(lineNode, ['a:solidFill', 'a:schemeClr']);
        const schemeClr = 'a:' + this.getTextByPathList(schemeClrNode, ['@val']);
        borderColor = this.getSchemeColorFromTheme(schemeClr);
      }

      // 2. drawingML namespace
      if (!borderColor) {
        const schemeClrNode = this.getTextByPathList(node, ['p:style', 'a:lnRef', 'a:schemeClr']);
        const schemeClr = 'a:' + this.getTextByPathList(schemeClrNode, ['@val']);
        borderColor = this.getSchemeColorFromTheme(schemeClr);

        if (borderColor) {
          let shade = this.getTextByPathList(schemeClrNode, ['a:shade', '@val']);
          if (shade) {
            shade = parseInt(shade, 10) / 100000;
            const color = Color('#' + borderColor);
            color.lightness(color.hslArray()[2] * shade);
            borderColor = color.hexString().replace('#', '');
          }
        }

      }

      if (!borderColor) {
        if (isSvgMode) {
          borderColor = 'none';
        } else {
          borderColor = '#000';
        }
      } else {
        borderColor = '#' + borderColor;

      }
      cssText += ' ' + borderColor + ' ';

      // Border type
      let borderType = this.getTextByPathList(lineNode, ['a:prstDash', 'val']);
      let strokeDasharray = '0';
      switch (borderType) {
        case 'solid':
          cssText += 'solid';
          strokeDasharray = '0';
          break;
        case 'dash':
          cssText += 'dashed';
          strokeDasharray = '5';
          break;
        case 'dashDot':
          cssText += 'dashed';
          strokeDasharray = '5, 5, 1, 5';
          break;
        case 'dot':
          cssText += 'dotted';
          strokeDasharray = '1, 5';
          break;
        case 'lgDash':
          cssText += 'dashed';
          strokeDasharray = '10, 5';
          break;
        case 'lgDashDotDot':
          cssText += 'dashed';
          strokeDasharray = '10, 5, 1, 5, 1, 5';
          break;
        case 'sysDash':
          cssText += 'dashed';
          strokeDasharray = '5, 2';
          break;
        case 'sysDashDot':
          cssText += 'dashed';
          strokeDasharray = '5, 2, 1, 5';
          break;
        case 'sysDashDotDot':
          cssText += 'dashed';
          strokeDasharray = '5, 2, 1, 5, 1, 5';
          break;
        case 'sysDot':
          cssText += 'dotted';
          strokeDasharray = '2, 5';
          break;
        default:
          //console.warn(borderType);
          //cssText += "#000 solid";
      }

      if (isSvgMode) {
        return {
          'color': borderColor,
          'width': borderWidth,
          'type': borderType,
          'strokeDasharray': strokeDasharray,
        };
      } else {
        return cssText + ';';
      }
    } else {
      return '';
    }
  }

  getFill = (node, isSvgMode) => {

    // 1. presentationML
    // p:spPr [a:noFill, solidFill, gradFill, blipFill, pattFill, grpFill]
    // From slide
    if (this.getTextByPathList(node, ['p:spPr', 'a:noFill'])) {
      return isSvgMode ? 'none' : 'background-color: initial;';
    }

    let fillColor;
    if (!fillColor) {
      fillColor = this.getTextByPathList(node, ['p:spPr', 'a:solidFill', 'a:srgbClr', 'val']);
    }

    // From theme
    if (!fillColor) {
      let schemeClr = 'a:' + this.getTextByPathList(node, ['p:spPr', 'a:solidFill', 'a:schemeClr', 'val']);
      fillColor = this.getSchemeColorFromTheme(schemeClr);
    }

    // 2. drawingML namespace
    if (!fillColor) {
      let schemeClr = 'a:' + this.getTextByPathList(node, ['p:style', 'a:fillRef', 'a:schemeClr', 'val']);
      fillColor = this.getSchemeColorFromTheme(schemeClr);
    }

    if (fillColor) {

      fillColor = '#' + fillColor;

      // Apply shade or tint
      // TODO: 較淺, 較深 80%
      let lumMod = parseInt(getTextByPathList(node, ['p:spPr', 'a:solidFill', 'a:schemeClr', 'a:lumMod', 'val'])) / 100000;
      let lumOff = parseInt(getTextByPathList(node, ['p:spPr', 'a:solidFill', 'a:schemeClr', 'a:lumOff', 'val'])) / 100000;
      if (isNaN(lumMod)) {
        lumMod = 1.0;
      }
      if (isNaN(lumOff)) {
        lumOff = 0;
      }
      //console.log([lumMod, lumOff]);
      fillColor = this.applyLumModify(fillColor, lumMod, lumOff);

      if (isSvgMode) {
        return fillColor;
      } else {
        return 'background-color: ' + fillColor + ';';
      }
    } else {
      if (isSvgMode) {
        return 'none';
      } else {
        return 'background-color: ' + fillColor + ';';
      }

    }

  }

  getSchemeColorFromTheme = (schemeClr) => {
    // TODO: <p:clrMap ...> in slide master
    // e.g. tx2="dk2" bg2="lt2" tx1="dk1" bg1="lt1"
    switch (schemeClr) {
      case 'a:tx1':
        schemeClr = 'a:dk1';
        break;
      case 'a:tx2':
        schemeClr = 'a:dk2';
        break;
      case 'a:bg1':
        schemeClr = 'a:lt1';
        break;
      case 'a:bg2':
        schemeClr = 'a:lt2';
        break;
    }
    let refNode = this.getTextByPathList(this.themeContent, ['a:theme', 'a:themeElements', 'a:clrScheme', schemeClr]);
    let color = this.getTextByPathList(refNode, ['a:srgbClr', 'val']);
    if (!color) {
      color = this.getTextByPathList(refNode, ['a:sysClr', 'lastClr']);
    }
    return color;
  }

  extractChartData = (serNode) => {

    let dataMat = new Array();

    if (!serNode) {
      return dataMat;
    }

    if (serNode['c:xVal']) {
      let dataRow = new Array();
      this.eachElement(serNode['c:xVal']['c:numRef']['c:numCache']['c:pt'], (innerNode, index) => {
        dataRow.push(parseFloat(innerNode['c:v']));
        return '';
      });
      dataMat.push(dataRow);
      dataRow = new Array();
      this.eachElement(serNode['c:yVal']['c:numRef']['c:numCache']['c:pt'], (innerNode, index) => {
        dataRow.push(parseFloat(innerNode['c:v']));
        return '';
      });
      dataMat.push(dataRow);
    } else {
      this.eachElement(serNode, (innerNode, index)=> {
        let dataRow = new Array();
        let colName = this.getTextByPathList(innerNode, ['c:tx', 'c:strRef', 'c:strCache', 'c:pt', 'c:v']) || index;

        // Category (string or number)
        let rowNames = {};
        if (getTextByPathList(innerNode, ['c:cat', 'c:strRef', 'c:strCache', 'c:pt'])) {
          this.eachElement(innerNode['c:cat']['c:strRef']['c:strCache']['c:pt'], (innerNode, index) => {
            rowNames[innerNode['@idx']] = innerNode['c:v'];
            return '';
          });
        } else if (getTextByPathList(innerNode, ['c:cat', 'c:numRef', 'c:numCache', 'c:pt'])) {
          this.eachElement(innerNode['c:cat']['c:numRef']['c:numCache']['c:pt'], (innerNode, index) => {
            rowNames[innerNode['@idx']] = innerNode['c:v'];
            return '';
          });
        }

        // Value
        if (getTextByPathList(innerNode, ['c:val', 'c:numRef', 'c:numCache', 'c:pt'])) {
          this.eachElement(innerNode['c:val']['c:numRef']['c:numCache']['c:pt'], (innerNode, index) => {
            dataRow.push({
              x: innerNode['@idx'],
              y: parseFloat(innerNode['c:v']),
            });
            return '';
          });
        }

        dataMat.push({
          key: colName,
          values: dataRow,
          xlabels: rowNames,
        });
        return '';
      });
    }

    return dataMat;
  }

  // ===== Node functions =====
  /**
   * getTextByPathStr
   * @param {Object} node
   * @param {string} pathStr
   */
  getTextByPathStr = (node, pathStr) => {
    return this.getTextByPathList(node, pathStr.trim().split(/\s+/));
  }

  /**
   * getTextByPathList
   * @param {Object} node
   * @param {string Array} path
   */
  getTextByPathList = (node, path) => {

    if (!Array.isArray(path)) {
      throw Error('Error of path type! path is not array.');
    }

    if (!node) {
      return null;
    }

    for (const p of path) {
      node = node[p];
      if (!node) {
        return null;
      }
    }

    return node;
  }

  /**
   * eachElement
   * @param {Object} node
   * @param {function} doFunction
   */
  eachElement = (node, doFunction) => {
    // console.log('eachElement');
    if (!node) {
      return;
    }
    let result = '';
    if (Array.isArray(node)) {
      let l = node.length;
      for (let i = 0; i < l; i++) {
        result += doFunction(node[i], i);
      }
    } else {
      result += doFunction(node, 0);
    }
    return result;
  }

  // ===== Color functions =====
  /**
   * applyShade
   * @param {string} rgbStr
   * @param {number} shadeValue
   */
  applyShade = (rgbStr, shadeValue) => {
    let color = Color(rgbStr);
    color.setLum(color.hsl.l * shadeValue);
    return color.rgb.toString();
  }

  /**
   * applyTint
   * @param {string} rgbStr
   * @param {number} tintValue
   */
  applyTint = (rgbStr, tintValue) => {
    let color = Color(rgbStr);
    color.setLum(color.hsl.l * tintValue + (1 - tintValue));
    return color.rgb.toString();
  }

  /**
   * applyLumModify
   * @param {string} rgbStr
   * @param {number} factor
   * @param {number} offset
   */
  applyLumModify = (rgbStr, factor, offset) => {
    let color = Color(rgbStr);
    console.log('applyLumModify', rgbStr, factor, offset);
    //color.setLum(color.hsl.l * factor);
    color.lightness(color.hslArray()[2] * (1 + offset));
    console.log('applyLumModify', color.rgbString());
    return color.rgbString();
  }

  // ===== Debug functions =====
  /**
   * debug
   * @param {Object} data
   */
  debug = (data) => {
    this.postMessage({
      'type': 'DEBUG',
      'data': data,
    });
  }

  base64ArrayBuffer = (arrayBuffer) => {
    console.log('base64ArrayBuffer');
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a, b, c, d;
    let chunk;
    try{
      for (let i = 0; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        a = (chunk & 16515072) >> 18;
        b = (chunk & 258048) >> 12;
        c = (chunk & 4032) >> 6;
        d = chunk & 63;
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      }
    } catch(e) {
      console.log(e);
    }

    if (byteRemainder == 1) {
      chunk = bytes[mainLength];
      a = (chunk & 252) >> 2;
      b = (chunk & 3) << 4;
      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
      a = (chunk & 64512) >> 10;
      b = (chunk & 1008) >> 4;
      c = (chunk & 15) << 2;
      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
  }

  extractFileExtension = (filename) => filename.substr((~-filename.lastIndexOf('.') >>> 0) + 2);

  escapeHtml = (text) => {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => {
      return map[m];
    });
  }

  sha256 = (data) => crypto.createHash("sha256").update(data).digest("base64");

}
