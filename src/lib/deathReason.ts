/**
 * Player-facing flavour text for each death cause, shown on the respawn
 * overlay. Keyed off the `deathReason` string the store records on the
 * killing hit (see `useGameStore.takeDamage`).
 */
export function deathReasonText(reason: string | null): string {
  switch (reason) {
    case 'tram':
      return 'A tram ploughed through you'
    case 'car':
      return 'A car ran you down'
    case 'bike':
      return 'A cyclist took you out'
    case 'water':
      return 'You drowned in the gracht'
    case 'shot':
      return 'You got gunned down'
    case 'sword':
      return 'You got skewered'
    default:
      return 'You went down'
  }
}
