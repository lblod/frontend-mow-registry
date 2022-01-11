function generateTextTemplate(uri, name) {
  return `
    <span typeof="ext:Mapping" resource="${uri}">
      <span class="mark-highlight-manual">\${${name}}</span>
    </span>
  `;
}

function generateCodelistTemplate(uri, name, codelist) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:type" content="codelist"></span>
      <span property="ext:codelist" content="${codelist}"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateLocationTemplate(uri, name) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:type" content="location"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateDateTemplate(uri, name) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:type" content="date"></span>
      <span property="ext:content" datatype="xsd:date">\${${name}}</span>
    </span>
  `;
}

export default async function includeMappings(html, mappings) {
  let finalHtml = html;
  for (let mapping of mappings) {
    if (mapping.type === 'instruction') {
      continue;
    } else if (mapping.type === 'codelist') {
      const codeList = await mapping.get('codeList');
      const codeListUri = codeList.uri;
      finalHtml = finalHtml.replaceAll(
        `\${${mapping.variable}}`,
        generateCodelistTemplate(mapping.uri, mapping.variable, codeListUri)
      );
    } else if (mapping.type === 'location') {
      finalHtml = finalHtml.replaceAll(
        `\${${mapping.variable}}`,
        generateLocationTemplate(mapping.uri, mapping.variable)
      );
    } else if (mapping.type === 'date') {
      finalHtml = finalHtml.replaceAll(
        `\${${mapping.variable}}`,
        generateDateTemplate(mapping.uri, mapping.variable)
      );
    } else {
      finalHtml = finalHtml.replaceAll(
        `\${${mapping.variable}}`,
        generateTextTemplate(mapping.uri, mapping.variable)
      );
    }
  }
  return finalHtml;
}
