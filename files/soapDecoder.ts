
let _referencesResolved:boolean = false;
let _elementsWithId: Map<string, Element> = null;
let _docoment: Document = null; //IE下节点操作必须同源

export function preProcessXML(root: string): UJsonRespond<any> {
  _docoment = parseXmlFromString(root)
  const doc = _docoment.documentElement;
  if (_elementsWithId == null) {
    _referencesResolved = false;
    _elementsWithId = extractIDMap(doc);
  }
  resolveReferences(doc);
  const dataXml = extractNodeByData(doc);
  const dataObject = generateObjectFromXML(dataXml);
  return dataObject;
}

function parseXmlFromString(xmlStr:string):Document {
  if ("ActiveXObject" in window) {
    const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.loadXML(xmlStr);
    return xmlDoc;
  }else{
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
  }
}


function extractIDMap(doc: HTMLElement): Map<string, Element> {
  const result: Map<string, Element> = new Map();
  const root = doc.childNodes[0];
  for (let childNode of Array.from<any>(root.childNodes)) {
    const attributeId = childNode.getAttributeNode('id');
    if (attributeId) {
      result.set(attributeId.value, childNode)
    }
  }
  return result;
}


function hasComplexContent(element: Element): boolean {
  return element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0
}

function getAttribute(element: Element, name: string): string {
  const attribute = element.getAttributeNode(name);
  return attribute?.value;
}


function replaceNodeByNewName(referent: Element, nodeName: string): Element {
  const newNode = _docoment.createElement(nodeName);
  const type = getAttribute(referent, 'xsi:type');
  newNode.setAttribute('xsi:type', type)
  let node = referent.firstChild;
  let nextNode;
  while (node) {
    nextNode = node.nextSibling;
    newNode.appendChild(node);
    node = nextNode;
  }
  referent.parentNode.replaceChild(newNode, referent);
  return newNode;
}


function getType(element:Element):string{
  const type = getAttribute(element, 'xsi:type');
  const split = type?.split(':');
  return split?.[1];
}


function extractNodeByData(doc: Element): Element {
  let result = {
    data: null
  };
  resolvedExtractNodeByData(doc, result);
  return result.data;
}

function resolvedExtractNodeByData(doc: Element, result: any) {
  for (let childXml of Array.from<any>(doc.childNodes)) {
    const nodeName = childXml.nodeName;
    if(nodeName === 'data'){
      result.data = childXml.parentNode;
    }else{
      resolvedExtractNodeByData(childXml, result);
    }
  }
}


function generateObjectFromXML(xml: Element) {
  const result = {};
  resolvedGenerateObjectFromXML(xml, result);
  return result
}

function resolvedGenerateObjectFromXML(xml: Element, obj: object) {
  for (let childXml of Array.from<any>(xml.childNodes)) {
    const nodeType = getType(childXml);
    if (nodeType === 'Vector' || nodeType === 'Array') {
      const vector = []
      obj[childXml.nodeName] = vector;
      for (let vectorChildXml of Array.from<any>(childXml.childNodes)) {
        const vectorChild = {}
        vector.push(vectorChild)
        resolvedGenerateObjectFromXML(vectorChildXml, vectorChild)
      }
    } else {
      const nodeValue = childXml.childNodes[0]?.nodeValue;
      if (nodeType === 'string') {
        obj[childXml.nodeName] = nodeValue;
      } else if (nodeType === 'boolean') {
        obj[childXml.nodeName] = nodeValue === 'true';
      } else if (nodeType === 'int' || nodeType === 'double') {
        obj[childXml.nodeName] = Number(nodeValue)
      } else {
        obj[childXml.nodeName] = nodeValue;
      }
    }
  }
}

function resolveReferences(root: Element, cleanupElementsWithIdCache: Boolean = true): void {
  if (_referencesResolved)
    return;
  for (let child of Array.from<any>(root.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child;
      let href = getAttribute(element, 'href');
      if (href) {
        const hashPosition = href.indexOf("#");
        if (hashPosition >= 0)
          href = href.substring(hashPosition + 1);

        const referent = _elementsWithId.get(href);
        const newReferent = replaceNodeByNewName(referent, element.nodeName);

        if (hasComplexContent(newReferent))
          resolveReferences(newReferent, false);

        root.replaceChild(newReferent, element);
      }
      else if (hasComplexContent(child)) {
        resolveReferences(element, false);
      }
    }
  }
  if (cleanupElementsWithIdCache) {
    _elementsWithId = null;
    _referencesResolved = true;
  }
}
