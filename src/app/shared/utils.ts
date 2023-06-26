import {Pull} from "../core/model/pull";

export class Utils {

  public static lastPity(pulls: Pull[], rank: number): number {
    let pity = pulls.findIndex(p => p.rank_type == rank) + 1;
    if (pity < 0) {
      return pulls.length
    }
    return pity
  }

  public static lastPityFrom(pulls: Pull[], rank: number, index: number): number {
    const pity = pulls.slice(index + 1).findIndex(p => p.rank_type === rank);
    if (pity < 0) {
      return pulls.slice(index + 1).length;
    }
    return pity + 1;
  }


  public static redGradiate(pity: number, max=90) {
    const hue = ((1 - pity / max) * 120).toString(10);
    return ['hsl(', hue, ",100%,50%)"].join("");
  }
}
