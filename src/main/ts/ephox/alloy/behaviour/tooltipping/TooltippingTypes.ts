import { BehaviourConfigSpec, BehaviourConfigDetail, AlloyBehaviour } from '../../api/behaviour/Behaviour';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { Result, Option } from '@ephox/katamari';
import { RawDomSchema } from '../../api/component/SpecTypes';
import { BehaviourState } from 'ephox/alloy/api/Main';

export interface TooltippingBehaviour extends AlloyBehaviour<TooltippingConfigSpec, TooltippingConfig> {
  hideAllExclusive(comp: AlloyComponent): void;
}

export interface TooltippingConfig extends BehaviourConfigDetail {
  // Make consistent with other lazy sinks.
  lazySink: () => (comp: AlloyComponent) => Result<AlloyComponent, any>;
  tooltipDom: () => RawDomSchema;
  exclusive: () => boolean;
  delay: () => number;
}

export interface TooltippingConfigSpec extends BehaviourConfigSpec {
  // Make consistent with other lazy sinks.
  lazySink: (comp: AlloyComponent) => Result<AlloyComponent, any>;
  tooltipDom: RawDomSchema;
  exclusive?: boolean;
  delay?: number;
}

export interface TooltippingState extends BehaviourState {
  getTooltip: () => Option<AlloyComponent>;
  setTooltip: (popup: AlloyComponent) => void;
  clearTooltip: () => void;
  clearTimer: () => void;
  resetTimer: (f: Function, delay: number) => void;
  isShowing: () => boolean;
}