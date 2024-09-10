import config from 'mow-registry/config/environment';
import Variable from 'mow-registry/models/variable';
import { unwrap } from 'mow-registry/utils/option';

function generateTextTemplate(uri: string, name: string) {
  return `
    <span typeof="mobiliteit:Variabele" resource="${uri}">
      <span class="mark-highlight-manual">\${${name}}</span>
    </span>
  `;
}

function generateCodelistTemplate(uri: string, name: string, codelist: string) {
  return `
    <span resource="${uri}" typeof="mobiliteit:Variabele">
      <span property="dct:source" resource="${config.sparqlEndpoint}"></span>
      <span property="dct:type" content="codelist"></span>
      <span property="ext:codelist" resource="${codelist}"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateLocationTemplate(uri: string, name: string) {
  return `
    <span resource="${uri}" typeof="mobiliteit:Variabele">
      <span property="dct:source" resource="${config.sparqlEndpoint}"></span>
      <span property="dct:type" content="location"></span>
      <span property="ext:content">\${${name}}</span>
    </span>
  `;
}

function generateDateTemplate(uri: string, name: string) {
  return `
    <span resource="${uri}" typeof="mobiliteit:Variabele">
      <span property="dct:type" content="date"></span>
      <span property="ext:content" datatype="xsd:date">\${${name}}</span>
    </span>
  `;
}

export default async function includeVariables(
  html: string,
  variables: Variable[],
) {
  let finalHtml = html;
  for (const variable of variables) {
    if (variable.type === 'instruction') {
      continue;
    } else if (variable.type === 'codelist') {
      const codeList = await variable.codeList;
      const codeListUri = codeList?.uri;
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(variable.value)}}`,
        generateCodelistTemplate(
          unwrap(variable.uri),
          unwrap(variable.value),
          unwrap(codeListUri),
        ),
      );
    } else if (variable.type === 'location') {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(variable.value)}}`,
        generateLocationTemplate(unwrap(variable.uri), unwrap(variable.value)),
      );
    } else if (variable.type === 'date') {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(variable.value)}}`,
        generateDateTemplate(unwrap(variable.uri), unwrap(variable.value)),
      );
    } else {
      finalHtml = finalHtml.replaceAll(
        `\${${unwrap(variable.value)}}`,
        generateTextTemplate(unwrap(variable.uri), unwrap(variable.value)),
      );
    }
  }
  return finalHtml;
}
