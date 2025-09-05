import { Feature } from '../motion/features/Feature.mjs';
import { hover } from 'motion-dom';
import { extractEventInfo } from '../events/event-info.mjs';
import { frame } from '../frameloop/frame.mjs';

function handleHoverEvent(node, event, isActive) {
    const { props } = node;
    if (node.animationState && props.whileHover) {
        node.animationState.setActive("whileHover", isActive);
    }
    const callback = props[isActive ? "onHoverStart" : "onHoverEnd"];
    if (callback) {
        frame.postRender(() => callback(event, extractEventInfo(event)));
    }
}
class HoverGesture extends Feature {
    mount() {
        const { current, props } = this.node;
        if (!current)
            return;
        this.unmount = hover(current, (startEvent) => {
            handleHoverEvent(this.node, startEvent, true);
            return (endEvent) => handleHoverEvent(this.node, endEvent, false);
        }, { passive: !props.onHoverStart && !props.onHoverEnd });
    }
    unmount() { }
}

export { HoverGesture };
