import { createAvatar } from '@dicebear/avatars';

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
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
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
	style.id = "svelte-1jvfo6m-style";
	style.textContent = "button.svelte-1jvfo6m{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button.svelte-1jvfo6m{overflow:visible}button.svelte-1jvfo6m{text-transform:none}button.svelte-1jvfo6m{-webkit-appearance:button}button.svelte-1jvfo6m::-moz-focus-inner{border-style:none;padding:0}button.svelte-1jvfo6m:-moz-focusring{outline:1px dotted ButtonText}button.svelte-1jvfo6m{background-color:transparent;background-image:none}button.svelte-1jvfo6m:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.svelte-1jvfo6m,.svelte-1jvfo6m::before,.svelte-1jvfo6m::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}button.svelte-1jvfo6m{cursor:pointer}button.svelte-1jvfo6m{padding:0;line-height:inherit;color:inherit}.bg-white.svelte-1jvfo6m{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.hover\\:bg-gray-900.svelte-1jvfo6m:hover{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26, 32, 44, var(--bg-opacity))}.rounded.svelte-1jvfo6m{border-radius:0.25rem}.inline-flex.svelte-1jvfo6m{display:inline-flex}.items-center.svelte-1jvfo6m{align-items:center}.justify-center.svelte-1jvfo6m{justify-content:center}.h-10.svelte-1jvfo6m{height:2.5rem}.focus\\:outline-none.svelte-1jvfo6m:focus{outline:2px solid transparent;outline-offset:2px}.px-4.svelte-1jvfo6m{padding-left:1rem;padding-right:1rem}.shadow-md.svelte-1jvfo6m{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.hover\\:text-white.svelte-1jvfo6m:hover{--text-opacity:1;color:#fff;color:rgba(255, 255, 255, var(--text-opacity))}.w-10.svelte-1jvfo6m{width:2.5rem}@keyframes svelte-1jvfo6m-spin{to{transform:rotate(360deg)}}@keyframes svelte-1jvfo6m-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-1jvfo6m-pulse{50%{opacity:.5}}@keyframes svelte-1jvfo6m-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}";
	append(document.head, style);
}

// (784:2) {:else}
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

// (782:2) {#if icon}
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
			attr(button, "class", button_class_value = "inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 " + (/*icon*/ ctx[0] ? "w-10" : "px-4") + " shadow-md focus:outline-none" + " svelte-1jvfo6m");
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

			if (!current || dirty & /*icon*/ 1 && button_class_value !== (button_class_value = "inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 " + (/*icon*/ ctx[0] ? "w-10" : "px-4") + " shadow-md focus:outline-none" + " svelte-1jvfo6m")) {
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
		if (!document.getElementById("svelte-1jvfo6m-style")) add_css();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { icon: 0 });
	}
}

/* src/components/scenes/Form.svelte generated by Svelte v3.29.4 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-17k5r4-style";
	style.textContent = ".svelte-17k5r4,.svelte-17k5r4::before,.svelte-17k5r4::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes svelte-17k5r4-spin{to{transform:rotate(360deg)}}@keyframes svelte-17k5r4-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-17k5r4-pulse{50%{opacity:.5}}@keyframes svelte-17k5r4-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}";
	append(document.head, style);
}

function create_fragment$2(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Form";
			attr(div, "class", "svelte-17k5r4");
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

class Form extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-17k5r4-style")) add_css$1();
		init(this, options, null, create_fragment$2, safe_not_equal, {});
	}
}

/* src/components/scenes/Mode.svelte generated by Svelte v3.29.4 */

function add_css$2() {
	var style = element("style");
	style.id = "svelte-i8peb-style";
	style.textContent = "h2.svelte-i8peb,p.svelte-i8peb{margin:0}.svelte-i8peb,.svelte-i8peb::before,.svelte-i8peb::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}h2.svelte-i8peb{font-size:inherit;font-weight:inherit}.bg-gray-100.svelte-i8peb{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247, 250, 252, var(--bg-opacity))}.rounded.svelte-i8peb{border-radius:0.25rem}.flex.svelte-i8peb{display:flex}.grid.svelte-i8peb{display:grid}.flex-col.svelte-i8peb{flex-direction:column}.flex-grow.svelte-i8peb{flex-grow:1}.text-xl.svelte-i8peb{font-size:1.25rem;line-height:1.75rem}.mb-6.svelte-i8peb{margin-bottom:1.5rem}.mb-8.svelte-i8peb{margin-bottom:2rem}.p-6.svelte-i8peb{padding:1.5rem}.p-12.svelte-i8peb{padding:3rem}.text-center.svelte-i8peb{text-align:center}.text-gray-600.svelte-i8peb{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.text-gray-700.svelte-i8peb{--text-opacity:1;color:#4a5568;color:rgba(74, 85, 104, var(--text-opacity))}.capitalize.svelte-i8peb{text-transform:capitalize}.gap-10.svelte-i8peb{grid-gap:2.5rem;gap:2.5rem}.grid-cols-cards.svelte-i8peb{grid-template-columns:repeat(auto-fill, minmax(240px, 1fr))}@keyframes svelte-i8peb-spin{to{transform:rotate(360deg)}}@keyframes svelte-i8peb-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-i8peb-pulse{50%{opacity:.5}}@keyframes svelte-i8peb-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (788:45) 
function create_if_block_1$1(ctx) {
	let t_value = /*trans*/ ctx[1].deterministicModeDescription + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*trans*/ 2 && t_value !== (t_value = /*trans*/ ctx[1].deterministicModeDescription + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (786:10) {#if mode === 'creator'}
function create_if_block$2(ctx) {
	let t_value = /*trans*/ ctx[1].creatorModeDescription + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*trans*/ 2 && t_value !== (t_value = /*trans*/ ctx[1].creatorModeDescription + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (791:10) <Button on:click={() => modeCtx.set(mode)}>
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

// (782:4) {#each modes as mode}
function create_each_block(ctx) {
	let div1;
	let h2;
	let t0_value = /*mode*/ ctx[4] + "";
	let t0;
	let t1;
	let p;
	let t2;
	let div0;
	let button;
	let t3;
	let current;

	function select_block_type(ctx, dirty) {
		if (/*mode*/ ctx[4] === "creator") return create_if_block$2;
		if (/*mode*/ ctx[4] === "deterministic") return create_if_block_1$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	function click_handler(...args) {
		return /*click_handler*/ ctx[3](/*mode*/ ctx[4], ...args);
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
			attr(h2, "class", "text-xl mb-6 text-gray-700 capitalize svelte-i8peb");
			attr(p, "class", "text-gray-600 mb-8 flex-grow svelte-i8peb");
			attr(div0, "class", "text-center svelte-i8peb");
			attr(div1, "class", "p-6 bg-gray-100 text-center rounded flex flex-col svelte-i8peb");
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
			if ((!current || dirty & /*modes*/ 1) && t0_value !== (t0_value = /*mode*/ ctx[4] + "")) set_data(t0, t0_value);

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

			if (dirty & /*$$scope*/ 128) {
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

function create_fragment$3(ctx) {
	let div1;
	let div0;
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
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "grid grid-cols-cards gap-10 svelte-i8peb");
			attr(div1, "class", "p-12 svelte-i8peb");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*modeCtx, modes, trans*/ 7) {
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
						each_blocks[i].m(div0, null);
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
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	
	let { modes } = $$props;
	const click_handler = mode => modeCtx.set(mode);

	$$self.$$set = $$props => {
		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
	};

	let trans;
	let modeCtx;
	 $$invalidate(1, trans = getContext("trans"));
	 $$invalidate(2, modeCtx = getContext("mode"));
	return [modes, trans, modeCtx, click_handler];
}

class Mode extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-i8peb-style")) add_css$2();
		init(this, options, instance$2, create_fragment$3, safe_not_equal, { modes: 0 });
	}
}

/* src/components/scenes/Style.svelte generated by Svelte v3.29.4 */

function add_css$3() {
	var style = element("style");
	style.id = "svelte-f227p9-style";
	style.textContent = ".svelte-f227p9,.svelte-f227p9::before,.svelte-f227p9::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes svelte-f227p9-spin{to{transform:rotate(360deg)}}@keyframes svelte-f227p9-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-f227p9-pulse{50%{opacity:.5}}@keyframes svelte-f227p9-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}";
	append(document.head, style);
}

function create_fragment$4(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Style";
			attr(div, "class", "svelte-f227p9");
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
		if (!document.getElementById("svelte-f227p9-style")) add_css$3();
		init(this, options, null, create_fragment$4, safe_not_equal, {});
	}
}

/* src/components/App.svelte generated by Svelte v3.29.4 */

function add_css$4() {
	var style = element("style");
	style.id = "svelte-cu4tlh-style";
	style.textContent = "h1.svelte-cu4tlh{font-size:2em;margin:0.67em 0}a.svelte-cu4tlh{background-color:transparent}img.svelte-cu4tlh{border-style:none}h1.svelte-cu4tlh,p.svelte-cu4tlh{margin:0}.svelte-cu4tlh,.svelte-cu4tlh::before,.svelte-cu4tlh::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}img.svelte-cu4tlh{border-style:solid}h1.svelte-cu4tlh{font-size:inherit;font-weight:inherit}a.svelte-cu4tlh{color:inherit;text-decoration:inherit}img.svelte-cu4tlh{display:block;vertical-align:middle}img.svelte-cu4tlh{max-width:100%;height:auto}.bg-white.svelte-cu4tlh{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.bg-gray-200.svelte-cu4tlh{--bg-opacity:1;background-color:#edf2f7;background-color:rgba(237, 242, 247, var(--bg-opacity))}.border-white.svelte-cu4tlh{--border-opacity:1;border-color:#fff;border-color:rgba(255, 255, 255, var(--border-opacity))}.border-gray-200.svelte-cu4tlh{--border-opacity:1;border-color:#edf2f7;border-color:rgba(237, 242, 247, var(--border-opacity))}.rounded.svelte-cu4tlh{border-radius:0.25rem}.rounded-lg.svelte-cu4tlh{border-radius:0.5rem}.border-2.svelte-cu4tlh{border-width:2px}.border-8.svelte-cu4tlh{border-width:8px}.inline-block.svelte-cu4tlh{display:inline-block}.flex.svelte-cu4tlh{display:flex}.items-end.svelte-cu4tlh{align-items:flex-end}.justify-end.svelte-cu4tlh{justify-content:flex-end}.justify-center.svelte-cu4tlh{justify-content:center}.font-semibold.svelte-cu4tlh{font-weight:600}.h-10.svelte-cu4tlh{height:2.5rem}.h-32.svelte-cu4tlh{height:8rem}.text-xs.svelte-cu4tlh{font-size:0.75rem;line-height:1rem}.text-2xl.svelte-cu4tlh{font-size:1.5rem;line-height:2rem}.mr-2.svelte-cu4tlh{margin-right:0.5rem}.ml-2.svelte-cu4tlh{margin-left:0.5rem}.mb-6.svelte-cu4tlh{margin-bottom:1.5rem}.-mt-16.svelte-cu4tlh{margin-top:-4rem}.overflow-hidden.svelte-cu4tlh{overflow:hidden}.pt-1.svelte-cu4tlh{padding-top:0.25rem}.pr-2.svelte-cu4tlh{padding-right:0.5rem}.absolute.svelte-cu4tlh{position:absolute}.relative.svelte-cu4tlh{position:relative}.top-0.svelte-cu4tlh{top:0}.right-0.svelte-cu4tlh{right:0}.left-0.svelte-cu4tlh{left:0}.shadow-md.svelte-cu4tlh{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.text-center.svelte-cu4tlh{text-align:center}.text-right.svelte-cu4tlh{text-align:right}.text-gray-400.svelte-cu4tlh{--text-opacity:1;color:#cbd5e0;color:rgba(203, 213, 224, var(--text-opacity))}.text-gray-600.svelte-cu4tlh{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.hover\\:underline.svelte-cu4tlh:hover{text-decoration:underline}.w-32.svelte-cu4tlh{width:8rem}.w-1\\/3.svelte-cu4tlh{width:33.333333%}.ease-out.svelte-cu4tlh{transition-timing-function:cubic-bezier(0, 0, 0.2, 1)}.duration-150.svelte-cu4tlh{transition-duration:150ms}@keyframes svelte-cu4tlh-spin{to{transform:rotate(360deg)}}@keyframes svelte-cu4tlh-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-cu4tlh-pulse{50%{opacity:.5}}@keyframes svelte-cu4tlh-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}.bg-transparent-shape.svelte-cu4tlh{background-image:url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22white%22%2F%3E%0A%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3C%2Fsvg%3E%0A)}";
	append(document.head, style);
}

// (860:6) {#if backScene}
function create_if_block_7(ctx) {
	let div;
	let button;
	let current;
	button = new Button({ props: { icon: "chevron-left" } });
	button.$on("click", /*click_handler*/ ctx[10]);

	return {
		c() {
			div = element("div");
			create_component(button.$$.fragment);
			attr(div, "class", "mr-2 svelte-cu4tlh");
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

// (871:33) 
function create_if_block_6(ctx) {
	let div;
	let img;
	let img_src_value;

	return {
		c() {
			div = element("div");
			img = element("img");
			if (img.src !== (img_src_value = /*avatar*/ ctx[6])) attr(img, "src", img_src_value);
			attr(img, "class", "w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape svelte-cu4tlh");
			attr(img, "alt", "Your Avatar");
			attr(div, "class", "text-center left-0 right-0 svelte-cu4tlh");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, img);
		},
		p(ctx, dirty) {
			if (dirty & /*avatar*/ 64 && img.src !== (img_src_value = /*avatar*/ ctx[6])) {
				attr(img, "src", img_src_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (869:34) 
function create_if_block_5(ctx) {
	let h1;
	let t_value = /*trans*/ ctx[4].styleHeadline + "";
	let t;

	return {
		c() {
			h1 = element("h1");
			t = text(t_value);
			attr(h1, "class", "text-2xl text-gray-600 svelte-cu4tlh");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
			append(h1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*trans*/ 16 && t_value !== (t_value = /*trans*/ ctx[4].styleHeadline + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(h1);
		}
	};
}

// (867:6) {#if scene === 'mode'}
function create_if_block_4$1(ctx) {
	let h1;
	let t_value = /*trans*/ ctx[4].modeHeadline + "";
	let t;

	return {
		c() {
			h1 = element("h1");
			t = text(t_value);
			attr(h1, "class", "text-2xl text-gray-600 svelte-cu4tlh");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
			append(h1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*trans*/ 16 && t_value !== (t_value = /*trans*/ ctx[4].modeHeadline + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(h1);
		}
	};
}

// (881:6) {#if scene === 'form'}
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
			attr(div0, "class", "ml-2 svelte-cu4tlh");
			attr(div1, "class", "ml-2 svelte-cu4tlh");
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

// (901:37) 
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

// (899:38) 
function create_if_block_1$2(ctx) {
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

// (897:10) {#if scene === 'mode'}
function create_if_block$3(ctx) {
	let modescene;
	let current;
	modescene = new Mode({ props: { modes: /*modes*/ ctx[0] } });

	return {
		c() {
			create_component(modescene.$$.fragment);
		},
		m(target, anchor) {
			mount_component(modescene, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const modescene_changes = {};
			if (dirty & /*modes*/ 1) modescene_changes.modes = /*modes*/ ctx[0];
			modescene.$set(modescene_changes);
		},
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

// (895:6) {#key scene}
function create_key_block(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let div_resize_listener;
	let current;
	const if_block_creators = [create_if_block$3, create_if_block_1$2, create_if_block_2$1];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*scene*/ ctx[1] === "mode") return 0;
		if (/*scene*/ ctx[1] === "style") return 1;
		if (/*scene*/ ctx[1] === "form") return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type_1(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			attr(div, "class", "absolute top-0 left-0 right-0 svelte-cu4tlh");
			add_render_callback(() => /*div_elementresize_handler*/ ctx[11].call(div));
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[11].bind(div));
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

function create_fragment$5(ctx) {
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
	let previous_key = /*scene*/ ctx[1];
	let div4_class_value;
	let t3;
	let p;
	let current;
	let if_block0 = /*backScene*/ ctx[5] && create_if_block_7(ctx);

	function select_block_type(ctx, dirty) {
		if (/*scene*/ ctx[1] === "mode") return create_if_block_4$1;
		if (/*scene*/ ctx[1] === "style") return create_if_block_5;
		if (/*scene*/ ctx[1] === "form") return create_if_block_6;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);
	let if_block2 = /*scene*/ ctx[1] === "form" && create_if_block_3$1();
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
  <a href="https://avatars.dicebear.com" class="font-semibold hover:underline svelte-cu4tlh">DiceBear Avatars</a>`;

			attr(div0, "class", "flex w-1/3 svelte-cu4tlh");
			attr(div1, "class", "w-1/3 flex justify-center items-end  svelte-cu4tlh");
			attr(div2, "class", "flex w-1/3 justify-end svelte-cu4tlh");
			attr(div3, "class", "h-10 flex mb-6 svelte-cu4tlh");

			attr(div4, "class", div4_class_value = "relative overflow-hidden $" + (/*contentTransitions*/ ctx[3]
			? "transition-all ease-out duration-150"
			: "") + " svelte-cu4tlh");

			set_style(div4, "height", /*contentHeight*/ ctx[2] + "px");
			attr(div5, "class", "rounded bg-white shadow-md relative svelte-cu4tlh");
			attr(div6, "class", "bg-gray-200 border-8 rounded-lg border-gray-200 svelte-cu4tlh");
			attr(p, "class", "text-right text-xs text-gray-400 pr-2 pt-1 svelte-cu4tlh");
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
			if (/*backScene*/ ctx[5]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*backScene*/ 32) {
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

			if (/*scene*/ ctx[1] === "form") {
				if (if_block2) {
					if (dirty & /*scene*/ 2) {
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

			if (dirty & /*scene*/ 2 && safe_not_equal(previous_key, previous_key = /*scene*/ ctx[1])) {
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

			if (!current || dirty & /*contentTransitions*/ 8 && div4_class_value !== (div4_class_value = "relative overflow-hidden $" + (/*contentTransitions*/ ctx[3]
			? "transition-all ease-out duration-150"
			: "") + " svelte-cu4tlh")) {
				attr(div4, "class", div4_class_value);
			}

			if (!current || dirty & /*contentHeight*/ 4) {
				set_style(div4, "height", /*contentHeight*/ ctx[2] + "px");
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

function instance$3($$self, $$props, $$invalidate) {
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

	
	let { modes = ["creator"] } = $$props;
	let { styles } = $$props;
	let { i18n = {} } = $$props;
	let mode = modes[0];
	let style = styles[0];
	let scene = getPossibleScenes()[0];
	let options = {};
	let contentHeight = 0;
	let contentTransitions = false;

	setContext("trans", Object.assign(
		{
			modeHeadline: "Choose a mode",
			styleHeadline: "Choose a style",
			creatorModeDescription: "Create a individual avatar piece by piece.",
			deterministicModeDescription: "Create deterministic avatars from a seed."
		},
		i18n
	));

	setContext("mode", { get: () => mode, set: changeMode });
	setContext("style", { get: () => style, set: changeStyle });
	setContext("options", { get: () => options, set: changeOptions });

	afterUpdate(() => __awaiter(void 0, void 0, void 0, function* () {
		setTimeout(
			() => {
				$$invalidate(3, contentTransitions = contentHeight > 0);
			},
			100
		);
	}));

	function changeMode(newMode) {
		mode = newMode;
		$$invalidate(1, scene = getPossibleScenes().filter(v => v !== "mode")[0]);
		$$invalidate(14, options = {});
	}

	function changeStyle(newStyle) {
		$$invalidate(13, style = newStyle);
		$$invalidate(1, scene = "form");
		$$invalidate(14, options = {});
	}

	function changeScene(newScene) {
		$$invalidate(1, scene = newScene);
	}

	function changeOptions(newOptions) {
		$$invalidate(14, options = newOptions);
	}

	function getPossibleScenes() {
		let scenes = [];

		if (modes.length > 1) {
			scenes.push("mode");
		}

		if (Object.keys(styles).length > 1) {
			scenes.push("style");
		}

		scenes.push("form");
		return scenes;
	}

	function getBackScene() {
		let possibleScenes = getPossibleScenes();
		let currentSceneIndex = possibleScenes.indexOf(scene);
		console.log(currentSceneIndex);

		return currentSceneIndex === 0
		? undefined
		: possibleScenes[currentSceneIndex - 1];
	}

	const click_handler = () => changeScene(backScene);

	function div_elementresize_handler() {
		contentHeight = this.offsetHeight;
		$$invalidate(2, contentHeight);
	}

	$$self.$$set = $$props => {
		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
		if ("styles" in $$props) $$invalidate(8, styles = $$props.styles);
		if ("i18n" in $$props) $$invalidate(9, i18n = $$props.i18n);
	};

	let trans;
	let backScene;
	let avatar;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*scene, style, options*/ 24578) {
			 $$invalidate(6, avatar = scene === "form"
			? createAvatar(style, Object.assign(Object.assign({}, options), {
					width: undefined,
					height: undefined,
					base64: true
				}))
			: "data:,");
		}
	};

	 $$invalidate(4, trans = getContext("trans"));
	 $$invalidate(5, backScene = getBackScene());

	return [
		modes,
		scene,
		contentHeight,
		contentTransitions,
		trans,
		backScene,
		avatar,
		changeScene,
		styles,
		i18n,
		click_handler,
		div_elementresize_handler
	];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-cu4tlh-style")) add_css$4();
		init(this, options, instance$3, create_fragment$5, safe_not_equal, { modes: 0, styles: 8, i18n: 9 });
	}
}

var index = (function (options) {
  var target = options.target,
      props = __rest(options, ["target"]);

  return new App({
    target: target,
    props: props
  });
});

export default index;
