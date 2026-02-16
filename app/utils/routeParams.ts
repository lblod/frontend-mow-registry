import type Route from '@ember/routing/route';

export type RouteParams<R extends Route> = Parameters<R['model']>[0];
