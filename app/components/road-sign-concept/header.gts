import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { executeCountQuery } from 'mow-registry/utils/sparql-utils';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuTabs from '@appuniversum/ember-appuniversum/components/au-tabs';
import t from 'ember-intl/helpers/t';
import ConfirmationModal from 'mow-registry/components/confirmation-modal';
import { Await } from '@warp-drive/ember';
import set from 'mow-registry/helpers/set';
import { and, not } from 'ember-truth-helpers';
import isSubSign from 'mow-registry/helpers/is-sub-sign';
import perform from 'ember-concurrency/helpers/perform';
import { on } from '@ember/modifier';

interface Signature {
  Args: {
    roadSignConcept: RoadSignConcept;
  };
}

export default class RoadSignConceptHeader extends Component<Signature> {
  @service declare router: RouterService;
  @service declare store: Store;
  @tracked isDeleteConfirmationOpen = false;

  countMeasuresUsingSign = async () => {
    const queryCount = `
    PREFIX mobiliteit: <https://data.vlaanderen.be/ns/mobiliteit#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    SELECT (count( DISTINCT ?id) as ?count)  WHERE {
      ?trafficMeasure 
        a mobiliteit:Mobiliteitmaatregelconcept ;
        mu:uuid ?id ;
        ^mobiliteit:heeftMaatregelconcept/mu:uuid """${this.args.roadSignConcept.id}""" .
    }
`;
    const countQuery = await executeCountQuery({
      query: queryCount,
      endpoint: '/raw-sparql',
    });
    return countQuery;
  };

  removeRoadSignConcept = task(
    async (roadSignConcept: RoadSignConcept, event: InputEvent) => {
      event.preventDefault();

      await roadSignConcept.destroyWithRelations();
      await this.router.transitionTo('road-sign-concepts');
    },
  );

  <template>
    <header ...attributes>
      <AuToolbar @size='large' as |Group|>
        <Group>
          <AuHeading @skin='2'>
            {{t 'road-sign-concept.details' label=@roadSignConcept.label}}
          </AuHeading>
        </Group>
        <Group>
          <AuLink
            @skin='button-secondary'
            @route='road-sign-concepts.edit'
            @model={{@roadSignConcept.id}}
            @icon='pencil'
          >
            {{t 'road-sign-concept.crud.edit'}}
          </AuLink>
          <AuButton
            @skin='secondary'
            @alert={{true}}
            @icon='trash'
            {{on 'click' (set this 'isDeleteConfirmationOpen' true)}}
          >
            {{t 'road-sign-concept.crud.delete'}}
          </AuButton>

          <ConfirmationModal
            @modalOpen={{this.isDeleteConfirmationOpen}}
            @onCancel={{set this 'isDeleteConfirmationOpen' false}}
            @onConfirm={{perform this.removeRoadSignConcept @roadSignConcept}}
            @isLoading={{this.removeRoadSignConcept.isRunning}}
            @isAlert={{true}}
            @confirmButtonText={{t 'road-sign-concept.crud.delete'}}
            @titleText={{t
              'road-sign-concept.crud.delete-confirmation-title'
              sign=@roadSignConcept.label
            }}
          >
            <:body>
              <p>
                {{t
                  'road-sign-concept.crud.delete-confirmation-content'
                  htmlSafe=true
                  sign=@roadSignConcept.label
                }}
              </p>
              <Await @promise={{(this.countMeasuresUsingSign)}}>
                <:success as |count|>
                  <p>
                    {{t
                      'road-sign-concept.crud.delete-confirmation-content-2'
                      count=count
                      htmlSafe=true
                    }}
                  </p>
                </:success>
              </Await>
            </:body>
          </ConfirmationModal>
        </Group>
      </AuToolbar>
      <AuTabs as |Tab|>
        <Tab>
          <AuLink @route='road-sign-concepts.road-sign-concept.instructions'>
            {{t 'utility.instructions'}}
          </AuLink>
        </Tab>
        <Tab>
          <AuLink @route='road-sign-concepts.road-sign-concept.variables'>
            {{t 'utility.variables'}}
          </AuLink>
        </Tab>
        <Tab>
          <AuLink @route='road-sign-concepts.road-sign-concept.shapes'>
            {{t 'utility.shapes'}}
          </AuLink>
        </Tab>
        {{#if
          (and (not @roadSignConcept.isDeleted) (isSubSign @roadSignConcept))
        }}
          <Tab>
            <AuLink @route='road-sign-concepts.road-sign-concept.main-signs'>
              {{t 'utility.main-signs'}}
            </AuLink>
          </Tab>
        {{else}}
          <Tab>
            <AuLink @route='road-sign-concepts.road-sign-concept.sub-signs'>
              {{t 'utility.sub-signs'}}
            </AuLink>
          </Tab>
        {{/if}}
        <Tab>
          <AuLink @route='road-sign-concepts.road-sign-concept.related'>
            {{t 'utility.related-traffic-signals'}}
          </AuLink>
        </Tab>
        <Tab>
          <AuLink @route='road-sign-concepts.road-sign-concept.can-contain'>
            {{t 'utility.can-contain-traffic-signals'}}
          </AuLink>
        </Tab>
      </AuTabs>
    </header>
  </template>
}
