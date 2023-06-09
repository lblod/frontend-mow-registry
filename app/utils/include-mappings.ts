import config from 'mow-registry/config/environment';
import MappingModel from 'mow-registry/models/mapping';
import { unwrap } from 'mow-registry/utils/option';

function generateTextTemplate(uri: string, name: string) {
  return `
    <span typeof="ext:Mapping" resource="${uri}">
      <span class="mark-highlight-manual">\${${name}}</span>
    </span>
  `;
}

function generateCodelistTemplate(uri: string, name: string, codelist: string) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:source" resource="${config.sparqlEndpoint}"></span>
      <span property="dct:type" content="codelist"></span>
      <span property="ext:codelist" resource="${codelist}"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateLocationTemplate(uri: string, name: string) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:source" resource="${config.sparqlEndpoint}"></span>
      <span property="dct:type" content="location"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateDateTemplate(uri: string, name: string) {
  return `
    <span resource="${uri}" typeof="ext:Mapping">
      <span property="dct:type" content="date"></span>
      <span property="ext:content" datatype="xsd:date">\${${name}}</span>
    </span>
  `;
}

export default async function includeMappings(
  html: string,
  mappings: MappingModel[]
) {
  let finalHtml = html;
  for (const mapping of mappings) {
    if (mapping.type === 'instruction') {
      continue;
    } else if (mapping.type === 'codelist') {
      const codeList = await mapping.get('codeList');
      const codeListUri = codeList.uri;
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(mapping.variable)}}`,
        generateCodelistTemplate(
          unwrap(mapping.uri),
          unwrap(mapping.variable),
          unwrap(codeListUri)
        )
      );
    } else if (mapping.type === 'location') {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(mapping.variable)}}`,
        generateLocationTemplate(unwrap(mapping.uri), unwrap(mapping.variable))
      );
    } else if (mapping.type === 'date') {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(mapping.variable)}}`,
        generateDateTemplate(unwrap(mapping.uri), unwrap(mapping.variable))
      );
    } else {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(mapping.variable)}}`,
        generateTextTemplate(unwrap(mapping.uri), unwrap(mapping.variable))
      );
    }
  }
  return finalHtml;
}
