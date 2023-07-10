import {Pull} from '../core/model/pull';

export class Utils {

  public static lastPityFrom(pulls: Pull[], pull: Pull): number {
    pulls = pulls.filter(p => p.gacha_type === pull.gacha_type).sort((a: Pull, b: Pull) => b.id - a.id);
    const index = pulls.indexOf(pull);
    const rank = pull.rank_type;
    const pity = pulls.slice(index + 1).findIndex(p => p.rank_type === rank);
    if (pity < 0) {
      return pulls.slice(index + 1).length;
    }
    return pity + 1;
  }


  public static redGradiate(pity: number, max = 90) {
    const hue = ((1 - pity / max) * 120).toString(10);
    return ['hsl(', hue, ',100%,50%)'].join('');
  }
}
