import { PERSONAL_ALLOWANCE, ALLOWANCE_LOSS_THRESHOLD, ALLOWANCE_LOSS_LIMIT } from './taxConstants';

export function calculatePersonalAllowance(income: number): number {
  if (income <= ALLOWANCE_LOSS_THRESHOLD) {
    return PERSONAL_ALLOWANCE;
  } else if (income <= ALLOWANCE_LOSS_LIMIT) {
    return PERSONAL_ALLOWANCE - ((income - ALLOWANCE_LOSS_THRESHOLD) / 2);
  } else {
    return 0;
  }
}