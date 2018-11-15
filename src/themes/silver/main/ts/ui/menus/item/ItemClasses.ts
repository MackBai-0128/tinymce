import { Objects } from '@ephox/boulder';
import { Types } from '@ephox/bridge';

const navClass = 'tox-menu-nav__js';
const selectableClass = 'tox-collection__item';
const colorClass = 'tox-swatch';

const presetClasses = {
  normal: navClass,
  color: colorClass
};

const tickedClass = 'tox-collection__item--enabled';
const separatorClass = 'tox-collection__separator';
const groupHeadingClass = 'tox-collection__group-heading';
const iconClass = 'tox-collection__item-icon';
const textClass = 'tox-collection__item-label';
const accessoryClass = 'tox-collection__item-accessory';
const caretClass = 'tox-collection__item-caret';
const checkmarkClass = 'tox-collection__item-checkmark';
const activeClass = 'tox-collection__item--active';

const classForPreset = (presets: Types.PresetTypes): string => {
  return Objects.readOptFrom<string>(presetClasses, presets).getOr(navClass);
};

export {
  classForPreset,
  navClass,
  colorClass,

  activeClass,
  selectableClass,
  textClass,
  tickedClass,
  separatorClass,
  groupHeadingClass,
  iconClass,
  accessoryClass,
  caretClass,
  checkmarkClass
};