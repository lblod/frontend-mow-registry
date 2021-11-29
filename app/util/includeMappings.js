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
      <span property="dct:type" resource="${codelist}" value="codelist"></span>
      <span property="ext:variable">\${${name}}</span>
    </span>
  `;
}

function generateLocationTemplate(uri, name) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:type" value="location"></span>
      <span property="ext:variable">\${${name}}</span>
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
    } else if (mapping.type === 'locatie') {
      finalHtml = finalHtml.replaceAll(
        `\${${mapping.variable}}`,
        generateLocationTemplate(mapping.uri, mapping.variable)
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
