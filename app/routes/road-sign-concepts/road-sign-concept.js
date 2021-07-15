import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConcept extends Route {
  @service store;

  async model(params) {
    let model = await hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      allSubSigns: this.store.query('road-sign-concept', {
        filter: {
          categories: {
            label: 'Onderbord',
          },
        },
        page: {
          size: 10000,
        },
      }),
      categories: this.store.findAll('road-sign-category').then((category) => {
        return category.filter(({ label }) => label !== 'Onderbord');
      }),
    });

    let relatedSubSigns = await model.roadSignConcept.subSigns;
    model.allSubSigns = model.allSubSigns.filter((subSign) => {
      return (
        subSign.id !== model.roadSignConcept.id &&
        !relatedSubSigns.includes(subSign)
      );
    });

    return model;
  }

  resetController(controller) {
    controller.reset();
  }
}
