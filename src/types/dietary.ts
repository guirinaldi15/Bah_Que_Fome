export type DietaryRestriction =
  | 'lactose'
  | 'gluten'
  | 'vegetarian'
  | 'vegan'
  | 'peanut'
  | 'other';

export const DIETARY_OPTIONS: {
  value: DietaryRestriction;
  label: string;
}[] = [
  { value: 'lactose', label: 'Intolerância à lactose' },
  { value: 'gluten', label: 'Restrição ao glúten' },
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'vegan', label: 'Vegano' },
  { value: 'peanut', label: 'Alergia a amendoim' },
  { value: 'other', label: 'Outras alergias ou restrições' },
];