'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var avatars = require('@dicebear/avatars');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src/components/Icon.svelte generated by Svelte v3.29.4 */

function create_if_block_4(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "stroke-linecap", "round");
			attr(path, "stroke-linejoin", "round");
			attr(path, "stroke-width", "2");
			attr(path, "d", "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (21:2) {#if name === 'download'}
function create_if_block_3(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "stroke-linecap", "round");
			attr(path, "stroke-linejoin", "round");
			attr(path, "stroke-width", "2");
			attr(path, "d", "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (29:2) {#if name === 'chevron-left'}
function create_if_block_2(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "stroke-linecap", "round");
			attr(path, "stroke-linejoin", "round");
			attr(path, "stroke-width", "2");
			attr(path, "d", "M15 19l-7-7 7-7");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (33:2) {#if name === 'chevron-right'}
function create_if_block_1(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "stroke-linecap", "round");
			attr(path, "stroke-linejoin", "round");
			attr(path, "stroke-width", "2");
			attr(path, "d", "M9 5l7 7-7 7");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (37:2) {#if name === 'check'}
function create_if_block(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "stroke-linecap", "round");
			attr(path, "stroke-linejoin", "round");
			attr(path, "stroke-width", "2");
			attr(path, "d", "M5 13l4 4L19 7");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment(ctx) {
	let svg;
	let if_block0_anchor;
	let if_block1_anchor;
	let if_block2_anchor;
	let if_block3_anchor;
	let if_block0 = /*name*/ ctx[0] === "refresh" && create_if_block_4();
	let if_block1 = /*name*/ ctx[0] === "download" && create_if_block_3();
	let if_block2 = /*name*/ ctx[0] === "chevron-left" && create_if_block_2();
	let if_block3 = /*name*/ ctx[0] === "chevron-right" && create_if_block_1();
	let if_block4 = /*name*/ ctx[0] === "check" && create_if_block();

	return {
		c() {
			svg = svg_element("svg");
			if (if_block0) if_block0.c();
			if_block0_anchor = empty();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			if (if_block4) if_block4.c();
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "fill", "none");
			attr(svg, "viewBox", "0 0 24 24");
			attr(svg, "stroke", "currentColor");
			attr(svg, "width", /*size*/ ctx[1]);
			attr(svg, "height", /*size*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			if (if_block0) if_block0.m(svg, null);
			append(svg, if_block0_anchor);
			if (if_block1) if_block1.m(svg, null);
			append(svg, if_block1_anchor);
			if (if_block2) if_block2.m(svg, null);
			append(svg, if_block2_anchor);
			if (if_block3) if_block3.m(svg, null);
			append(svg, if_block3_anchor);
			if (if_block4) if_block4.m(svg, null);
		},
		p(ctx, [dirty]) {
			if (/*name*/ ctx[0] === "refresh") {
				if (if_block0) ; else {
					if_block0 = create_if_block_4();
					if_block0.c();
					if_block0.m(svg, if_block0_anchor);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*name*/ ctx[0] === "download") {
				if (if_block1) ; else {
					if_block1 = create_if_block_3();
					if_block1.c();
					if_block1.m(svg, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*name*/ ctx[0] === "chevron-left") {
				if (if_block2) ; else {
					if_block2 = create_if_block_2();
					if_block2.c();
					if_block2.m(svg, if_block2_anchor);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*name*/ ctx[0] === "chevron-right") {
				if (if_block3) ; else {
					if_block3 = create_if_block_1();
					if_block3.c();
					if_block3.m(svg, if_block3_anchor);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (/*name*/ ctx[0] === "check") {
				if (if_block4) ; else {
					if_block4 = create_if_block();
					if_block4.c();
					if_block4.m(svg, null);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (dirty & /*size*/ 2) {
				attr(svg, "width", /*size*/ ctx[1]);
			}

			if (dirty & /*size*/ 2) {
				attr(svg, "height", /*size*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(svg);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	
	let { name } = $$props;
	let { size = 24 } = $$props;

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("size" in $$props) $$invalidate(1, size = $$props.size);
	};

	return [name, size];
}

class Icon extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { name: 0, size: 1 });
	}
}

/* src/components/Button.svelte generated by Svelte v3.29.4 */

function add_css() {
	var style = element("style");
	style.id = "svelte-z2m585-style";
	style.textContent = "button.svelte-z2m585{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button.svelte-z2m585{overflow:visible}button.svelte-z2m585{text-transform:none}button.svelte-z2m585{-webkit-appearance:button}button.svelte-z2m585::-moz-focus-inner{border-style:none;padding:0}button.svelte-z2m585:-moz-focusring{outline:1px dotted ButtonText}button.svelte-z2m585{background-color:transparent;background-image:none}button.svelte-z2m585:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.svelte-z2m585,.svelte-z2m585::before,.svelte-z2m585::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}button.svelte-z2m585{cursor:pointer}button.svelte-z2m585{padding:0;line-height:inherit;color:inherit}.bg-white.svelte-z2m585{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.hover\\:bg-gray-900.svelte-z2m585:hover{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26, 32, 44, var(--bg-opacity))}.rounded.svelte-z2m585{border-radius:0.25rem}.inline-flex.svelte-z2m585{display:inline-flex}.items-center.svelte-z2m585{align-items:center}.justify-center.svelte-z2m585{justify-content:center}.h-10.svelte-z2m585{height:2.5rem}.focus\\:outline-none.svelte-z2m585:focus{outline:2px solid transparent;outline-offset:2px}.px-4.svelte-z2m585{padding-left:1rem;padding-right:1rem}.shadow-md.svelte-z2m585{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.hover\\:text-white.svelte-z2m585:hover{--text-opacity:1;color:#fff;color:rgba(255, 255, 255, var(--text-opacity))}.w-10.svelte-z2m585{width:2.5rem}@keyframes svelte-z2m585-spin{to{transform:rotate(360deg)}}@keyframes svelte-z2m585-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-z2m585-pulse{50%{opacity:.5}}@keyframes svelte-z2m585-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}";
	append(document.head, style);
}

// (840:2) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 4) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (838:2) {#if icon}
function create_if_block$1(ctx) {
	let icon_1;
	let current;
	icon_1 = new Icon({ props: { name: /*icon*/ ctx[0] } });

	return {
		c() {
			create_component(icon_1.$$.fragment);
		},
		m(target, anchor) {
			mount_component(icon_1, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const icon_1_changes = {};
			if (dirty & /*icon*/ 1) icon_1_changes.name = /*icon*/ ctx[0];
			icon_1.$set(icon_1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(icon_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(icon_1, detaching);
		}
	};
}

function create_fragment$1(ctx) {
	let button;
	let current_block_type_index;
	let if_block;
	let button_class_value;
	let current;
	let mounted;
	let dispose;
	const if_block_creators = [create_if_block$1, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*icon*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			button = element("button");
			if_block.c();
			attr(button, "class", button_class_value = "inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 " + (/*icon*/ ctx[0] ? "w-10" : "px-4") + " shadow-md focus:outline-none" + " svelte-z2m585");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			if_blocks[current_block_type_index].m(button, null);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(button, null);
			}

			if (!current || dirty & /*icon*/ 1 && button_class_value !== (button_class_value = "inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 " + (/*icon*/ ctx[0] ? "w-10" : "px-4") + " shadow-md focus:outline-none" + " svelte-z2m585")) {
				attr(button, "class", button_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			if_blocks[current_block_type_index].d();
			mounted = false;
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	
	let { icon = undefined } = $$props;
	const dispatch = createEventDispatcher();
	const click_handler = () => dispatch("click");

	$$self.$$set = $$props => {
		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [icon, dispatch, $$scope, slots, click_handler];
}

class Button extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-z2m585-style")) add_css();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { icon: 0 });
	}
}

/* src/components/scenes/Form/Deterministic.svelte generated by Svelte v3.29.4 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-7c2a2-style";
	style.textContent = "@keyframes svelte-7c2a2-spin{{transform:rotate(360deg)}}@keyframes svelte-7c2a2-ping{{transform:scale(2);opacity:0}}@keyframes svelte-7c2a2-pulse{{opacity:.5}}@keyframes svelte-7c2a2-bounce{{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}";
	append(document.head, style);
}

function create_fragment$2(ctx) {
	let t;

	return {
		c() {
			t = text("Deterministic");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

class Deterministic extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-7c2a2-style")) add_css$1();
		init(this, options, null, create_fragment$2, safe_not_equal, {});
	}
}

/* src/components/scenes/Form/Creator.svelte generated by Svelte v3.29.4 */

function add_css$2() {
	var style = element("style");
	style.id = "svelte-1nedhoc-style";
	style.textContent = "@keyframes svelte-1nedhoc-spin{{transform:rotate(360deg)}}@keyframes svelte-1nedhoc-ping{{transform:scale(2);opacity:0}}@keyframes svelte-1nedhoc-pulse{{opacity:.5}}@keyframes svelte-1nedhoc-bounce{{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}";
	append(document.head, style);
}

function create_fragment$3(ctx) {
	let t;

	return {
		c() {
			t = text("Creator");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

class Creator extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1nedhoc-style")) add_css$2();
		init(this, options, null, create_fragment$3, safe_not_equal, {});
	}
}

/* src/components/scenes/Form.svelte generated by Svelte v3.29.4 */

function add_css$3() {
	var style = element("style");
	style.id = "svelte-1mygurt-style";
	style.textContent = ".svelte-1mygurt,.svelte-1mygurt::before,.svelte-1mygurt::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}.pt-16.svelte-1mygurt{padding-top:4rem}@keyframes svelte-1mygurt-spin{to{transform:rotate(360deg)}}@keyframes svelte-1mygurt-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-1mygurt-pulse{50%{opacity:.5}}@keyframes svelte-1mygurt-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}";
	append(document.head, style);
}

// (838:47) 
function create_if_block_1$1(ctx) {
	let deterministic;
	let current;
	deterministic = new Deterministic({});

	return {
		c() {
			create_component(deterministic.$$.fragment);
		},
		m(target, anchor) {
			mount_component(deterministic, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(deterministic.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(deterministic.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(deterministic, detaching);
		}
	};
}

// (836:2) {#if ctx.mode.get() === 'creator'}
function create_if_block$2(ctx) {
	let creator;
	let current;
	creator = new Creator({});

	return {
		c() {
			create_component(creator.$$.fragment);
		},
		m(target, anchor) {
			mount_component(creator, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(creator.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(creator.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(creator, detaching);
		}
	};
}

function create_fragment$4(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block$2, create_if_block_1$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*ctx*/ ctx[0].mode.get() === "creator") return 0;
		if (/*ctx*/ ctx[0].mode.get() === "deterministic") return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			attr(div, "class", "pt-16 svelte-1mygurt");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}
		}
	};
}

function instance$2($$self) {
	
	const ctx = getContext("ctx");
	return [ctx];
}

class Form extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1mygurt-style")) add_css$3();
		init(this, options, instance$2, create_fragment$4, safe_not_equal, {});
	}
}

/* src/components/scenes/Mode.svelte generated by Svelte v3.29.4 */

function add_css$4() {
	var style = element("style");
	style.id = "svelte-t1vaam-style";
	style.textContent = "h2.svelte-t1vaam,p.svelte-t1vaam{margin:0}.svelte-t1vaam,.svelte-t1vaam::before,.svelte-t1vaam::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}h2.svelte-t1vaam{font-size:inherit;font-weight:inherit}.bg-gray-100.svelte-t1vaam{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247, 250, 252, var(--bg-opacity))}.rounded.svelte-t1vaam{border-radius:0.25rem}.flex.svelte-t1vaam{display:flex}.grid.svelte-t1vaam{display:grid}.flex-col.svelte-t1vaam{flex-direction:column}.flex-grow.svelte-t1vaam{flex-grow:1}.text-xl.svelte-t1vaam{font-size:1.25rem;line-height:1.75rem}.mb-6.svelte-t1vaam{margin-bottom:1.5rem}.mb-8.svelte-t1vaam{margin-bottom:2rem}.p-6.svelte-t1vaam{padding:1.5rem}.text-center.svelte-t1vaam{text-align:center}.text-gray-600.svelte-t1vaam{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.text-gray-700.svelte-t1vaam{--text-opacity:1;color:#4a5568;color:rgba(74, 85, 104, var(--text-opacity))}.capitalize.svelte-t1vaam{text-transform:capitalize}.gap-6.svelte-t1vaam{grid-gap:1.5rem;gap:1.5rem}.grid-cols-cards.svelte-t1vaam{grid-template-columns:repeat(auto-fill, minmax(240px, 1fr))}@keyframes svelte-t1vaam-spin{to{transform:rotate(360deg)}}@keyframes svelte-t1vaam-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-t1vaam-pulse{50%{opacity:.5}}@keyframes svelte-t1vaam-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){.sm\\:gap-8.svelte-t1vaam{grid-gap:2rem;gap:2rem}}@media(min-width: 768px){.md\\:gap-10.svelte-t1vaam{grid-gap:2.5rem;gap:2.5rem}}@media(min-width: 1024px){.lg\\:gap-12.svelte-t1vaam{grid-gap:3rem;gap:3rem}}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (842:43) 
function create_if_block_1$2(ctx) {
	let t_value = /*ctx*/ ctx[1].i18n.get("deterministicModeDescription") + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (840:8) {#if mode === 'creator'}
function create_if_block$3(ctx) {
	let t_value = /*ctx*/ ctx[1].i18n.get("creatorModeDescription") + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (845:8) <Button on:click={() => ctx.mode.set(mode)}>
function create_default_slot(ctx) {
	let t;

	return {
		c() {
			t = text("Select");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (836:2) {#each modes as mode}
function create_each_block(ctx) {
	let div1;
	let h2;
	let t0_value = /*mode*/ ctx[3] + "";
	let t0;
	let t1;
	let p;
	let t2;
	let div0;
	let button;
	let t3;
	let current;

	function select_block_type(ctx, dirty) {
		if (/*mode*/ ctx[3] === "creator") return create_if_block$3;
		if (/*mode*/ ctx[3] === "deterministic") return create_if_block_1$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	function click_handler(...args) {
		return /*click_handler*/ ctx[2](/*mode*/ ctx[3], ...args);
	}

	button = new Button({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	button.$on("click", click_handler);

	return {
		c() {
			div1 = element("div");
			h2 = element("h2");
			t0 = text(t0_value);
			t1 = space();
			p = element("p");
			if (if_block) if_block.c();
			t2 = space();
			div0 = element("div");
			create_component(button.$$.fragment);
			t3 = space();
			attr(h2, "class", "text-xl mb-6 text-gray-700 capitalize svelte-t1vaam");
			attr(p, "class", "text-gray-600 mb-8 flex-grow svelte-t1vaam");
			attr(div0, "class", "text-center svelte-t1vaam");
			attr(div1, "class", "p-6 bg-gray-100 text-center rounded flex flex-col svelte-t1vaam");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, h2);
			append(h2, t0);
			append(div1, t1);
			append(div1, p);
			if (if_block) if_block.m(p, null);
			append(div1, t2);
			append(div1, div0);
			mount_component(button, div0, null);
			append(div1, t3);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*modes*/ 1) && t0_value !== (t0_value = /*mode*/ ctx[3] + "")) set_data(t0, t0_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(p, null);
				}
			}

			const button_changes = {};

			if (dirty & /*$$scope*/ 64) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);

			if (if_block) {
				if_block.d();
			}

			destroy_component(button);
		}
	};
}

function create_fragment$5(ctx) {
	let div;
	let current;
	let each_value = /*modes*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "grid grid-cols-cards gap-6 sm:gap-8 md:gap-10 lg:gap-12 svelte-t1vaam");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*ctx, modes*/ 3) {
				each_value = /*modes*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	
	let { modes } = $$props;
	let ctx = getContext("ctx");
	const click_handler = mode => ctx.mode.set(mode);

	$$self.$$set = $$props => {
		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
	};

	return [modes, ctx, click_handler];
}

class Mode extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-t1vaam-style")) add_css$4();
		init(this, options, instance$3, create_fragment$5, safe_not_equal, { modes: 0 });
	}
}

/* src/components/scenes/Style.svelte generated by Svelte v3.29.4 */

function add_css$5() {
	var style = element("style");
	style.id = "svelte-158th4q-style";
	style.textContent = ".svelte-158th4q,.svelte-158th4q::before,.svelte-158th4q::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes svelte-158th4q-spin{to{transform:rotate(360deg)}}@keyframes svelte-158th4q-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-158th4q-pulse{50%{opacity:.5}}@keyframes svelte-158th4q-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}";
	append(document.head, style);
}

function create_fragment$6(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Style";
			attr(div, "class", "svelte-158th4q");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

class Style extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-158th4q-style")) add_css$5();
		init(this, options, null, create_fragment$6, safe_not_equal, {});
	}
}

var locales = {
  en_US: {
    modeHeadline: 'Choose a mode',
    styleHeadline: 'Choose a style',
    creatorModeDescription: 'Create a individual avatar piece by piece.',
    deterministicModeDescription: 'Create deterministic avatars from a seed.'
  }
};

function getPossibleScenes(modes, styles) {
  var scenes = [];

  if (modes.length > 1) {
    scenes.push('mode');
  }

  if (Object.keys(styles).length > 1) {
    scenes.push('style');
  }

  scenes.push('form');
  return scenes;
}
function getBackScene(modes, styles, scene) {
  var possibleScenes = getPossibleScenes(modes, styles);
  var currentSceneIndex = possibleScenes.indexOf(scene);
  return currentSceneIndex === 0 ? undefined : possibleScenes[currentSceneIndex - 1];
}

function createPreviewAvatar(style, options) {
  return avatars.createAvatar(style, Object.assign(Object.assign({}, options), {
    width: undefined,
    height: undefined,
    dataUri: true
  }));
}

/* src/components/App.svelte generated by Svelte v3.29.4 */

function add_css$6() {
	var style = element("style");
	style.id = "svelte-s48hr4-style";
	style.textContent = "h1.svelte-s48hr4{font-size:2em;margin:0.67em 0}a.svelte-s48hr4{background-color:transparent}img.svelte-s48hr4{border-style:none}h1.svelte-s48hr4,p.svelte-s48hr4{margin:0}.svelte-s48hr4,.svelte-s48hr4::before,.svelte-s48hr4::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}img.svelte-s48hr4{border-style:solid}h1.svelte-s48hr4{font-size:inherit;font-weight:inherit}a.svelte-s48hr4{color:inherit;text-decoration:inherit}img.svelte-s48hr4{display:block;vertical-align:middle}img.svelte-s48hr4{max-width:100%;height:auto}.bg-white.svelte-s48hr4{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.bg-gray-200.svelte-s48hr4{--bg-opacity:1;background-color:#edf2f7;background-color:rgba(237, 242, 247, var(--bg-opacity))}.border-white.svelte-s48hr4{--border-opacity:1;border-color:#fff;border-color:rgba(255, 255, 255, var(--border-opacity))}.border-gray-200.svelte-s48hr4{--border-opacity:1;border-color:#edf2f7;border-color:rgba(237, 242, 247, var(--border-opacity))}.rounded.svelte-s48hr4{border-radius:0.25rem}.rounded-lg.svelte-s48hr4{border-radius:0.5rem}.border-2.svelte-s48hr4{border-width:2px}.border-8.svelte-s48hr4{border-width:8px}.inline-block.svelte-s48hr4{display:inline-block}.flex.svelte-s48hr4{display:flex}.items-center.svelte-s48hr4{align-items:center}.self-start.svelte-s48hr4{align-self:flex-start}.justify-end.svelte-s48hr4{justify-content:flex-end}.justify-center.svelte-s48hr4{justify-content:center}.font-semibold.svelte-s48hr4{font-weight:600}.h-10.svelte-s48hr4{height:2.5rem}.h-16.svelte-s48hr4{height:4rem}.h-auto.svelte-s48hr4{height:auto}.text-xs.svelte-s48hr4{font-size:0.75rem;line-height:1rem}.text-2xl.svelte-s48hr4{font-size:1.5rem;line-height:2rem}.mr-2.svelte-s48hr4{margin-right:0.5rem}.mb-2.svelte-s48hr4{margin-bottom:0.5rem}.ml-2.svelte-s48hr4{margin-left:0.5rem}.-mb-16.svelte-s48hr4{margin-bottom:-4rem}.max-w-full.svelte-s48hr4{max-width:100%}.overflow-hidden.svelte-s48hr4{overflow:hidden}.p-6.svelte-s48hr4{padding:1.5rem}.pt-1.svelte-s48hr4{padding-top:0.25rem}.pr-2.svelte-s48hr4{padding-right:0.5rem}.absolute.svelte-s48hr4{position:absolute}.relative.svelte-s48hr4{position:relative}.top-0.svelte-s48hr4{top:0}.right-0.svelte-s48hr4{right:0}.left-0.svelte-s48hr4{left:0}.shadow-md.svelte-s48hr4{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.text-center.svelte-s48hr4{text-align:center}.text-right.svelte-s48hr4{text-align:right}.text-gray-400.svelte-s48hr4{--text-opacity:1;color:#cbd5e0;color:rgba(203, 213, 224, var(--text-opacity))}.text-gray-600.svelte-s48hr4{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.hover\\:underline.svelte-s48hr4:hover{text-decoration:underline}.whitespace-no-wrap.svelte-s48hr4{white-space:nowrap}.w-32.svelte-s48hr4{width:8rem}.w-1\\/3.svelte-s48hr4{width:33.333333%}.z-10.svelte-s48hr4{z-index:10}.ease-out.svelte-s48hr4{transition-timing-function:cubic-bezier(0, 0, 0.2, 1)}.duration-150.svelte-s48hr4{transition-duration:150ms}@keyframes svelte-s48hr4-spin{to{transform:rotate(360deg)}}@keyframes svelte-s48hr4-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-s48hr4-pulse{50%{opacity:.5}}@keyframes svelte-s48hr4-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}.bg-transparent-shape.svelte-s48hr4{background-image:url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22white%22%2F%3E%0A%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3C%2Fsvg%3E%0A)}@media(min-width: 640px){.sm\\:p-8.svelte-s48hr4{padding:2rem}}@media(min-width: 768px){.md\\:p-10.svelte-s48hr4{padding:2.5rem}}@media(min-width: 1024px){.lg\\:p-12.svelte-s48hr4{padding:3rem}}";
	append(document.head, style);
}

// (898:6) {#if backScene}
function create_if_block_7(ctx) {
	let div;
	let button;
	let current;
	button = new Button({ props: { icon: "chevron-left" } });
	button.$on("click", /*click_handler*/ ctx[8]);

	return {
		c() {
			div = element("div");
			create_component(button.$$.fragment);
			attr(div, "class", "mr-2 svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(button, div, null);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(button);
		}
	};
}

// (909:33) 
function create_if_block_6(ctx) {
	let div;
	let img;
	let img_src_value;

	return {
		c() {
			div = element("div");
			img = element("img");
			if (img.src !== (img_src_value = /*avatar*/ ctx[3])) attr(img, "src", img_src_value);
			attr(img, "class", "w-32 h-auto max-w-full -mb-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape z-10 relative svelte-s48hr4");
			attr(img, "alt", "Your Avatar");
			attr(div, "class", "text-center left-0 right-0 self-start svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, img);
		},
		p(ctx, dirty) {
			if (dirty & /*avatar*/ 8 && img.src !== (img_src_value = /*avatar*/ ctx[3])) {
				attr(img, "src", img_src_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (907:34) 
function create_if_block_5(ctx) {
	let h1;

	return {
		c() {
			h1 = element("h1");
			h1.textContent = `${/*ctx*/ ctx[6].i18n.get("styleHeadline")}`;
			attr(h1, "class", "text-2xl text-gray-600 mb-2 svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(h1);
		}
	};
}

// (905:6) {#if scene === 'mode'}
function create_if_block_4$1(ctx) {
	let h1;

	return {
		c() {
			h1 = element("h1");
			h1.textContent = `${/*ctx*/ ctx[6].i18n.get("modeHeadline")}`;
			attr(h1, "class", "text-2xl text-gray-600 mb-2 svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(h1);
		}
	};
}

// (919:6) {#if scene === 'form'}
function create_if_block_3$1(ctx) {
	let div0;
	let button0;
	let t;
	let div1;
	let button1;
	let current;
	button0 = new Button({ props: { icon: "refresh" } });
	button1 = new Button({ props: { icon: "download" } });

	return {
		c() {
			div0 = element("div");
			create_component(button0.$$.fragment);
			t = space();
			div1 = element("div");
			create_component(button1.$$.fragment);
			attr(div0, "class", "ml-2 svelte-s48hr4");
			attr(div1, "class", "ml-2 svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			mount_component(button0, div0, null);
			insert(target, t, anchor);
			insert(target, div1, anchor);
			mount_component(button1, div1, null);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div0);
			destroy_component(button0);
			if (detaching) detach(t);
			if (detaching) detach(div1);
			destroy_component(button1);
		}
	};
}

// (939:37) 
function create_if_block_2$1(ctx) {
	let formscene;
	let current;
	formscene = new Form({});

	return {
		c() {
			create_component(formscene.$$.fragment);
		},
		m(target, anchor) {
			mount_component(formscene, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(formscene.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(formscene.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(formscene, detaching);
		}
	};
}

// (937:38) 
function create_if_block_1$3(ctx) {
	let stylescene;
	let current;
	stylescene = new Style({});

	return {
		c() {
			create_component(stylescene.$$.fragment);
		},
		m(target, anchor) {
			mount_component(stylescene, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(stylescene.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(stylescene.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(stylescene, detaching);
		}
	};
}

// (935:10) {#if scene === 'mode'}
function create_if_block$4(ctx) {
	let modescene;
	let current;
	modescene = new Mode({ props: { modes: /*modes*/ ctx[5] } });

	return {
		c() {
			create_component(modescene.$$.fragment);
		},
		m(target, anchor) {
			mount_component(modescene, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(modescene.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(modescene.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(modescene, detaching);
		}
	};
}

// (933:6) {#key scene}
function create_key_block(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let div_resize_listener;
	let current;
	const if_block_creators = [create_if_block$4, create_if_block_1$3, create_if_block_2$1];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*scene*/ ctx[0] === "mode") return 0;
		if (/*scene*/ ctx[0] === "style") return 1;
		if (/*scene*/ ctx[0] === "form") return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type_1(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			attr(div, "class", "absolute top-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12 svelte-s48hr4");
			add_render_callback(() => /*div_elementresize_handler*/ ctx[9].call(div));
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[9].bind(div));
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}

					transition_in(if_block, 1);
					if_block.m(div, null);
				} else {
					if_block = null;
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			div_resize_listener();
		}
	};
}

function create_fragment$7(ctx) {
	let div6;
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let t2;
	let div5;
	let div4;
	let previous_key = /*scene*/ ctx[0];
	let div4_class_value;
	let t3;
	let p;
	let current;
	let if_block0 = /*backScene*/ ctx[4] && create_if_block_7(ctx);

	function select_block_type(ctx, dirty) {
		if (/*scene*/ ctx[0] === "mode") return create_if_block_4$1;
		if (/*scene*/ ctx[0] === "style") return create_if_block_5;
		if (/*scene*/ ctx[0] === "form") return create_if_block_6;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);
	let if_block2 = /*scene*/ ctx[0] === "form" && create_if_block_3$1();
	let key_block = create_key_block(ctx);

	return {
		c() {
			div6 = element("div");
			div3 = element("div");
			div0 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div1 = element("div");
			if (if_block1) if_block1.c();
			t1 = space();
			div2 = element("div");
			if (if_block2) if_block2.c();
			t2 = space();
			div5 = element("div");
			div4 = element("div");
			key_block.c();
			t3 = space();
			p = element("p");

			p.innerHTML = `Powered By
  <a href="https://avatars.dicebear.com" class="font-semibold hover:underline svelte-s48hr4">DiceBear Avatars</a>`;

			attr(div0, "class", "flex w-1/3 svelte-s48hr4");
			attr(div1, "class", "w-1/3 flex justify-center items-center whitespace-no-wrap svelte-s48hr4");
			attr(div2, "class", "flex w-1/3 justify-end svelte-s48hr4");
			attr(div3, "class", "h-10 flex h-16 svelte-s48hr4");

			attr(div4, "class", div4_class_value = "relative overflow-hidden $" + (/*contentTransitions*/ ctx[2]
			? "transition-all ease-out duration-150"
			: "") + " svelte-s48hr4");

			set_style(div4, "height", /*contentHeight*/ ctx[1] + "px");
			attr(div5, "class", "rounded bg-white shadow-md relative svelte-s48hr4");
			attr(div6, "class", "bg-gray-200 border-8 rounded-lg border-gray-200 svelte-s48hr4");
			attr(p, "class", "text-right text-xs text-gray-400 pr-2 pt-1 svelte-s48hr4");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div3);
			append(div3, div0);
			if (if_block0) if_block0.m(div0, null);
			append(div3, t0);
			append(div3, div1);
			if (if_block1) if_block1.m(div1, null);
			append(div3, t1);
			append(div3, div2);
			if (if_block2) if_block2.m(div2, null);
			append(div6, t2);
			append(div6, div5);
			append(div5, div4);
			key_block.m(div4, null);
			insert(target, t3, anchor);
			insert(target, p, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*backScene*/ ctx[4]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*backScene*/ 16) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_7(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type && current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div1, null);
				}
			}

			if (/*scene*/ ctx[0] === "form") {
				if (if_block2) {
					if (dirty & /*scene*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_3$1();
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (dirty & /*scene*/ 1 && safe_not_equal(previous_key, previous_key = /*scene*/ ctx[0])) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block);
				key_block.m(div4, null);
			} else {
				key_block.p(ctx, dirty);
			}

			if (!current || dirty & /*contentTransitions*/ 4 && div4_class_value !== (div4_class_value = "relative overflow-hidden $" + (/*contentTransitions*/ ctx[2]
			? "transition-all ease-out duration-150"
			: "") + " svelte-s48hr4")) {
				attr(div4, "class", div4_class_value);
			}

			if (!current || dirty & /*contentHeight*/ 2) {
				set_style(div4, "height", /*contentHeight*/ ctx[1] + "px");
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block2);
			transition_in(key_block);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block2);
			transition_out(key_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div6);
			if (if_block0) if_block0.d();

			if (if_block1) {
				if_block1.d();
			}

			if (if_block2) if_block2.d();
			key_block.d(detaching);
			if (detaching) detach(t3);
			if (detaching) detach(p);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	
	let { options } = $$props;
	let { styles, modes = ["creator"], locales: locales$1 = {}, locale = "en_US", fallbackLocale = "en_US" } = options;
	let mode = modes[0];
	let style = Object.values(styles)[0];
	let scene = getPossibleScenes(modes, styles)[0];
	let avatarOptions = {};
	let contentHeight = 0;
	let contentTransitions = false;
	let avatar;
	let i18n = Object.assign(Object.assign(Object.assign(Object.assign({}, locales[fallbackLocale] || {}), locales[locale] || {}), locales$1[fallbackLocale] || {}), locales$1[locale] || {});

	let ctx = {
		i18n: { get: key => i18n[key] },
		mode: {
			get: () => mode,
			set: newMode => {
				mode = newMode;
				$$invalidate(0, scene = getPossibleScenes(modes, styles).filter(v => v !== "mode")[0]);
				$$invalidate(12, avatarOptions = {});
			}
		},
		style: {
			get: () => style,
			set: newStyle => {
				$$invalidate(11, style = newStyle);
				$$invalidate(0, scene = "form");
				$$invalidate(12, avatarOptions = {});
			}
		},
		avatarOptions: {
			get: () => avatarOptions,
			set: newAvatarOptions => $$invalidate(12, avatarOptions = newAvatarOptions)
		},
		scene: {
			get: () => scene,
			set: newScene => $$invalidate(0, scene = newScene)
		}
	};

	setContext("ctx", ctx);

	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
		setTimeout(
			() => {
				$$invalidate(2, contentTransitions = contentHeight > 0);
			},
			100
		);
	}));

	const click_handler = () => ctx.scene.set(backScene);

	function div_elementresize_handler() {
		contentHeight = this.offsetHeight;
		$$invalidate(1, contentHeight);
	}

	$$self.$$set = $$props => {
		if ("options" in $$props) $$invalidate(7, options = $$props.options);
	};

	let backScene;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*scene*/ 1) {
			 $$invalidate(4, backScene = getBackScene(modes, styles, scene));
		}

		if ($$self.$$.dirty & /*style, avatarOptions*/ 6144) {
			 $$invalidate(3, avatar = createPreviewAvatar(style, avatarOptions));
		}
	};

	return [
		scene,
		contentHeight,
		contentTransitions,
		avatar,
		backScene,
		modes,
		ctx,
		options,
		click_handler,
		div_elementresize_handler
	];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-s48hr4-style")) add_css$6();
		init(this, options, instance$4, create_fragment$7, safe_not_equal, { options: 7 });
	}
}

var createAvatarUI = function createAvatarUI(options) {
  var target = options.target,
      rest = __rest(options, ["target"]);

  return new App({
    target: target,
    props: {
      options: rest
    }
  });
};

exports.createAvatarUI = createAvatarUI;
