import type RoadSignConcept from 'mow-registry/models/road-sign-concept';

export default function isSubSign(roadSignConcept: RoadSignConcept): boolean {
  const classifications =
    roadSignConcept.hasMany('classifications').value() || [];

  return (
    classifications.filter((classification) => {
      // TODO: use a uri or id instead of the label
      return classification.label === 'Onderbord';
    }).length === 1
  );
}
