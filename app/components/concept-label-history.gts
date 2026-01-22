import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import AuAccordion from '@appuniversum/ember-appuniversum/components/au-accordion';
import Store from 'mow-registry/services/store';
import type ConceptLabelChangeNote from 'mow-registry/models/concept-label-change-note';
import { query } from '@warp-drive/legacy/compat/builders';
import { format } from 'date-fns';
import ReactiveTable from 'mow-registry/components/reactive-table';
import { cached } from '@glimmer/tracking';
import { getPromiseState } from '@warp-drive/ember';
import type SkosConcept from 'mow-registry/models/skos-concept';

type Sig = {
  Args: {
    concept: SkosConcept;
  };
};

export default class ConceptLabelHistory extends Component<Sig> {
  @service declare store: Store;

  @tracked page = 0;
  pageSize = 5;

  changePage = (newPage) => {
    this.page = newPage;
  };

  @cached
  get conceptHistory() {
    return getPromiseState(
      (async () => {
        const conceptUri = this.args.concept.uri;
        const pageNumber = this.page;
        await Promise.resolve();
        const queryRequest = await this.store.request(
          query<ConceptLabelChangeNote>('concept-label-change-note', {
            filter: {
              concept: {
                ':uri:': conceptUri,
              },
            },
            page: {
              size: this.pageSize,
              number: pageNumber,
            },
            sort: '-created-on',
          }),
        );
        return queryRequest.content;
      })(),
    );
  }

  <template>
    <AuAccordion
      class='au-u-padding-bottom-none'
      @loading={{this.conceptHistory.isPending}}
      @buttonLabel={{t 'codelist.crud.previous-changes'}}
      @reverse={{true}}
    >
      <ReactiveTable
        @content={{this.conceptHistory.value}}
        @isLoading={{this.conceptHistory.isPending}}
        @noDataMessage={{t 'codelist.crud.no-changes'}}
        @page={{this.page}}
        @pageSize={{this.pageSize}}
        @onPageChange={{this.changePage}}
      >
        <:header>
          <th>{{t 'utility.date'}}</th>
          <th>{{t 'codelist.crud.reason-for-change'}}</th>
          <th>{{t 'codelist.crud.previous-value'}}</th>
        </:header>
        <:body as |historyItem|>
          <td>
            {{format historyItem.createdOn 'dd-MM-yyyy hh:mm'}}
          </td>
          <td>
            {{historyItem.value}}
          </td>
          <td>
            {{historyItem.previousConceptLabel}}
          </td>
        </:body>
      </ReactiveTable>
    </AuAccordion>
  </template>
}
