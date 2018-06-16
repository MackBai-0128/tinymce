
import { EventHandlerConfig, derive, EventHandlerConfigRecord } from '../events/AlloyEvents';
import { FieldSchema } from '@ephox/boulder';
import { Fun } from '@ephox/katamari';
import { create as createBehaviour, ConfiguredBehaviour, AlloyBehaviour, NamedConfiguredBehaviour } from './Behaviour';
import { EventFormat } from '../../events/SimulatedEvent';
import { NoState } from 'ephox/alloy/behaviour/common/BehaviourState';

const events = (name: string, eventHandlers: EventHandlerConfig<EventFormat>[]): AlloyBehaviour => {
  const events: EventHandlerConfigRecord = derive(eventHandlers);

  return createBehaviour({
    fields: [
      FieldSchema.strict('enabled')
    ],
    name,
    active: {
      events: Fun.constant(events)
    }
  });
};

const config = (name: string, eventHandlers: Array<EventHandlerConfig<EventFormat>>): NamedConfiguredBehaviour => {
  const me = events(name, eventHandlers);
  return {
    key: name,
    value: {
      config: { },
      me,
      configAsRaw: Fun.constant({ }),
      initialConfig: { },
      state: NoState
    }
  };
};

export {
  events,
  config
};