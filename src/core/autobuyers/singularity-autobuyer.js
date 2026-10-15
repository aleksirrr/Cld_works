import { AutobuyerState } from "./autobuyer";

export class SingularityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singularity;
  }

  get name() {
    return `Singularity`;
  }

  get color() {
    return `var(--color-laitela--accent)`;
  }

  get isUnlocked() {
    return SingularityMilestone.autoCondense.canBeApplied;
  }

  get bulk() {
    return Singularity.singularitiesGained;
  }

  tick() {
    if (DivinityMilestone.hadronEmpowerment.isReached ||
        Currency.darkEnergy.value.gte(Singularity.cap.times(SingularityMilestone.autoCondense.effectValue))) {
      Singularity.perform();
    }
  }
}
