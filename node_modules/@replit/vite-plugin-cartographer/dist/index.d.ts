import { Plugin } from 'vite';

declare function cartographer(): Plugin;

interface ElementMetadata {
    elementPath: string;
    elementName: string;
    textContent: string;
    originalTextContent?: string;
    screenshotBlob?: Blob;
    srcAttribute?: string;
    siblingCount?: number;
    hasChildElements?: boolean;
    id?: string;
    className?: string;
    computedStyles: {
        backgroundColor: string;
        color: string;
        display: string;
        position: string;
        width: string;
        height: string;
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        margin: string;
        padding: string;
        textAlign: string;
    };
    relatedElements: {
        parent?: RelatedElement;
        nextSibling?: RelatedElement;
        grandParent?: RelatedElement;
    };
}
type RelatedElement = {
    tagName: string;
    className?: string;
    textContent?: string;
    id?: string;
};
type Message = {
    type: 'TOGGLE_REPLIT_VISUAL_EDITOR';
    timestamp: number;
    enabled: boolean;
    enableEditing?: boolean;
} | {
    type: 'REPLIT_VISUAL_EDITOR_ENABLED';
    timestamp: number;
} | {
    type: 'REPLIT_VISUAL_EDITOR_DISABLED';
    timestamp: number;
} | {
    type: 'ELEMENT_SELECTED';
    payload: ElementMetadata;
    timestamp: number;
} | {
    type: 'ELEMENT_UNSELECTED';
    timestamp: number;
} | {
    type: 'ELEMENT_TEXT_CHANGED';
    payload: ElementMetadata;
    timestamp: number;
} | {
    type: 'SELECTOR_SCRIPT_LOADED';
    timestamp: number;
    version: string;
} | {
    type: 'CLEAR_SELECTION';
    timestamp: number;
} | {
    type: 'UPDATE_SELECTED_ELEMENT';
    timestamp: number;
    attributes: {
        style?: string;
        textContent?: string;
        className?: string;
        src?: string;
    };
} | {
    type: 'CLEAR_ELEMENT_DIRTY';
    timestamp: number;
} | {
    type: 'APPLY_THEME_PREVIEW';
    timestamp: number;
    themeContent: string;
} | {
    type: 'CLEAR_THEME_PREVIEW';
    timestamp: number;
};

var version = "0.3.0";

export { type ElementMetadata, type Message, cartographer, version };
