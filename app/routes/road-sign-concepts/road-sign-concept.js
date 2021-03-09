import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConcept extends Route {
  @service store;

  async model(params) {
    const roadSignConcept = await this.store.findRecord(
      'road-sign-concept',
      params.id
    );

    const allSubSigns = await this.store
      .query('road-sign-concept', {
        filter: {
          categories: {
            label: 'Onderbord',
          },
        },
        page: {
          size: 10000,
        },
      })
      .then((subSigns) => {
        return subSigns.filter(
          (subSign) =>
            subSign.id !== roadSignConcept.id &&
            !roadSignConcept.subSigns.includes(subSign)
        );
      });
    return hash({
      roadSignConcept,
      allSubSigns,
      categories: this.store.findAll('road-sign-category').then((category) => {
        return category.filter(({ label }) => label !== 'Onderbord');
      }),
    });
  }

  resetController(controller) {
    controller.reset();
  }
}
