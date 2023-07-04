const mapping: Record<string, string> = {
  renamedcases: 'Renamedcase',
  lawfirms: 'lawfirm',
  'similar-cases': 'similar_case',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
