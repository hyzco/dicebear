(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.AvatarsUI = {}));
}(this, (function (exports) { 'use strict';

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
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function t(){return (t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a]);}return t}).apply(this,arguments)}function e(t){var e=(t?function(t){for(var e=0,r=0;r<t.length;r++)e=(e<<5)-e+t.charCodeAt(r)|0;return e}(t):-2147483648+Math.floor(4294967295*Math.random()))||1,r=function(t,r){return Math.floor((e^=e<<13,e^=e>>17,((e^=e<<5)- -2147483648)/4294967295*(r+1-t)+t))};return {seed:t,bool:function(t){return void 0===t&&(t=50),r(0,100)<t},integer:function(t,e){return r(t,e)},pick:function(t){return t[r(0,t.length-1)]}}}function r(t){return '<g transform="translate('+t.x+", "+t.y+')">'+t.children+"</g>"}function a(t){var e="CC BY 4.0"===t.meta.license.name;return '<metadata id="metadata70"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title>'+t.meta.title+'</dc:title><cc:license rdf:resource="'+t.meta.license.link+'" /><dc:creator><cc:Agent><dc:title>'+t.meta.creator+"</dc:title></cc:Agent></dc:creator><dc:source>"+t.meta.source+"</dc:source></cc:Work>"+(e||"CC0 1.0"===t.meta.license.name?'<cc:License rdf:about="'+t.meta.license.link+'"><cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" /><cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />'+(e?'<cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />':"")+(e?'<cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />':"")+'<cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" /></cc:License>':"")+"</rdf:RDF></metadata>"}function i(t){var e=t.attributes.viewBox.split(" ");return {x:parseInt(e[0]),y:parseInt(e[1]),width:parseInt(e[2]),height:parseInt(e[3])}}function o(t,e){var r=i(t);return '<g transform="translate('+r.width*e.margin/100+", "+r.height*e.margin/100+')"><g transform="scale('+(1-2*e.margin/100)+')"><rect fill="none" width="'+r.width.toString()+'" height="'+r.height.toString()+'" x="'+r.x.toString()+'" y="'+r.y.toString()+'" />'+t.body+"</g></g>"}function n(t,e){var r=i(t),a=r.width.toString(),o=r.height.toString(),n=r.x.toString(),l=r.y.toString();return '<rect fill="'+e.backgroundColor+'" width="'+a+'" height="'+o+'" x="'+n+'" y="'+l+'" />'+t.body}function l(t,e){var r=i(t);return '<mask id="avatarsRadiusMask"><rect width="'+r.width.toString()+'" height="'+r.height.toString()+'" rx="'+(r.width*e.radius/100).toString()+'" ry="'+(r.height*e.radius/100).toString()+'" x="'+r.x.toString()+'" y="'+r.y.toString()+'" fill="#fff" /></mask><g mask="url(#avatarsRadiusMask)>'+t.body+"</g>"}function c(e){var r={};return d(e,function(e,a){var i,o=e.default;o&&(r=t({},r,((i={})[a]=o,i)));}),r}function u(e){var r={};return d(e,function(e,a){var i,o=e.title;o&&(r=t({},r,((i={})[o]=[].concat(r[o]||[],[a]),i)));}),Object.values(r).filter(function(t){return t.length>1})}function d(t,e){!function t(r,a){void 0===a&&(a=!1),Object.keys(r).forEach(function(i){"properties"===i?t(r[i],!0):["oneOf","allOf","anyOf"].includes(i)?r[i].forEach(function(e){return t(e,a)}):a&&e(r[i],i);});}(t);}function f(r,i){var s,d=c(r.schema);i=t({seed:Math.random().toString()},d,i),u(r.schema).forEach(function(t){var e=t.reduce(function(t,e){return t||i[e]},void 0);t.forEach(function(t){i[t]=e;});});var m=e(i.seed),f=r.create({prng:m,options:i});i.width&&(f.attributes.width=i.width.toString()),i.height&&(f.attributes.height=i.height.toString()),i.margin&&(f.body=o(f,i)),i.backgroundColor&&(f.body=n(f,i)),i.radius&&(f.body=l(f,i));var h=t({},{"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg",xmlns:"http://www.w3.org/2000/svg"},f.attributes),p="<svg "+Object.keys(h).map(function(t){return t+'="'+h[t].replace('"',"&quot;")+'"'}).join(" ")+">"+a(r)+(null!=(s=f.head)?s:"")+f.body+"</svg>";return i.dataUri?"data:image/svg+xml;utf8,"+encodeURIComponent(p):p}var h={standard:function(t){return '<path d="M154 319.5c-14.4-20-25.667-58.666-27-78L58.5 212 30 319.5h124z" fill="'+t+'" stroke="#000" stroke-width="4"/><path d="M130.373 263.688A65.051 65.051 0 01124 264c-30.779 0-56.053-21.572-58.76-49.098L127 241.5c.378 5.48 1.554 13.316 3.373 22.188z" fill="#000"/><path d="M181.939 151.374l.002.009.093.389.144.654c8.851 40.206-16.109 80.258-56.315 89.89-40.205 9.633-80.606-14.759-90.935-54.61l-.19-.733-16.735-69.844-.067-.289C8.512 76.334 33.544 35.757 74.048 26.053c40.504-9.704 81.206 15.123 91.161 55.501l.051.208.02.083.001.005.048.198.047.199.002.004 16.396 68.437.003.009.081.338.081.339z" fill="'+t+'" stroke="#000" stroke-width="4"/>'}},p={hoop:function(t){return '<path d="M24 0c13.255 0 24 10.745 24 24S37.255 48 24 48 0 37.255 0 24c0-6.391 3.5-11.5 6.572-16.5L7.5 6" stroke="'+t+'" stroke-width="4"/>'},stud:function(t){return '<circle cx="25" cy="2" r="4" fill="'+t+'"/><circle opacity=".25" cx="26" cy="1" r="1" fill="#fff"/>'}},y={attached:function(t){return '<path d="M30.5 6.176A23.778 23.778 0 0023.08 5c-10.493 0-19 6.5-18 18.5 1.042 12.5 8.507 17 19 17 1.168 0 2.31-.102 3.42-.299 1.21-.214 2.381-.54 3.5-.966" stroke="#000" stroke-width="8"/><path d="M31.5 39.036a19.382 19.382 0 01-7.42 1.464c-10.493 0-17.958-4.5-19-17-1-12 7.507-18.5 18-18.5 3.138 0 6.187.606 8.92 1.73l-.5 32.306z" fill="'+t+'"/><path d="M27.5 13.5c-4-1.833-12.8-2.8-16 8M17 14c2.167 1.833 6.3 7.5 5.5 15.5" stroke="#000" stroke-width="4"/>'}},g={down:function(t){return '<path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0" stroke="'+t+'" stroke-width="4" stroke-linecap="round"/>'},eyelashesDown:function(t){return '<path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0M37.148 26.458L31 21.03m85.219-11.586l1.785-8.005M45.597 22.814l-4.046-7.132m66.591-6.664L109.08.87M52.674 17.2l-2.201-7.9m49.52-1.269l-.776-8.164" stroke="'+t+'" stroke-width="4" stroke-linecap="round"/>'},eyelashesUp:function(t){return '<path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699m-21.068 8.636l-6.148-5.427m103.035-12.874l6.148-5.427M32.523 23.814l-4.046-7.132m87.035-9.169l4.047-7.132M40.6 20.2l-2.202-7.9m68.038-5.4l2.201-7.9" stroke="'+t+'" stroke-width="4" stroke-linecap="round"/>'},up:function(t){return '<path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699" stroke="'+t+'" stroke-width="4" stroke-linecap="round"/>'}},z={eyes:function(t){return '<g fill="#000"><ellipse cx="16.53" cy="29.402" rx="9" ry="13.5" transform="rotate(-6.776 16.53 29.402)"/><ellipse cx="80.531" cy="19.402" rx="9" ry="13.5" transform="rotate(-6.276 80.531 19.402)"/></g>'},eyesShadow:function(t){return '<circle cx="15.24" cy="20.239" r="12" transform="rotate(-6.276 15.24 20.24)" fill="'+t+'"/><ellipse cx="16.53" cy="29.402" rx="9" ry="13.5" transform="rotate(-6.776 16.53 29.402)" fill="#000"/><circle cx="79.019" cy="11.611" r="12" transform="rotate(-6.276 79.02 11.61)" fill="'+t+'"/><ellipse cx="80.531" cy="19.402" rx="9" ry="13.5" transform="rotate(-6.276 80.531 19.402)" fill="#000"/>'},round:function(t){return '<g fill="#000"><ellipse cx="16.117" cy="28.927" rx="9" ry="10" transform="rotate(-6.776 16.117 28.927)"/><ellipse cx="80.149" cy="18.923" rx="9" ry="10" transform="rotate(-6.276 80.149 18.923)"/></g>'},smiling:function(t){return '<path d="M5.287 34.073c.114.813 1.147.994 1.722.408 2.465-2.516 6.255-4.365 10.654-4.887 2.595-.309 5.091-.12 7.316.472.754.2 1.495-.437 1.232-1.17-1.666-4.646-6.366-7.7-11.475-7.093-5.942.706-10.186 6.095-9.48 12.036l.03.234zm64.098-10c.113.813 1.146.994 1.721.409 2.443-2.486 6.192-4.312 10.542-4.829 2.565-.304 5.032-.118 7.232.464.754.2 1.495-.438 1.23-1.171-1.654-4.594-6.306-7.611-11.362-7.01-5.886.699-10.09 6.037-9.39 11.923.008.071.017.143.027.213z" fill="#000"/>'}},w={beard:function(t){return '<path d="M146.126 49.154c9.489 39.604-14.925 79.402-54.529 88.891-23.307 5.584-46.68-.574-63.905-14.659C10.5 107.5 6.5 56 2.692 31.649c14 31.5 49.624 33.946 83.5 28.002 28.5-5.001 51.299-6.001 51.299-45.001 1.885 2.616 6.978 27.587 8.635 34.504z" fill="'+t+'"/>'},scruff:function(t){return '<path d="M31 109a1 1 0 11-2 0 1 1 0 012 0zm52 7a1 1 0 11-2 0 1 1 0 012 0zm-4 7a1 1 0 11-2 0 1 1 0 012 0zm20-2a1 1 0 11-2 0 1 1 0 012 0zm1-10a1 1 0 11-2 0 1 1 0 012 0zm20 5a1 1 0 11-2 0 1 1 0 012 0zm10-14a1 1 0 11-2 0 1 1 0 012 0zM21 88a1 1 0 11-2 0 1 1 0 012 0zm33 16a1 1 0 11-2 0 1 1 0 012 0zm-3 20a1 1 0 11-2 0 1 1 0 012 0zm18 4a1 1 0 11-2 0 1 1 0 012 0zm34-26a1 1 0 11-2 0 1 1 0 012 0zm14 4a1 1 0 11-2 0 1 1 0 012 0zm-8 17a1 1 0 11-2 0 1 1 0 012 0zm14-31a1 1 0 11-2 0 1 1 0 012 0zm-93 2a1 1 0 11-2 0 1 1 0 012 0zm24 0a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm4 54a1 1 0 11-2 0 1 1 0 012 0zm27 0a1 1 0 11-2 0 1 1 0 012 0zm11 0a1 1 0 11-2 0 1 1 0 012 0zm17-36a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm20 13a1 1 0 11-2 0 1 1 0 012 0zM33 81a1 1 0 11-2 0 1 1 0 012 0zm10 35a1 1 0 11-2 0 1 1 0 012 0zm-4 7a1 1 0 11-2 0 1 1 0 012 0zm40-20a1 1 0 11-2 0 1 1 0 012 0zm12 2a1 1 0 11-2 0 1 1 0 012 0zm-14 30a1 1 0 11-2 0 1 1 0 012 0zm23-51a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm24 15a1 1 0 11-2 0 1 1 0 012 0zm7-10a1 1 0 11-2 0 1 1 0 012 0zM42 90a1 1 0 11-2 0 1 1 0 012 0zm0 11a1 1 0 11-2 0 1 1 0 012 0zm21-15a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm12 14a1 1 0 11-2 0 1 1 0 012 0zm12-6a1 1 0 11-2 0 1 1 0 012 0zm13 0a1 1 0 11-2 0 1 1 0 012 0z" fill="'+t+'"/><path d="M113 76a1 1 0 11-2 0 1 1 0 012 0zm26 0a1 1 0 11-2 0 1 1 0 012 0zm-78 40a1 1 0 11-2 0 1 1 0 012 0zm11-6a1 1 0 11-2 0 1 1 0 012 0zm-4-8a1 1 0 11-2 0 1 1 0 012 0zm24-9a1 1 0 11-2 0 1 1 0 012 0zM43 75a1 1 0 11-2 0 1 1 0 012 0zm37 16a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm35 14a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm7 2a1 1 0 11-2 0 1 1 0 012 0zm15-9a1 1 0 11-2 0 1 1 0 012 0z" fill="'+t+'"/><path d="M31 109a1 1 0 11-2 0 1 1 0 012 0zm52 7a1 1 0 11-2 0 1 1 0 012 0zm-4 7a1 1 0 11-2 0 1 1 0 012 0zm20-2a1 1 0 11-2 0 1 1 0 012 0zm1-10a1 1 0 11-2 0 1 1 0 012 0zm20 5a1 1 0 11-2 0 1 1 0 012 0zm10-14a1 1 0 11-2 0 1 1 0 012 0zM21 88a1 1 0 11-2 0 1 1 0 012 0zm33 16a1 1 0 11-2 0 1 1 0 012 0zm-3 20a1 1 0 11-2 0 1 1 0 012 0zm18 4a1 1 0 11-2 0 1 1 0 012 0zm34-26a1 1 0 11-2 0 1 1 0 012 0zm14 4a1 1 0 11-2 0 1 1 0 012 0zm-8 17a1 1 0 11-2 0 1 1 0 012 0zm14-31a1 1 0 11-2 0 1 1 0 012 0zm-93 2a1 1 0 11-2 0 1 1 0 012 0zm24 0a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm4 54a1 1 0 11-2 0 1 1 0 012 0zm27 0a1 1 0 11-2 0 1 1 0 012 0zm11 0a1 1 0 11-2 0 1 1 0 012 0zm17-36a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm20 13a1 1 0 11-2 0 1 1 0 012 0zM33 81a1 1 0 11-2 0 1 1 0 012 0zm10 35a1 1 0 11-2 0 1 1 0 012 0zm-4 7a1 1 0 11-2 0 1 1 0 012 0zm40-20a1 1 0 11-2 0 1 1 0 012 0zm12 2a1 1 0 11-2 0 1 1 0 012 0zm-14 30a1 1 0 11-2 0 1 1 0 012 0zm23-51a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm24 15a1 1 0 11-2 0 1 1 0 012 0zm7-10a1 1 0 11-2 0 1 1 0 012 0zM42 90a1 1 0 11-2 0 1 1 0 012 0zm0 11a1 1 0 11-2 0 1 1 0 012 0zm21-15a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm12 14a1 1 0 11-2 0 1 1 0 012 0zm12-6a1 1 0 11-2 0 1 1 0 012 0zm13 0a1 1 0 11-2 0 1 1 0 012 0z" stroke="'+t+'"/><path d="M113 76a1 1 0 11-2 0 1 1 0 012 0zm26 0a1 1 0 11-2 0 1 1 0 012 0zm-78 40a1 1 0 11-2 0 1 1 0 012 0zm11-6a1 1 0 11-2 0 1 1 0 012 0zm-4-8a1 1 0 11-2 0 1 1 0 012 0zm24-9a1 1 0 11-2 0 1 1 0 012 0zM43 75a1 1 0 11-2 0 1 1 0 012 0zm37 16a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm35 14a1 1 0 11-2 0 1 1 0 012 0zm0-18a1 1 0 11-2 0 1 1 0 012 0zm7 2a1 1 0 11-2 0 1 1 0 012 0zm15-9a1 1 0 11-2 0 1 1 0 012 0z" stroke="'+t+'"/>'}},k={round:function(t){return '<g stroke="'+t+'" stroke-width="4"><circle cx="122.5" cy="28" r="26"/><circle cx="55.5" cy="37" r="26"/><path d="M97.5 35a8 8 0 00-16 0M30 39L0 44.5"/></g>'},square:function(t){return '<g stroke="'+t+'" stroke-width="4"><path d="M34.5 42.5L0 49.125" stroke-linecap="round"/><path d="M30.488 25.94a6 6 0 014.984-7.405l38.716-5.442a6 6 0 016.777 5.107l5.567 39.61a6 6 0 01-5.107 6.777l-34.472 4.845a6 6 0 01-6.654-4.478l-9.811-39.015zM152.751 8.964a6 6 0 00-6.832-5.744l-38.716 5.44a6 6 0 00-5.107 6.777l5.567 39.611a6 6 0 006.777 5.107l34.472-4.845a6 6 0 005.162-6.139l-1.323-40.207zM83.5 37.125l22-3.5"/></g>'}},b={dannyPhantom:function(t){return '<path d="M123.788 17.489l.076.008.077.002c26.669.785 47.401 11.398 62.072 24.35 14.056 12.41 22.45 26.874 25.187 36.733-4.06 2.317-11.015 4.311-19.885 5.947-9.676 1.783-21.293 3.086-33.147 4.015-23.706 1.857-48.19 2.205-59.625 1.957l-6.073-.133 4.806 3.715c2.498 1.93 5.823 3.273 9.339 4.217 3.541.952 7.419 1.535 11.131 1.867 3.824.342 7.553.422 10.641.343-10.587 8.162-24.062 14.438-37.349 19.09-15.346 5.373-30.27 8.52-39.829 9.921l-2.149.315.491 2.116c3.347 14.429 9.5 39.651 13.628 56.567 1.831 7.506 3.263 13.376 3.875 15.944 1.084 4.554 4.498 11.045 8.394 17.028 3.593 5.517 7.785 10.889 11.322 14.196L78.932 267.5h-29.56c8.337-12.713 10.097-27.403 8.397-42.983-1.84-16.864-7.762-35.004-14.003-53.167-.615-1.788-1.232-3.576-1.85-5.364-5.683-16.459-11.352-32.873-14.422-48.604-3.402-17.424-3.553-33.73 2.832-48.068 10.34-23.214 28.667-36.694 47-44.123 18.375-7.446 36.619-8.751 46.462-7.702z" fill="'+t+'" stroke="#000" stroke-width="4"/>'},dougFunny:function(t){return '<path d="M140 56c14.667-.667 40.4-8.8 26-36m-52 34c14.667-.667 40.4-8.8 26-36M78 65c14.667-.667 40.4-8.8 26-36" stroke="#000" stroke-width="4"/>'},fonze:function(t){return '<path d="M210.177 51.397c-1.263 6.057-4.603 11.324-9.427 15.901 9.392 34.065 9.604 53.869 4.384 57.649l-14.796-49.986C158.389 93.7 98.644 96.896 83.678 96.896a57.636 57.636 0 00-4.429.674C64.603 106.562 76.656 149.688 91 168l-11 2c-5.14-24.966-17.413-22.916-26.612-21.38l-.317.053c2.193 13.631 6.723 27.733 10.444 39.319a689.868 689.868 0 012.662 8.404c-.783.105-1.474.297-2.116.475-5.502 1.527-7.413 2.058-33.384-61.975-6.467-15.944-6.026-30.153-.968-42.612C24.93 87.48 15.34 85.135 10 84.5c10.44-6.12 20.581-4.87 25.544-3.1a68.468 68.468 0 011.555-2.218c-.97-4.412-7.964-9.46-12.11-11.819 8.56-4.31 18.62-2.035 22.991-.21 19.65-18.017 49.045-30.1 74.02-36.155 48.816-11.834 67.5-28.497 67.5-28.497 20.678 8.498 25.617 25.216 20.678 48.895z" fill="'+t+'" stroke="#000" stroke-width="4"/>'},full:function(t){return '<path d="M-13.4 312.857a79.154 79.154 0 01-.617-1.638 126.31 126.31 0 01-2.235-6.74c-1.757-5.812-3.867-14.099-5.275-23.977-2.817-19.777-2.796-45.806 8.397-71.118 1.809-4.092 4.07-8.295 6.52-12.851 9.468-17.602 21.765-40.463 21.765-82.449 0-30.59 14.848-56.354 36.707-74.515 21.88-18.178 50.698-28.658 78.375-28.658 15.131 0 27.296 1.733 37.074 7.64 9.717 5.87 17.368 16.047 23.051 33.581.578 1.785 2.489 2.875 4.357 2.27 11.315-3.672 28.472.034 42.954 9.488 14.418 9.413 25.616 24.156 25.616 41.924 0 15.426-2.642 25.85-5.218 36.001h0c-3.119 12.289-6.131 24.159-4.006 43.498.709 6.449 2.151 11.023 4.166 14.815 1.982 3.731 4.481 6.619 7.114 9.664l.06.069c6.274 7.252 9.129 13.218 10.05 18.466.92 5.235-.043 9.983-1.832 14.91-.9 2.475-1.994 4.96-3.153 7.578l-.1.226c-1.122 2.532-2.296 5.184-3.351 7.975-2.183 5.771-3.886 12.207-3.717 19.835.144 6.475 1.292 10.913 3.009 14.271 1.697 3.32 3.888 5.443 5.799 7.294l.052.05c1.743 1.689 3.193 3.111 4.266 5.104.959 1.781 1.67 4.132 1.789 7.662-24.009 14.279-47.772 20.181-65.616 22.502-9.036 1.176-16.544 1.432-21.783 1.395-2.619-.019-4.669-.11-6.058-.197-.489-.03-.895-.06-1.216-.085-6.151-9.389-11.755-24.878-16.097-40.788-4.221-15.47-7.186-31.091-8.3-41.41 37.073-10.718 60.311-48.982 54.724-88.46-.007-.072-.015-.122-.015-.123a17.077 17.077 0 00-.13-.766 136.35 136.35 0 00-.373-1.954 384.883 384.883 0 00-1.411-6.814 486.965 486.965 0 00-5.117-21.377c-2.14-8.09-4.673-16.67-7.453-24.21-2.759-7.485-5.831-14.143-9.108-18.24l-.297-.37-.435-.189c-1.932-.838-3.939-1.772-6.033-2.747-9.931-4.624-21.84-10.17-37.264-10.78-18.775-.742-42.551 5.777-74.69 29.087l-2.024 1.467 1.946 1.567c15.926 12.834 19.37 29.858 18.633 44.308-.561 11.029-3.55 20.411-5.235 25.101-1.161-1.697-1.901-3.83-2.457-6.335-.385-1.731-.665-3.556-.959-5.467l-.046-.302c-.307-1.994-.634-4.075-1.11-6.084-.952-4.011-2.561-8.02-6.133-10.859-3.58-2.845-8.796-4.254-16.393-3.83l-2.227.124.465 2.182 11.358 53.313.02.089.027.088c4.058 12.862 11.016 24.01 19.913 32.812a106.12 106.12 0 011.538 2.683 129.34 129.34 0 013.76 7.323c2.815 5.949 5.66 13.252 6.209 19.216.556 6.052-.965 13.86-2.707 20.31a129.626 129.626 0 01-2.842 9.137c-5.032-2.405-9.527-2.226-13.379.016-4.163 2.424-7.213 7.06-9.483 12.216-4.148 9.421-6.143 21.639-7.064 29.221-24.87-5.704-44.074-11.495-57.14-15.895-6.714-2.261-11.807-4.154-15.216-5.48a190.79 190.79 0 01-4.398-1.77z" fill="'+t+'" stroke="#000" stroke-width="3.822"/>'},mrClean:function(t){return '<ellipse cx="147.854" cy="58.18" rx="6.858" ry="18.439" transform="rotate(117 147.854 58.18)" fill="#FCFDFF"/>'},mrT:function(t){return '<g fill="'+t+'"><path opacity=".1" d="M187.984 77.174c-8-6.4-21.833-7-27.5-6.5l-8-26.5c13.6 3.2 32 24 35.5 33z"/><path d="M102.93 84.436l.055.238c-19.2-39.6-45.333-15.166-54 2C42.185 45.074 72.334 19.334 86 12c1.286-.769 8.248-4.884 29.746-10.3 24.217-6.101 33.046-3.718 33.046-3.718l11.789 72.832s-8.039-.174-28.033 4.193c-19.993 4.367-29.562 9.666-29.562 9.666l-.056-.237z" stroke="#000" stroke-width="4"/><path opacity=".1" d="M67.486 130.673c-7.2-27.2 22-41.833 35.499-46-7-16.333-23-31-42.5-13-18 30.5-11 54.001-5.5 72l12.5-13z"/></g>'},pixie:function(t){return '<g stroke="#000"><path d="M105.837 88.82c1.888.297 1.888.299 1.887.3v.004l-.001.007-.003.018a.813.813 0 00-.009.05l-.031.157a11.69 11.69 0 01-.125.528 20.355 20.355 0 01-.6 1.894c-.595 1.625-1.626 3.958-3.393 6.923-3.17 5.317-8.702 12.658-18.316 21.589 29.97.747 55.004-8.908 72.821-19.033 9.361-5.32 16.712-10.759 21.717-14.863a118.433 118.433 0 005.698-4.965 74.331 74.331 0 001.804-1.742c.039-.04.067-.07.086-.088l.019-.02.004-.004h0l2.282-2.374.929 3.16-1.834.538 1.834-.538.001.002.002.009.01.034.039.132.152.52.581 1.993a2171.99 2171.99 0 018.771 31.058c5.027 18.348 10.604 39.815 12.693 51.971 3.493 20.318-1.908 35.744-5.102 44.869-.621 1.774-1.159 3.31-1.531 4.597.053.045.123.1.214.165.597.423 1.656.911 3.187 1.397 3.015.959 7.319 1.745 11.921 2.188 4.594.442 9.377.532 13.338.146 1.982-.194 3.705-.502 5.075-.92 1.316-.402 2.14-.857 2.585-1.268.013-.086.031-.291-.019-.688-.098-.776-.405-1.868-.937-3.313-.793-2.157-1.969-4.798-3.344-7.885a820.46 820.46 0 01-1.46-3.294c-3.929-8.939-8.656-20.564-9.686-32.408-1.144-13.161 1.457-24.416 3.794-34.533l.111-.482c2.388-10.34 4.375-19.319 2.335-28.419-3.096-13.81-7.319-25.308-13.804-33.57-6.417-8.174-15.12-13.276-27.496-14.214l-1.278-.096-.395-1.22c-5.695-17.57-13.383-29.051-23.186-36.17-9.8-7.117-21.956-10.051-36.939-10.051-27.688 0-57.503 10.52-79.878 28.718-22.351 18.18-37.143 43.896-35.208 74.334 2.136 33.591-.298 59.061-5.788 77.712-5.006 17.007-12.593 28.466-21.688 35.15 1.194.609 2.784 1.383 4.771 2.269 5.027 2.24 12.591 5.198 22.674 8.027 19.334 5.425 47.945 10.38 85.711 8.887-8.325-7.151-16.723-15.828-23.374-25-7.633-10.527-13.135-21.943-13.296-32.575-.191-12.627.664-45.668.928-52.507.615-15.896 10.822-28.15 20.538-36.3 4.887-4.099 9.728-7.228 13.344-9.331a87.365 87.365 0 014.38-2.39c.53-.27.949-.474 1.239-.612l.208-.099a24.4 24.4 0 01.126-.058l.09-.042.025-.011.007-.004h.003c.001-.001.001-.001.787 1.74zm0 0l1.888.297.551-3.494-3.225 1.455.786 1.742zm100.231 126.568c.003 0 .014.014.029.04-.024-.027-.031-.04-.029-.04z" fill="'+t+'" stroke-width="3.822"/><path d="M191 58c.5 4.5-.3 13.5-1.5 19.5" stroke-width="4"/></g>'},turban:function(t){return '<g stroke="#000" stroke-width="4"><path d="M222.726 100.791c0-66.089-36.458-110.79-80.867-110.791C84.966-10 27 11.341 27 112.254c0 24.969 10.659 43.573 25.565 57.286-1.495-1.869-2.698-3.544-3.498-4.921-2.891-26.981 29.166-47.69 60.534-67.954 16.653-10.758 33.111-21.39 44.045-32.77 9.594 5.437 37.794 28.214 43.167 37.425 2.882 4.94 7.509 21.869 10.671 41.63 10.338-12.418 15.242-24.843 15.242-42.159z" fill="'+t+'"/><path d="M154.264 63.246C167.438 51.3 187.146 24.04 185.881 6.334"/></g>'}},v={frown:function(t){return '<path d="M-5 41c3.21-7.957 15.107-24.767 37.007-28.348 21.9-3.58 33.12 8.455 35.993 14.92" stroke="#000" stroke-width="4"/>'},laughing:function(t){return '<path d="M62.807 25.177a34 34 0 001.113-11.846c-.17-2.068-2.284-3.22-4.075-2.513-4.229 1.666-18.218 6.965-28.082 8.322-10.823 1.49-27.213-.319-31.957-.908-1.93-.24-3.649 1.418-3.316 3.433a34 34 0 0066.317 3.512z" fill="#000" stroke="#000" stroke-width="4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M51.83 39.553a31.997 31.997 0 01-37.208 4.612c2.854-6.95 9.273-12.2 17.26-13.188 7.983-.988 15.485 2.536 19.947 8.576z"/>'},nervous:function(t){return '<rect x="-6.752" y="17.471" width="70" height="24" rx="4" transform="rotate(-4 -6.752 17.47)" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M56.821 13.025L-.496 17.033l1.84 7.005a6 6 0 006.222 4.46 6 6 0 00-5.54 5.284l-.848 7.193 57.317-4.008-1.84-7.005a6 6 0 00-6.221-4.46 6 6 0 005.54-5.284l.847-7.193z" fill="#fff"/><path d="M-1.933 15.845c-3.656-.263-6.744 2.765-6.486 6.451l1.018 14.57c.258 3.686 3.737 6.254 7.322 5.485 6.944-1.49 20.221-4.134 29.816-4.805 9.596-.671 23.112.099 30.196.608 3.656.264 6.744-2.764 6.486-6.45L65.4 17.134c-.257-3.686-3.737-6.254-7.32-5.485-6.945 1.49-20.222 4.134-29.818 4.805-9.595.671-23.111-.099-30.195-.609z" stroke="#000" stroke-width="4"/>'},pucker:function(t){return '<path d="M26 16.697c4.167-2.334 21-5.3 21 1.5 0 8.5-11.5 8-11.5 8s13.045-3.162 10.5 6c-2.5 9-9.5 5.5-11.5 4.5" stroke="#000" stroke-width="4"/>'},sad:function(t){return '<path d="M13 46c1.715-7.957 8.07-24.767 19.77-28.348 11.7-3.58 17.695 8.455 19.23 14.92" stroke="#000" stroke-width="4"/>'},smile:function(t){return '<path d="M-.5 17.5c2.5 17 31 25 57 5.5" stroke="#000" stroke-width="4"/>'},smirk:function(t){return '<path d="M10 24.165c4.941 6.447 12.428 13.589 23.977 11.96 11.549-1.629 16.687-9.595 15.172-16.047" stroke="#000" stroke-width="4"/>'},surpriced:function(t){return '<path d="M36.047 54.891c10.837-1.96 17.186-13.936 14.978-26.137S38.673 7.562 27.836 9.524C17 11.483 10.65 23.46 12.86 35.66c2.208 12.2 12.35 21.192 23.188 19.23z" fill="#000" stroke="#000" stroke-width="3.591"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.14 42.653c2.784-5.208 8.143-9.242 14.803-10.447C38.603 31 45.035 32.9 49.467 36.8c-1.082 8.29-6.37 14.989-13.739 16.322-7.369 1.334-14.669-3.087-18.587-10.47z"/>'}},M={curve:function(t){return '<path d="M14.736 7.08c.203 3.842 1.697 12.081 6.048 14.297 5.439 2.77 1.175 11.953-9.006 11.364" stroke="#000" stroke-width="4"/>'},pointed:function(t){return '<path d="M14.456 3.177C16.405 17.041 24.868 26.96 24.868 26.96s-2.631 6.429-12.812 5.84" stroke="#000" stroke-width="4"/>'},round:function(t){return '<path d="M11.088 13.22c5.22-1.985 14.323-1.386 13.763 8.714-.498 8.976-9.707 10.758-12.64 8.665" stroke="#000" stroke-width="4"/>'}},x={collared:function(t){return '<g stroke="#000" stroke-width="4"><path d="M126.771 67.578L128 66l-1.229 1.578 1.722 1.34 1.186-1.83v-.001l.002-.003.009-.014.041-.063.038-.058.131-.196c.15-.225.375-.558.67-.984.588-.85 1.453-2.067 2.548-3.523 2.194-2.914 5.298-6.764 8.953-10.528 3.666-3.773 7.827-7.4 12.127-9.925 4.316-2.533 8.579-3.844 12.535-3.31 42.438 5.722 73.669 24.519 93.941 52.518h-273.3c16.3-29.342 39.484-48.019 77.07-56.588 1.602-.366 3.78-.255 6.503.379 2.695.626 5.768 1.727 9.081 3.184 6.627 2.913 14.024 7.16 20.976 11.56 6.941 4.394 13.386 8.907 18.1 12.324a364.95 364.95 0 015.605 4.144c.665.502 1.182.896 1.532 1.165l.398.306.1.078.025.02.006.004h.001z" fill="'+t+'"/><path d="M52.613 37.085l5.166-19.232c.21-.779 1.217-.999 1.761-.404 14.863 16.265 33.62 15.627 39.845 14.88.845-.1 1.507.824 1.11 1.577L87.338 58.859a.95.95 0 01-1.038.505c-3.948-.823-23.623-5.632-33.571-21.497a.991.991 0 01-.116-.782zm130.582-.104L171.615 17.5c-.393-.662-1.362-.65-1.781-.005-5.737 8.836-15.632 12.906-19.092 14.108-.622.217-.907.956-.571 1.523l13.502 22.815c.202.34.582.525.963.417 2.135-.608 9.46-3.672 18.546-18.336.196-.315.203-.72.013-1.04z" fill="'+t+'"/><path opacity=".75" d="M52.613 37.085l5.166-19.232c.21-.779 1.217-.999 1.761-.404 14.863 16.265 33.62 15.627 39.845 14.88.845-.1 1.507.824 1.11 1.577L87.338 58.859a.95.95 0 01-1.038.505c-3.948-.823-23.623-5.632-33.571-21.497a.991.991 0 01-.116-.782zm130.582-.104L171.615 17.5c-.393-.662-1.362-.65-1.781-.005-5.737 8.836-15.632 12.906-19.092 14.108-.622.217-.907.956-.571 1.523l13.502 22.815c.202.34.582.525.963.417 2.135-.608 9.46-3.672 18.546-18.336.196-.315.203-.72.013-1.04z" fill="#fff"/><path d="M109.5 54.5l-9-21.5-7 15 16 6.5zm31.5-1l9-21.5 7 15-16 6.5zM70.5 14l-12 3 10 6.5 2-9.5zm89.5 0l11 3-7 6.5-4-9.5z" fill="#000" stroke-linejoin="round"/></g>'},crew:function(t){return '<g clip-path="url(#Shirt/Crew__clip0)" stroke="#000" stroke-width="4"><path d="M260.694 91h-273.32c16.3-29.342 39.484-48.018 77.07-56.588 16.015-3.652 34.67-5.473 56.556-5.473 9.456 0 16.814 1.443 23.796 3.346 2.587.705 5.187 1.496 7.847 2.304 4.402 1.337 8.968 2.725 13.909 3.86l.14.032.144.012C212.961 42.297 240.62 62.785 260.694 91z" fill="'+t+'"/><path d="M52.93 36.58l9.154-19.596a1.009 1.009 0 011.249-.519c37.926 13.425 72.429 12.48 104.403 3.58a1 1 0 011.079.373l13.932 19.052c.383.524.188 1.262-.416 1.5-33.607 13.196-96.668 10.953-128.916-3.066a.978.978 0 01-.484-1.324z" fill="'+t+'"/><path opacity=".75" d="M52.93 36.58l9.154-19.596a1.009 1.009 0 011.249-.519c37.926 13.425 72.429 12.48 104.403 3.58a1 1 0 011.079.373l13.932 19.052c.383.524.188 1.262-.416 1.5-33.607 13.196-96.668 10.953-128.916-3.066a.978.978 0 01-.484-1.324z" fill="#fff"/></g>'},open:function(t){return '<path d="M260.366 90.863h-272.91l.104-.212C-7.895 81.395.49 64.319 11.403 49.04c6.193-8.67 13.127-16.654 20.539-22.27 7.412-5.615 15.12-8.73 22.95-8.045 15.054 1.317 28.463 9.56 41.925 17.834 1.275.784 2.551 1.569 3.829 2.348 14.485 8.827 29.359 17.023 45.719 13.436 5.534-1.213 9.264-3.81 11.611-7.164 2.314-3.307 3.146-7.15 3.29-10.663.144-3.518-.395-6.843-.955-9.26a39.89 39.89 0 00-.747-2.773c3.625-3.649 7.463-5.774 11.425-6.73 4.295-1.038 8.887-.738 13.718.69 9.73 2.879 20.14 10.253 30.3 19.735 18.614 17.373 35.693 41.144 45.359 54.684z" fill="'+t+'" stroke="#000" stroke-width="4.274"/>'}},C={apricot:"#F9C9B6",coast:"#AC6651",topaz:"#77311D",lavender:"#9287FF",sky:"#6BD9E9",salmon:"#FC909F",canary:"#F4D150",calm:"#E0DDFF",azure:"#D2EFF3",seashell:"#FFEDEF",mellow:"#FFEBA4",black:"#000000",white:"#FFFFFF"},F={meta:{title:"Avatar Illustration System",creator:"Micah Lanier",source:"https://www.figma.com/community/file/829741575478342595",license:{name:"CC BY 4.0",link:"https://creativecommons.org/licenses/by/4.0/"}},schema:{$id:"https://avatars.dicebear.com/styles/micah/schema.json",type:"object",definitions:{colors:{type:"array",items:{oneOf:[{type:"string",enum:["apricot","coast","topaz","lavender","sky","salmon","canary","calm","azure","seashell","mellow","black","white"]},{$ref:"../../schema.json#/definitions/color"}]},default:["apricot","coast","topaz","lavender","sky","salmon","canary","calm","azure","seashell","mellow","black","white"],examples:[["apricot"],["coast"],["topaz"],["lavender"],["sky"],["salmon"],["canary"],["calm"],["azure"],["seashell"],["mellow"],["black"],["white"]]}},allOf:[{$ref:"../../schema.json"},{properties:{base:{type:"array",title:"Base",items:{type:"string",enum:["standard"]},default:["standard"],examples:["standard"]},baseColor:{$ref:"#/definitions/colors",title:"Base Color",default:["apricot","coast","topaz"],examples:[["apricot"],["coast"],["topaz"]]},earrings:{type:"array",title:"Earrings",items:{type:"string",enum:["hoop","stud"]},default:["hoop","stud"],examples:[[],["hoop"],["stud"]]},earringColor:{$ref:"#/definitions/colors",title:"Earring Color"},earringsProbability:{$ref:"../../schema.json#/definitions/probability",title:"Earrings Probability",default:30,examples:[100]},eyebrows:{type:"array",title:"Eyebrows",items:{type:"string",enum:["eyelashesDown","eyelashesUp","down","up"]},default:["eyelashesDown","eyelashesUp","down","up"],examples:[["eyelashesDown"],["eyelashesUp"],["down"],["up"]]},eyebrowColor:{$ref:"#/definitions/colors",title:"Eyebrow Color",default:["black"],examples:[["black"]]},ears:{type:"array",title:"Ears",items:{type:"string",enum:["attached"]},default:["attached"]},eyes:{type:"array",title:"Eyes",items:{type:"string",enum:["smiling","eyes","eyesShadow","round"]},default:["smiling","eyes","eyesShadow","round"],examples:[["smiling"],["eyes"],["eyesShadow"],["round"]]},eyeColor:{$ref:"#/definitions/colors",title:"Eye Color",default:["calm","azure","seahell","mellow","white"],examples:[["calm"],["azure"],["seahell"],["mellow"],["white"]]},facialHair:{type:"array",title:"Facial Hair",items:{type:"string",enum:["beard","scruff"]},default:["beard","scruff"],examples:[[],["beard"],["scruff"]]},facialHairColor:{$ref:"#/definitions/colors",title:"Facial Hair Color",default:["topaz"]},facialHairProbability:{$ref:"../../schema.json#/definitions/probability",title:"Facial Hair Probability",default:10,examples:[100]},glasses:{type:"array",title:"Glasses",items:{type:"string",enum:["round","square"]},default:["round","square"],examples:[[],["round"],["square"]]},glassesColor:{$ref:"#/definitions/colors",title:"Glasses Color"},glassesProbability:{$ref:"../../schema.json#/definitions/probability",title:"Glasses Probability",default:30,examples:[100]},mouth:{type:"array",title:"Mouth",items:{type:"string",enum:["laughing","nervous","pucker","sad","smile","smirk","surprised","frown"]},default:["laughing","nervous","pucker","sad","smile","smirk","surprised","frown"],examples:[["laughing"],["nervous"],["pucker"],["sad"],["smile"],["smirk"],["surprised"],["frown"]]},nose:{type:"array",title:"Nose",items:{type:"string",enum:["curve","pointed","round"]},default:["curve","pointed","round"],examples:[["curve"],["pointed"],["round"]]},shirt:{type:"array",title:"Shirt",items:{type:"string",enum:["collared","crew","open"]},default:["collared","crew","open"],examples:[["collared"],["crew"],["open"]]},shirtColor:{$ref:"#/definitions/colors",title:"Shirt Color"},hair:{type:"array",title:"Hair",items:{type:"string",enum:["pixie","dannyPhantom","dougFunny","fonze","full","mrClean","mrT","turban"]},default:["pixie","dannyPhantom","dougFunny","fonze","full","mrClean","mrT","turban"],examples:[[],["pixie"],["dannyPhantom"],["dougFunny"],["fonze"],["full"],["mrClean"],["mrT"],["turban"]]},hairColor:{$ref:"#/definitions/colors",title:"Hair Color"},hairProbability:{$ref:"../../schema.json#/definitions/probability",title:"Hair Probability",default:100,examples:[100]}}}]},colors:C,create:function(t){var e=t.prng,a=t.options,i=function(t,r){void 0===r&&(r=[]);var a=t.map(function(t){return C[t]||t}).filter(function(t){return !1===r.includes(t)});return a.length>0?e.pick(a):t[0]||"transparent"},o=function(t,r){void 0===r&&(r=[]);var a=r.map(function(e){return t[e]});return a.length>0?e.pick(a):void 0},n=i(a.baseColor),l=i(a.hairColor,[n]),s=i(a.shirtColor,[n]),c=i(a.earringColor,[n,l]),u=i(a.glassesColor,[n,l]),d=i(a.eyeColor,[n,u]),m=i(a.eyebrowColor,[n,u,d]),f=i(a.facialHairColor,[n]),F=o(x,a.shirt),S=e.bool(a.earringsProbability)&&o(p,a.earrings),$=o(y,a.ears),E=o(M,a.nose),L=e.bool(a.glassesProbability)&&o(k,a.glasses),j=o(z,a.eyes),P=o(g,a.eyebrows),_=o(v,a.mouth),D=e.bool(a.hairProbability)&&o(b,a.hair),O=e.bool(a.facialHairProbability)&&o(w,a.facialHair),A=o(h,a.base);return {attributes:{viewBox:"0 0 360 360",fill:"none"},body:""+(A?r({children:A(n),x:90,y:43}):"")+(O?r({children:O(f),x:124,y:145.3}):"")+(_?r({children:_("#000"),x:180,y:203}):"")+(P?r({children:P(m),x:120,y:122}):"")+(D?r({children:D(l),x:59,y:31}):"")+(j?r({children:j(d),x:152,y:139}):"")+(L?r({children:L(u),x:112,y:131}):"")+(E?r({children:E("#000"),x:186.37,y:168.42}):"")+($?r({children:$(n),x:94,y:174}):"")+(S?r({children:S(c),x:97,y:209}):"")+(F?r({children:F(s),x:63,y:292}):"")}}};

    /* src/components/Icon.svelte generated by Svelte v3.29.4 */

    const file = "src/components/Icon.svelte";

    // (13:2) {#if name === 'refresh'}
    function create_if_block_4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15");
    			add_location(path, file, 13, 4, 235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(13:2) {#if name === 'refresh'}",
    		ctx
    	});

    	return block;
    }

    // (21:2) {#if name === 'download'}
    function create_if_block_3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4");
    			add_location(path, file, 21, 4, 485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(21:2) {#if name === 'download'}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if name === 'chevron-left'}
    function create_if_block_2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M15 19l-7-7 7-7");
    			add_location(path, file, 29, 4, 694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(29:2) {#if name === 'chevron-left'}",
    		ctx
    	});

    	return block;
    }

    // (33:2) {#if name === 'chevron-right'}
    function create_if_block_1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M9 5l7 7-7 7");
    			add_location(path, file, 33, 4, 833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(33:2) {#if name === 'chevron-right'}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if name === 'check'}
    function create_if_block(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M5 13l4 4L19 7");
    			add_location(path, file, 37, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:2) {#if name === 'check'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let svg;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let if_block2_anchor;
    	let if_block3_anchor;
    	let if_block0 = /*name*/ ctx[0] === "refresh" && create_if_block_4(ctx);
    	let if_block1 = /*name*/ ctx[0] === "download" && create_if_block_3(ctx);
    	let if_block2 = /*name*/ ctx[0] === "chevron-left" && create_if_block_2(ctx);
    	let if_block3 = /*name*/ ctx[0] === "chevron-right" && create_if_block_1(ctx);
    	let if_block4 = /*name*/ ctx[0] === "check" && create_if_block(ctx);

    	const block = {
    		c: function create() {
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
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "width", /*size*/ ctx[1]);
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			add_location(svg, file, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block0) if_block0.m(svg, null);
    			append_dev(svg, if_block0_anchor);
    			if (if_block1) if_block1.m(svg, null);
    			append_dev(svg, if_block1_anchor);
    			if (if_block2) if_block2.m(svg, null);
    			append_dev(svg, if_block2_anchor);
    			if (if_block3) if_block3.m(svg, null);
    			append_dev(svg, if_block3_anchor);
    			if (if_block4) if_block4.m(svg, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*name*/ ctx[0] === "refresh") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(svg, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*name*/ ctx[0] === "download") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(svg, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*name*/ ctx[0] === "chevron-left") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					if_block2.m(svg, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*name*/ ctx[0] === "chevron-right") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_1(ctx);
    					if_block3.c();
    					if_block3.m(svg, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name*/ ctx[0] === "check") {
    				if (if_block4) ; else {
    					if_block4 = create_if_block(ctx);
    					if_block4.c();
    					if_block4.m(svg, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	
    	let { name } = $$props;
    	let { size = 24 } = $$props;
    	const writable_props = ["name", "size"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ name, size });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, size];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Icon> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.29.4 */
    const file$1 = "src/components/Button.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-1jvfo6m-style";
    	style.textContent = "button.svelte-1jvfo6m{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button.svelte-1jvfo6m{overflow:visible}button.svelte-1jvfo6m{text-transform:none}button.svelte-1jvfo6m{-webkit-appearance:button}button.svelte-1jvfo6m::-moz-focus-inner{border-style:none;padding:0}button.svelte-1jvfo6m:-moz-focusring{outline:1px dotted ButtonText}button.svelte-1jvfo6m{background-color:transparent;background-image:none}button.svelte-1jvfo6m:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.svelte-1jvfo6m,.svelte-1jvfo6m::before,.svelte-1jvfo6m::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}button.svelte-1jvfo6m{cursor:pointer}button.svelte-1jvfo6m{padding:0;line-height:inherit;color:inherit}.bg-white.svelte-1jvfo6m{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.hover\\:bg-gray-900.svelte-1jvfo6m:hover{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26, 32, 44, var(--bg-opacity))}.rounded.svelte-1jvfo6m{border-radius:0.25rem}.inline-flex.svelte-1jvfo6m{display:inline-flex}.items-center.svelte-1jvfo6m{align-items:center}.justify-center.svelte-1jvfo6m{justify-content:center}.h-10.svelte-1jvfo6m{height:2.5rem}.focus\\:outline-none.svelte-1jvfo6m:focus{outline:2px solid transparent;outline-offset:2px}.px-4.svelte-1jvfo6m{padding-left:1rem;padding-right:1rem}.shadow-md.svelte-1jvfo6m{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.hover\\:text-white.svelte-1jvfo6m:hover{--text-opacity:1;color:#fff;color:rgba(255, 255, 255, var(--text-opacity))}.w-10.svelte-1jvfo6m{width:2.5rem}@keyframes svelte-1jvfo6m-spin{to{transform:rotate(360deg)}}@keyframes svelte-1jvfo6m-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-1jvfo6m-pulse{50%{opacity:.5}}@keyframes svelte-1jvfo6m-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQnV0dG9uLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPmltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG47XG5pbXBvcnQgSWNvbiBmcm9tICcuL0ljb24uc3ZlbHRlJztcbmV4cG9ydCBsZXQgaWNvbiA9IHVuZGVmaW5lZDtcbmNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG48L3NjcmlwdD5cblxuPHN0eWxlPi8qKiBCdXR0b24gKDw9IEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzQzMTMpICovXG5cbi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYiB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbiB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5cblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cbiAqL1xuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBNYW51YWxseSBmb3JrZWQgZnJvbSBTVUlUIENTUyBCYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3VpdGNzcy9iYXNlXG4gKiBBIHRoaW4gbGF5ZXIgb24gdG9wIG9mIG5vcm1hbGl6ZS5jc3MgdGhhdCBwcm92aWRlcyBhIHN0YXJ0aW5nIHBvaW50IG1vcmVcbiAqIHN1aXRhYmxlIGZvciB3ZWIgYXBwbGljYXRpb25zLlxuICovXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZGVmYXVsdCBzcGFjaW5nIGFuZCBib3JkZXIgZm9yIGFwcHJvcHJpYXRlIGVsZW1lbnRzLlxuICovXG5cblxuaDEsXG5oMixcbnAge1xuICBtYXJnaW46IDA7XG59XG5cbmJ1dHRvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xufVxuXG4vKipcbiAqIFdvcmsgYXJvdW5kIGEgRmlyZWZveC9JRSBidWcgd2hlcmUgdGhlIHRyYW5zcGFyZW50IGBidXR0b25gIGJhY2tncm91bmRcbiAqIHJlc3VsdHMgaW4gYSBsb3NzIG9mIHRoZSBkZWZhdWx0IGBidXR0b25gIGZvY3VzIHN0eWxlcy5cbiAqL1xuXG5idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiAxcHggZG90dGVkO1xuICBvdXRsaW5lOiA1cHggYXV0byAtd2Via2l0LWZvY3VzLXJpbmctY29sb3I7XG59XG5cbi8qKlxuICogVGFpbHdpbmQgY3VzdG9tIHJlc2V0IHN0eWxlc1xuICovXG5cbi8qKlxuICogMS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBgc2Fuc2AgZm9udC1mYW1pbHkgKHdpdGggVGFpbHdpbmQncyBkZWZhdWx0XG4gKiAgICBzYW5zLXNlcmlmIGZvbnQgc3RhY2sgYXMgYSBmYWxsYmFjaykgYXMgYSBzYW5lIGRlZmF1bHQuXG4gKiAyLiBVc2UgVGFpbHdpbmQncyBkZWZhdWx0IFwibm9ybWFsXCIgbGluZS1oZWlnaHQgc28gdGhlIHVzZXIgaXNuJ3QgZm9yY2VkXG4gKiAgICB0byBvdmVycmlkZSBpdCB0byBlbnN1cmUgY29uc2lzdGVuY3kgZXZlbiB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHRoZW1lLlxuICovXG5cbmh0bWwge1xuICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuNTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIFByZXZlbnQgcGFkZGluZyBhbmQgYm9yZGVyIGZyb20gYWZmZWN0aW5nIGVsZW1lbnQgd2lkdGguXG4gKlxuICogICAgV2UgdXNlZCB0byBzZXQgdGhpcyBpbiB0aGUgaHRtbCBlbGVtZW50IGFuZCBpbmhlcml0IGZyb21cbiAqICAgIHRoZSBwYXJlbnQgZWxlbWVudCBmb3IgZXZlcnl0aGluZyBlbHNlLiBUaGlzIGNhdXNlZCBpc3N1ZXNcbiAqICAgIGluIHNoYWRvdy1kb20tZW5oYW5jZWQgZWxlbWVudHMgbGlrZSA8ZGV0YWlscz4gd2hlcmUgdGhlIGNvbnRlbnRcbiAqICAgIGlzIHdyYXBwZWQgYnkgYSBkaXYgd2l0aCBib3gtc2l6aW5nIHNldCB0byBgY29udGVudC1ib3hgLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvNFxuICpcbiAqXG4gKiAyLiBBbGxvdyBhZGRpbmcgYSBib3JkZXIgdG8gYW4gZWxlbWVudCBieSBqdXN0IGFkZGluZyBhIGJvcmRlci13aWR0aC5cbiAqXG4gKiAgICBCeSBkZWZhdWx0LCB0aGUgd2F5IHRoZSBicm93c2VyIHNwZWNpZmllcyB0aGF0IGFuIGVsZW1lbnQgc2hvdWxkIGhhdmUgbm9cbiAqICAgIGJvcmRlciBpcyBieSBzZXR0aW5nIGl0J3MgYm9yZGVyLXN0eWxlIHRvIGBub25lYCBpbiB0aGUgdXNlci1hZ2VudFxuICogICAgc3R5bGVzaGVldC5cbiAqXG4gKiAgICBJbiBvcmRlciB0byBlYXNpbHkgYWRkIGJvcmRlcnMgdG8gZWxlbWVudHMgYnkganVzdCBzZXR0aW5nIHRoZSBgYm9yZGVyLXdpZHRoYFxuICogICAgcHJvcGVydHksIHdlIGNoYW5nZSB0aGUgZGVmYXVsdCBib3JkZXItc3R5bGUgZm9yIGFsbCBlbGVtZW50cyB0byBgc29saWRgLCBhbmRcbiAqICAgIHVzZSBib3JkZXItd2lkdGggdG8gaGlkZSB0aGVtIGluc3RlYWQuIFRoaXMgd2F5IG91ciBgYm9yZGVyYCB1dGlsaXRpZXMgb25seVxuICogICAgbmVlZCB0byBzZXQgdGhlIGBib3JkZXItd2lkdGhgIHByb3BlcnR5IGluc3RlYWQgb2YgdGhlIGVudGlyZSBgYm9yZGVyYFxuICogICAgc2hvcnRoYW5kLCBtYWtpbmcgb3VyIGJvcmRlciB1dGlsaXRpZXMgbXVjaCBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCB0byBjb21wb3NlLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9wdWxsLzExNlxuICovXG5cbiosXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGJvcmRlci13aWR0aDogMDsgLyogMiAqL1xuICBib3JkZXItc3R5bGU6IHNvbGlkOyAvKiAyICovXG4gIGJvcmRlci1jb2xvcjogI2UyZThmMDsgLyogMiAqL1xufVxuXG4vKlxuICogRW5zdXJlIGhvcml6b250YWwgcnVsZXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdFxuICovXG5cbi8qKlxuICogVW5kbyB0aGUgYGJvcmRlci1zdHlsZTogbm9uZWAgcmVzZXQgdGhhdCBOb3JtYWxpemUgYXBwbGllcyB0byBpbWFnZXMgc28gdGhhdFxuICogb3VyIGBib3JkZXIte3dpZHRofWAgdXRpbGl0aWVzIGhhdmUgdGhlIGV4cGVjdGVkIGVmZmVjdC5cbiAqXG4gKiBUaGUgTm9ybWFsaXplIHJlc2V0IGlzIHVubmVjZXNzYXJ5IGZvciB1cyBzaW5jZSB3ZSBkZWZhdWx0IHRoZSBib3JkZXItd2lkdGhcbiAqIHRvIDAgb24gYWxsIGVsZW1lbnRzLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9pc3N1ZXMvMzYyXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbn1cblxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNhMGFlYzA7XG59XG5cbmJ1dHRvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaDEsXG5oMiB7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgbGlua3MgdG8gb3B0aW1pemUgZm9yIG9wdC1pbiBzdHlsaW5nIGluc3RlYWQgb2ZcbiAqIG9wdC1vdXQuXG4gKi9cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgZm9ybSBlbGVtZW50IHByb3BlcnRpZXMgdGhhdCBhcmUgZWFzeSB0byBmb3JnZXQgdG9cbiAqIHN0eWxlIGV4cGxpY2l0bHkgc28geW91IGRvbid0IGluYWR2ZXJ0ZW50bHkgaW50cm9kdWNlXG4gKiBzdHlsZXMgdGhhdCBkZXZpYXRlIGZyb20geW91ciBkZXNpZ24gc3lzdGVtLiBUaGVzZSBzdHlsZXNcbiAqIHN1cHBsZW1lbnQgYSBwYXJ0aWFsIHJlc2V0IHRoYXQgaXMgYWxyZWFkeSBhcHBsaWVkIGJ5XG4gKiBub3JtYWxpemUuY3NzLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgcGFkZGluZzogMDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuXG4vKipcbiAqIFVzZSB0aGUgY29uZmlndXJlZCAnbW9ubycgZm9udCBmYW1pbHkgZm9yIGVsZW1lbnRzIHRoYXRcbiAqIGFyZSBleHBlY3RlZCB0byBiZSByZW5kZXJlZCB3aXRoIGEgbW9ub3NwYWNlIGZvbnQsIGZhbGxpbmdcbiAqIGJhY2sgdG8gdGhlIHN5c3RlbSBtb25vc3BhY2Ugc3RhY2sgaWYgdGhlcmUgaXMgbm8gY29uZmlndXJlZFxuICogJ21vbm8nIGZvbnQgZmFtaWx5LlxuICovXG5cbi8qKlxuICogTWFrZSByZXBsYWNlZCBlbGVtZW50cyBgZGlzcGxheTogYmxvY2tgIGJ5IGRlZmF1bHQgYXMgdGhhdCdzXG4gKiB0aGUgYmVoYXZpb3IgeW91IHdhbnQgYWxtb3N0IGFsbCBvZiB0aGUgdGltZS4gSW5zcGlyZWQgYnlcbiAqIENTUyBSZW1lZHksIHdpdGggYHN2Z2AgYWRkZWQgYXMgd2VsbC5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nLFxuc3ZnLFxub2JqZWN0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi8qKlxuICogQ29uc3RyYWluIGltYWdlcyBhbmQgdmlkZW9zIHRvIHRoZSBwYXJlbnQgd2lkdGggYW5kIHByZXNlcnZlXG4gKiB0aGVpciBpbnN0cmluc2ljIGFzcGVjdCByYXRpby5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi5iZy13aGl0ZSB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTEwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZmFmYztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDcsIDI1MCwgMjUyLCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTIwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZjJmNztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5ob3ZlclxcOmJnLWdyYXktOTAwOmhvdmVyIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWEyMDJjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI2LCAzMiwgNDQsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJvcmRlci13aGl0ZSB7XG4gIC0tYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLWJvcmRlci1vcGFjaXR5KSk7XG59XG5cbi5ib3JkZXItZ3JheS0yMDAge1xuICAtLWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6ICNlZGYyZjc7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1ib3JkZXItb3BhY2l0eSkpO1xufVxuXG4ucm91bmRlZCB7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi5yb3VuZGVkLWxnIHtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xufVxuXG4uYm9yZGVyLTIge1xuICBib3JkZXItd2lkdGg6IDJweDtcbn1cblxuLmJvcmRlci04IHtcbiAgYm9yZGVyLXdpZHRoOiA4cHg7XG59XG5cbi5ib3JkZXIge1xuICBib3JkZXItd2lkdGg6IDFweDtcbn1cblxuLmlubGluZS1ibG9jayB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZsZXgge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5saW5lLWZsZXgge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbn1cblxuLmdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLml0ZW1zLWVuZCB7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbn1cblxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5qdXN0aWZ5LWVuZCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uZmxleC1ncm93IHtcbiAgZmxleC1ncm93OiAxO1xufVxuXG4uZm9udC1zZW1pYm9sZCB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi5oLTIge1xuICBoZWlnaHQ6IDAuNXJlbTtcbn1cblxuLmgtMTAge1xuICBoZWlnaHQ6IDIuNXJlbTtcbn1cblxuLmgtMzIge1xuICBoZWlnaHQ6IDhyZW07XG59XG5cbi50ZXh0LXhzIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBsaW5lLWhlaWdodDogMXJlbTtcbn1cblxuLnRleHQteGwge1xuICBmb250LXNpemU6IDEuMjVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjc1cmVtO1xufVxuXG4udGV4dC0yeGwge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDJyZW07XG59XG5cbi5tci0yIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5tbC0yIHtcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbn1cblxuLm1iLTYge1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG5cbi5tYi04IHtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbn1cblxuLi1tdC0xNiB7XG4gIG1hcmdpbi10b3A6IC00cmVtO1xufVxuXG4uZm9jdXNcXDpvdXRsaW5lLW5vbmU6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIG91dGxpbmUtb2Zmc2V0OiAycHg7XG59XG5cbi5vdmVyZmxvdy1oaWRkZW4ge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4ucC02IHtcbiAgcGFkZGluZzogMS41cmVtO1xufVxuXG4ucC0xMiB7XG4gIHBhZGRpbmc6IDNyZW07XG59XG5cbi5weC00IHtcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAxcmVtO1xufVxuXG4ucHQtMSB7XG4gIHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ucHItMiB7XG4gIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbn1cblxuLmZpeGVkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uYWJzb2x1dGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5yZWxhdGl2ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLnRvcC0wIHtcbiAgdG9wOiAwO1xufVxuXG4ucmlnaHQtMCB7XG4gIHJpZ2h0OiAwO1xufVxuXG4ubGVmdC0wIHtcbiAgbGVmdDogMDtcbn1cblxuLnNoYWRvdy1tZCB7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCAycHggNHB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuLnRleHQtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udGV4dC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG4udGV4dC1ncmF5LTQwMCB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2NiZDVlMDtcbiAgY29sb3I6IHJnYmEoMjAzLCAyMTMsIDIyNCwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi50ZXh0LWdyYXktNjAwIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjNzE4MDk2O1xuICBjb2xvcjogcmdiYSgxMTMsIDEyOCwgMTUwLCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLnRleHQtZ3JheS03MDAge1xuICAtLXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6ICM0YTU1Njg7XG4gIGNvbG9yOiByZ2JhKDc0LCA4NSwgMTA0LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLmhvdmVyXFw6dGV4dC13aGl0ZTpob3ZlciB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2ZmZjtcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi5jYXBpdGFsaXplIHtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG59XG5cbi5ob3ZlclxcOnVuZGVybGluZTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4udmlzaWJsZSB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59XG5cbi53LTEwIHtcbiAgd2lkdGg6IDIuNXJlbTtcbn1cblxuLnctMzIge1xuICB3aWR0aDogOHJlbTtcbn1cblxuLnctMVxcLzMge1xuICB3aWR0aDogMzMuMzMzMzMzJTtcbn1cblxuLmdhcC0xMCB7XG4gIGdyaWQtZ2FwOiAyLjVyZW07XG4gIGdhcDogMi41cmVtO1xufVxuXG4uZ3JpZC1jb2xzLWNhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpO1xufVxuXG4udHJhbnNmb3JtIHtcbiAgLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS15OiAwO1xuICAtLXRyYW5zZm9ybS1yb3RhdGU6IDA7XG4gIC0tdHJhbnNmb3JtLXNrZXcteDogMDtcbiAgLS10cmFuc2Zvcm0tc2tldy15OiAwO1xuICAtLXRyYW5zZm9ybS1zY2FsZS14OiAxO1xuICAtLXRyYW5zZm9ybS1zY2FsZS15OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgodmFyKC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS14KSkgdHJhbnNsYXRlWSh2YXIoLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXkpKSByb3RhdGUodmFyKC0tdHJhbnNmb3JtLXJvdGF0ZSkpIHNrZXdYKHZhcigtLXRyYW5zZm9ybS1za2V3LXgpKSBza2V3WSh2YXIoLS10cmFuc2Zvcm0tc2tldy15KSkgc2NhbGVYKHZhcigtLXRyYW5zZm9ybS1zY2FsZS14KSkgc2NhbGVZKHZhcigtLXRyYW5zZm9ybS1zY2FsZS15KSk7XG59XG5cbi50cmFuc2l0aW9uLWFsbCB7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IGFsbDtcbn1cblxuLmVhc2Utb3V0IHtcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uZHVyYXRpb24tMTUwIHtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMTUwbXM7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcGluZyB7XG4gIDc1JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICA1MCUge1xuICAgIG9wYWNpdHk6IC41O1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjUlKTtcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC44LDAsMSwxKTtcbiAgfVxuXG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLDAsMC4yLDEpO1xuICB9XG59XG5cbi5iZy10cmFuc3BhcmVudC1zaGFwZSB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAyMCUyMDIwJTIyJTIwZmlsbCUzRCUyMm5vbmUlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyMiUzRSUwQSUzQ3JlY3QlMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjBmaWxsJTNEJTIyd2hpdGUlMjIlMkYlM0UlMEElM0NyZWN0JTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wMyUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB4JTNEJTIyMTAlMjIlMjB5JTNEJTIyMTAlMjIlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjAzJTIyJTJGJTNFJTBBJTNDcmVjdCUyMHglM0QlMjIxMCUyMiUyMHdpZHRoJTNEJTIyMTAlMjIlMjBoZWlnaHQlM0QlMjIxMCUyMiUyMGZpbGwlM0QlMjJibGFjayUyMiUyMGZpbGwtb3BhY2l0eSUzRCUyMjAuMDYlMjIlMkYlM0UlMEElM0NyZWN0JTIweSUzRCUyMjEwJTIyJTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wNiUyMiUyRiUzRSUwQSUzQyUyRnN2ZyUzRSUwQSk7XG59PC9zdHlsZT5cblxuPGJ1dHRvblxuICBjbGFzcz1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy13aGl0ZSByb3VuZGVkIGhvdmVyOmJnLWdyYXktOTAwIGhvdmVyOnRleHQtd2hpdGUgaC0xMCB7aWNvbiA/ICd3LTEwJyA6ICdweC00J30gc2hhZG93LW1kIGZvY3VzOm91dGxpbmUtbm9uZVwiXG4gIG9uOmNsaWNrPXsoKSA9PiBkaXNwYXRjaCgnY2xpY2snKX0+XG4gIHsjaWYgaWNvbn1cbiAgICA8SWNvbiBuYW1lPXtpY29ufSAvPlxuICB7OmVsc2V9XG4gICAgPHNsb3QgLz5cbiAgey9pZn1cbjwvYnV0dG9uPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXNJQSxNQUFNLGVBQ0EsQ0FBQyxBQUNMLFdBQVcsQ0FBRSxPQUFPLENBQ3BCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElBQUksQ0FDakIsTUFBTSxDQUFFLENBQUMsQUFDWCxDQUFDLEFBT0QsTUFBTSxlQUNBLENBQUMsQUFDTCxRQUFRLENBQUUsT0FBTyxBQUNuQixDQUFDLEFBT0QsTUFBTSxlQUFDLENBQUMsQUFDTixjQUFjLENBQUUsSUFBSSxBQUN0QixDQUFDLEFBTUQsTUFBTSxlQUNVLENBQUMsQUFDZixrQkFBa0IsQ0FBRSxNQUFNLEFBQzVCLENBQUMsQUFNRCxxQkFBTSxrQkFBa0IsQUFDVSxDQUFDLEFBQ2pDLFlBQVksQ0FBRSxJQUFJLENBQ2xCLE9BQU8sQ0FBRSxDQUFDLEFBQ1osQ0FBQyxBQU1ELHFCQUFNLGVBQWUsQUFDVSxDQUFDLEFBQzlCLE9BQU8sQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQUFDaEMsQ0FBQyxBQXNHRCxNQUFNLGVBQUMsQ0FBQyxBQUNOLGdCQUFnQixDQUFFLFdBQVcsQ0FDN0IsZ0JBQWdCLENBQUUsSUFBSSxBQUN4QixDQUFDLEFBT0QscUJBQU0sTUFBTSxB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 */";
    	append_dev(document.head, style);
    }

    // (784:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(784:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (782:2) {#if icon}
    function create_if_block$1(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: { name: /*icon*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty & /*icon*/ 1) icon_1_changes.name = /*icon*/ ctx[0];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(782:2) {#if icon}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
    			button = element("button");
    			if_block.c();
    			attr_dev(button, "class", button_class_value = "inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 " + (/*icon*/ ctx[0] ? "w-10" : "px-4") + " shadow-md focus:outline-none" + " svelte-1jvfo6m");
    			add_location(button, file$1, 778, 0, 14461);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if_blocks[current_block_type_index].m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	
    	let { icon = undefined } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ["icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("click");

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Icon,
    		icon,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, dispatch, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1jvfo6m-style")) add_css();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { icon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/scenes/Form.svelte generated by Svelte v3.29.4 */

    const file$2 = "src/components/scenes/Form.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-17k5r4-style";
    	style.textContent = ".svelte-17k5r4,.svelte-17k5r4::before,.svelte-17k5r4::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes svelte-17k5r4-spin{to{transform:rotate(360deg)}}@keyframes svelte-17k5r4-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-17k5r4-pulse{50%{opacity:.5}}@keyframes svelte-17k5r4-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybS5zdmVsdGUiLCJzb3VyY2VzIjpbIkZvcm0uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+PC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiogU2NlbmVzL0Zvcm0gKDw9IEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzQzMTMpICovXG5cbi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYiB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbiB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5cblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cbiAqL1xuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBNYW51YWxseSBmb3JrZWQgZnJvbSBTVUlUIENTUyBCYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3VpdGNzcy9iYXNlXG4gKiBBIHRoaW4gbGF5ZXIgb24gdG9wIG9mIG5vcm1hbGl6ZS5jc3MgdGhhdCBwcm92aWRlcyBhIHN0YXJ0aW5nIHBvaW50IG1vcmVcbiAqIHN1aXRhYmxlIGZvciB3ZWIgYXBwbGljYXRpb25zLlxuICovXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZGVmYXVsdCBzcGFjaW5nIGFuZCBib3JkZXIgZm9yIGFwcHJvcHJpYXRlIGVsZW1lbnRzLlxuICovXG5cblxuaDEsXG5oMixcbnAge1xuICBtYXJnaW46IDA7XG59XG5cbmJ1dHRvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xufVxuXG4vKipcbiAqIFdvcmsgYXJvdW5kIGEgRmlyZWZveC9JRSBidWcgd2hlcmUgdGhlIHRyYW5zcGFyZW50IGBidXR0b25gIGJhY2tncm91bmRcbiAqIHJlc3VsdHMgaW4gYSBsb3NzIG9mIHRoZSBkZWZhdWx0IGBidXR0b25gIGZvY3VzIHN0eWxlcy5cbiAqL1xuXG5idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiAxcHggZG90dGVkO1xuICBvdXRsaW5lOiA1cHggYXV0byAtd2Via2l0LWZvY3VzLXJpbmctY29sb3I7XG59XG5cbi8qKlxuICogVGFpbHdpbmQgY3VzdG9tIHJlc2V0IHN0eWxlc1xuICovXG5cbi8qKlxuICogMS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBgc2Fuc2AgZm9udC1mYW1pbHkgKHdpdGggVGFpbHdpbmQncyBkZWZhdWx0XG4gKiAgICBzYW5zLXNlcmlmIGZvbnQgc3RhY2sgYXMgYSBmYWxsYmFjaykgYXMgYSBzYW5lIGRlZmF1bHQuXG4gKiAyLiBVc2UgVGFpbHdpbmQncyBkZWZhdWx0IFwibm9ybWFsXCIgbGluZS1oZWlnaHQgc28gdGhlIHVzZXIgaXNuJ3QgZm9yY2VkXG4gKiAgICB0byBvdmVycmlkZSBpdCB0byBlbnN1cmUgY29uc2lzdGVuY3kgZXZlbiB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHRoZW1lLlxuICovXG5cbmh0bWwge1xuICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuNTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIFByZXZlbnQgcGFkZGluZyBhbmQgYm9yZGVyIGZyb20gYWZmZWN0aW5nIGVsZW1lbnQgd2lkdGguXG4gKlxuICogICAgV2UgdXNlZCB0byBzZXQgdGhpcyBpbiB0aGUgaHRtbCBlbGVtZW50IGFuZCBpbmhlcml0IGZyb21cbiAqICAgIHRoZSBwYXJlbnQgZWxlbWVudCBmb3IgZXZlcnl0aGluZyBlbHNlLiBUaGlzIGNhdXNlZCBpc3N1ZXNcbiAqICAgIGluIHNoYWRvdy1kb20tZW5oYW5jZWQgZWxlbWVudHMgbGlrZSA8ZGV0YWlscz4gd2hlcmUgdGhlIGNvbnRlbnRcbiAqICAgIGlzIHdyYXBwZWQgYnkgYSBkaXYgd2l0aCBib3gtc2l6aW5nIHNldCB0byBgY29udGVudC1ib3hgLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvNFxuICpcbiAqXG4gKiAyLiBBbGxvdyBhZGRpbmcgYSBib3JkZXIgdG8gYW4gZWxlbWVudCBieSBqdXN0IGFkZGluZyBhIGJvcmRlci13aWR0aC5cbiAqXG4gKiAgICBCeSBkZWZhdWx0LCB0aGUgd2F5IHRoZSBicm93c2VyIHNwZWNpZmllcyB0aGF0IGFuIGVsZW1lbnQgc2hvdWxkIGhhdmUgbm9cbiAqICAgIGJvcmRlciBpcyBieSBzZXR0aW5nIGl0J3MgYm9yZGVyLXN0eWxlIHRvIGBub25lYCBpbiB0aGUgdXNlci1hZ2VudFxuICogICAgc3R5bGVzaGVldC5cbiAqXG4gKiAgICBJbiBvcmRlciB0byBlYXNpbHkgYWRkIGJvcmRlcnMgdG8gZWxlbWVudHMgYnkganVzdCBzZXR0aW5nIHRoZSBgYm9yZGVyLXdpZHRoYFxuICogICAgcHJvcGVydHksIHdlIGNoYW5nZSB0aGUgZGVmYXVsdCBib3JkZXItc3R5bGUgZm9yIGFsbCBlbGVtZW50cyB0byBgc29saWRgLCBhbmRcbiAqICAgIHVzZSBib3JkZXItd2lkdGggdG8gaGlkZSB0aGVtIGluc3RlYWQuIFRoaXMgd2F5IG91ciBgYm9yZGVyYCB1dGlsaXRpZXMgb25seVxuICogICAgbmVlZCB0byBzZXQgdGhlIGBib3JkZXItd2lkdGhgIHByb3BlcnR5IGluc3RlYWQgb2YgdGhlIGVudGlyZSBgYm9yZGVyYFxuICogICAgc2hvcnRoYW5kLCBtYWtpbmcgb3VyIGJvcmRlciB1dGlsaXRpZXMgbXVjaCBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCB0byBjb21wb3NlLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9wdWxsLzExNlxuICovXG5cbiosXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGJvcmRlci13aWR0aDogMDsgLyogMiAqL1xuICBib3JkZXItc3R5bGU6IHNvbGlkOyAvKiAyICovXG4gIGJvcmRlci1jb2xvcjogI2UyZThmMDsgLyogMiAqL1xufVxuXG4vKlxuICogRW5zdXJlIGhvcml6b250YWwgcnVsZXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdFxuICovXG5cbi8qKlxuICogVW5kbyB0aGUgYGJvcmRlci1zdHlsZTogbm9uZWAgcmVzZXQgdGhhdCBOb3JtYWxpemUgYXBwbGllcyB0byBpbWFnZXMgc28gdGhhdFxuICogb3VyIGBib3JkZXIte3dpZHRofWAgdXRpbGl0aWVzIGhhdmUgdGhlIGV4cGVjdGVkIGVmZmVjdC5cbiAqXG4gKiBUaGUgTm9ybWFsaXplIHJlc2V0IGlzIHVubmVjZXNzYXJ5IGZvciB1cyBzaW5jZSB3ZSBkZWZhdWx0IHRoZSBib3JkZXItd2lkdGhcbiAqIHRvIDAgb24gYWxsIGVsZW1lbnRzLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9pc3N1ZXMvMzYyXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbn1cblxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNhMGFlYzA7XG59XG5cbmJ1dHRvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaDEsXG5oMiB7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgbGlua3MgdG8gb3B0aW1pemUgZm9yIG9wdC1pbiBzdHlsaW5nIGluc3RlYWQgb2ZcbiAqIG9wdC1vdXQuXG4gKi9cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgZm9ybSBlbGVtZW50IHByb3BlcnRpZXMgdGhhdCBhcmUgZWFzeSB0byBmb3JnZXQgdG9cbiAqIHN0eWxlIGV4cGxpY2l0bHkgc28geW91IGRvbid0IGluYWR2ZXJ0ZW50bHkgaW50cm9kdWNlXG4gKiBzdHlsZXMgdGhhdCBkZXZpYXRlIGZyb20geW91ciBkZXNpZ24gc3lzdGVtLiBUaGVzZSBzdHlsZXNcbiAqIHN1cHBsZW1lbnQgYSBwYXJ0aWFsIHJlc2V0IHRoYXQgaXMgYWxyZWFkeSBhcHBsaWVkIGJ5XG4gKiBub3JtYWxpemUuY3NzLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgcGFkZGluZzogMDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuXG4vKipcbiAqIFVzZSB0aGUgY29uZmlndXJlZCAnbW9ubycgZm9udCBmYW1pbHkgZm9yIGVsZW1lbnRzIHRoYXRcbiAqIGFyZSBleHBlY3RlZCB0byBiZSByZW5kZXJlZCB3aXRoIGEgbW9ub3NwYWNlIGZvbnQsIGZhbGxpbmdcbiAqIGJhY2sgdG8gdGhlIHN5c3RlbSBtb25vc3BhY2Ugc3RhY2sgaWYgdGhlcmUgaXMgbm8gY29uZmlndXJlZFxuICogJ21vbm8nIGZvbnQgZmFtaWx5LlxuICovXG5cbi8qKlxuICogTWFrZSByZXBsYWNlZCBlbGVtZW50cyBgZGlzcGxheTogYmxvY2tgIGJ5IGRlZmF1bHQgYXMgdGhhdCdzXG4gKiB0aGUgYmVoYXZpb3IgeW91IHdhbnQgYWxtb3N0IGFsbCBvZiB0aGUgdGltZS4gSW5zcGlyZWQgYnlcbiAqIENTUyBSZW1lZHksIHdpdGggYHN2Z2AgYWRkZWQgYXMgd2VsbC5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nLFxuc3ZnLFxub2JqZWN0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi8qKlxuICogQ29uc3RyYWluIGltYWdlcyBhbmQgdmlkZW9zIHRvIHRoZSBwYXJlbnQgd2lkdGggYW5kIHByZXNlcnZlXG4gKiB0aGVpciBpbnN0cmluc2ljIGFzcGVjdCByYXRpby5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi5iZy13aGl0ZSB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTEwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZmFmYztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDcsIDI1MCwgMjUyLCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTIwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZjJmNztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5ob3ZlclxcOmJnLWdyYXktOTAwOmhvdmVyIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWEyMDJjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI2LCAzMiwgNDQsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJvcmRlci13aGl0ZSB7XG4gIC0tYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLWJvcmRlci1vcGFjaXR5KSk7XG59XG5cbi5ib3JkZXItZ3JheS0yMDAge1xuICAtLWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6ICNlZGYyZjc7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1ib3JkZXItb3BhY2l0eSkpO1xufVxuXG4ucm91bmRlZCB7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi5yb3VuZGVkLWxnIHtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xufVxuXG4uYm9yZGVyLTIge1xuICBib3JkZXItd2lkdGg6IDJweDtcbn1cblxuLmJvcmRlci04IHtcbiAgYm9yZGVyLXdpZHRoOiA4cHg7XG59XG5cbi5ib3JkZXIge1xuICBib3JkZXItd2lkdGg6IDFweDtcbn1cblxuLmlubGluZS1ibG9jayB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZsZXgge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5saW5lLWZsZXgge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbn1cblxuLmdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLml0ZW1zLWVuZCB7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbn1cblxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5qdXN0aWZ5LWVuZCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uZmxleC1ncm93IHtcbiAgZmxleC1ncm93OiAxO1xufVxuXG4uZm9udC1zZW1pYm9sZCB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi5oLTIge1xuICBoZWlnaHQ6IDAuNXJlbTtcbn1cblxuLmgtMTAge1xuICBoZWlnaHQ6IDIuNXJlbTtcbn1cblxuLmgtMzIge1xuICBoZWlnaHQ6IDhyZW07XG59XG5cbi50ZXh0LXhzIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBsaW5lLWhlaWdodDogMXJlbTtcbn1cblxuLnRleHQteGwge1xuICBmb250LXNpemU6IDEuMjVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjc1cmVtO1xufVxuXG4udGV4dC0yeGwge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDJyZW07XG59XG5cbi5tci0yIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5tbC0yIHtcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbn1cblxuLm1iLTYge1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG5cbi5tYi04IHtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbn1cblxuLi1tdC0xNiB7XG4gIG1hcmdpbi10b3A6IC00cmVtO1xufVxuXG4uZm9jdXNcXDpvdXRsaW5lLW5vbmU6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIG91dGxpbmUtb2Zmc2V0OiAycHg7XG59XG5cbi5vdmVyZmxvdy1oaWRkZW4ge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4ucC02IHtcbiAgcGFkZGluZzogMS41cmVtO1xufVxuXG4ucC0xMiB7XG4gIHBhZGRpbmc6IDNyZW07XG59XG5cbi5weC00IHtcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAxcmVtO1xufVxuXG4ucHQtMSB7XG4gIHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ucHItMiB7XG4gIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbn1cblxuLmZpeGVkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uYWJzb2x1dGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5yZWxhdGl2ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLnRvcC0wIHtcbiAgdG9wOiAwO1xufVxuXG4ucmlnaHQtMCB7XG4gIHJpZ2h0OiAwO1xufVxuXG4ubGVmdC0wIHtcbiAgbGVmdDogMDtcbn1cblxuLnNoYWRvdy1tZCB7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCAycHggNHB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuLnRleHQtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udGV4dC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG4udGV4dC1ncmF5LTQwMCB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2NiZDVlMDtcbiAgY29sb3I6IHJnYmEoMjAzLCAyMTMsIDIyNCwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi50ZXh0LWdyYXktNjAwIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjNzE4MDk2O1xuICBjb2xvcjogcmdiYSgxMTMsIDEyOCwgMTUwLCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLnRleHQtZ3JheS03MDAge1xuICAtLXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6ICM0YTU1Njg7XG4gIGNvbG9yOiByZ2JhKDc0LCA4NSwgMTA0LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLmhvdmVyXFw6dGV4dC13aGl0ZTpob3ZlciB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2ZmZjtcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi5jYXBpdGFsaXplIHtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG59XG5cbi5ob3ZlclxcOnVuZGVybGluZTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4udmlzaWJsZSB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59XG5cbi53LTEwIHtcbiAgd2lkdGg6IDIuNXJlbTtcbn1cblxuLnctMzIge1xuICB3aWR0aDogOHJlbTtcbn1cblxuLnctMVxcLzMge1xuICB3aWR0aDogMzMuMzMzMzMzJTtcbn1cblxuLmdhcC0xMCB7XG4gIGdyaWQtZ2FwOiAyLjVyZW07XG4gIGdhcDogMi41cmVtO1xufVxuXG4uZ3JpZC1jb2xzLWNhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpO1xufVxuXG4udHJhbnNmb3JtIHtcbiAgLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS15OiAwO1xuICAtLXRyYW5zZm9ybS1yb3RhdGU6IDA7XG4gIC0tdHJhbnNmb3JtLXNrZXcteDogMDtcbiAgLS10cmFuc2Zvcm0tc2tldy15OiAwO1xuICAtLXRyYW5zZm9ybS1zY2FsZS14OiAxO1xuICAtLXRyYW5zZm9ybS1zY2FsZS15OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgodmFyKC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS14KSkgdHJhbnNsYXRlWSh2YXIoLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXkpKSByb3RhdGUodmFyKC0tdHJhbnNmb3JtLXJvdGF0ZSkpIHNrZXdYKHZhcigtLXRyYW5zZm9ybS1za2V3LXgpKSBza2V3WSh2YXIoLS10cmFuc2Zvcm0tc2tldy15KSkgc2NhbGVYKHZhcigtLXRyYW5zZm9ybS1zY2FsZS14KSkgc2NhbGVZKHZhcigtLXRyYW5zZm9ybS1zY2FsZS15KSk7XG59XG5cbi50cmFuc2l0aW9uLWFsbCB7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IGFsbDtcbn1cblxuLmVhc2Utb3V0IHtcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uZHVyYXRpb24tMTUwIHtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMTUwbXM7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcGluZyB7XG4gIDc1JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICA1MCUge1xuICAgIG9wYWNpdHk6IC41O1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjUlKTtcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC44LDAsMSwxKTtcbiAgfVxuXG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLDAsMC4yLDEpO1xuICB9XG59XG5cbi5iZy10cmFuc3BhcmVudC1zaGFwZSB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAyMCUyMDIwJTIyJTIwZmlsbCUzRCUyMm5vbmUlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyMiUzRSUwQSUzQ3JlY3QlMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjBmaWxsJTNEJTIyd2hpdGUlMjIlMkYlM0UlMEElM0NyZWN0JTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wMyUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB4JTNEJTIyMTAlMjIlMjB5JTNEJTIyMTAlMjIlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjAzJTIyJTJGJTNFJTBBJTNDcmVjdCUyMHglM0QlMjIxMCUyMiUyMHdpZHRoJTNEJTIyMTAlMjIlMjBoZWlnaHQlM0QlMjIxMCUyMiUyMGZpbGwlM0QlMjJibGFjayUyMiUyMGZpbGwtb3BhY2l0eSUzRCUyMjAuMDYlMjIlMkYlM0UlMEElM0NyZWN0JTIweSUzRCUyMjEwJTIyJTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wNiUyMiUyRiUzRSUwQSUzQyUyRnN2ZyUzRSUwQSk7XG59PC9zdHlsZT5cblxuPGRpdj5Gb3JtPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcVZBLGNBQUMsZUFDRCxRQUFRLGVBQ1IsT0FBTyxBQUFDLENBQUMsQUFDUCxVQUFVLENBQUUsVUFBVSxDQUN0QixZQUFZLENBQUUsQ0FBQyxDQUNmLFlBQVksQ0FBRSxLQUFLLENBQ25CLFlBQVksQ0FBRSxPQUFPLEFBQ3ZCLENBQUMsQUFzWUQsV0FBVyxrQkFBSyxDQUFDLEFBQ2YsRUFBRSxBQUFDLENBQUMsQUFDRixTQUFTLENBQUUsT0FBTyxNQUFNLENBQUMsQUFDM0IsQ0FBQyxBQUNILENBQUMsQUFFRCxXQUFXLGtCQUFLLENBQUMsQUFDZixHQUFHLENBQUUsSUFBSSxBQUFDLENBQUMsQUFDVCxTQUFTLENBQUUsTUFBTSxDQUFDLENBQUMsQ0FDbkIsT0FBTyxDQUFFLENBQUMsQUFDWixDQUFDLEFBQ0gsQ0FBQyxBQUVELFdBQVcsbUJBQU0sQ0FBQyxBQUNoQixHQUFHLEFBQUMsQ0FBQyxBQUNILE9BQU8sQ0FBRSxFQUFFLEFBQ2IsQ0FBQyxBQUNILENBQUMsQUFFRCxXQUFXLG9CQUFPLENBQUMsQUFDakIsRUFBRSxDQUFFLElBQUksQUFBQyxDQUFDLEFBQ1IsU0FBUyxDQUFFLFdBQVcsSUFBSSxDQUFDLENBQzNCLHlCQUF5QixDQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQ3BELENBQUMsQUFFRCxHQUFHLEFBQUMsQ0FBQyxBQUNILFNBQVMsQ0FBRSxJQUFJLENBQ2YseUJBQXlCLENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQUFDcEQsQ0FBQyxBQUNILENBQUMifQ== */";
    	append_dev(document.head, style);
    }

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Form";
    			attr_dev(div, "class", "svelte-17k5r4");
    			add_location(div, file$2, 773, 0, 14311);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Form", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-17k5r4-style")) add_css$1();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/scenes/Mode.svelte generated by Svelte v3.29.4 */
    const file$3 = "src/components/scenes/Mode.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-i8peb-style";
    	style.textContent = "h2.svelte-i8peb,p.svelte-i8peb{margin:0}.svelte-i8peb,.svelte-i8peb::before,.svelte-i8peb::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}h2.svelte-i8peb{font-size:inherit;font-weight:inherit}.bg-gray-100.svelte-i8peb{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247, 250, 252, var(--bg-opacity))}.rounded.svelte-i8peb{border-radius:0.25rem}.flex.svelte-i8peb{display:flex}.grid.svelte-i8peb{display:grid}.flex-col.svelte-i8peb{flex-direction:column}.flex-grow.svelte-i8peb{flex-grow:1}.text-xl.svelte-i8peb{font-size:1.25rem;line-height:1.75rem}.mb-6.svelte-i8peb{margin-bottom:1.5rem}.mb-8.svelte-i8peb{margin-bottom:2rem}.p-6.svelte-i8peb{padding:1.5rem}.p-12.svelte-i8peb{padding:3rem}.text-center.svelte-i8peb{text-align:center}.text-gray-600.svelte-i8peb{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.text-gray-700.svelte-i8peb{--text-opacity:1;color:#4a5568;color:rgba(74, 85, 104, var(--text-opacity))}.capitalize.svelte-i8peb{text-transform:capitalize}.gap-10.svelte-i8peb{grid-gap:2.5rem;gap:2.5rem}.grid-cols-cards.svelte-i8peb{grid-template-columns:repeat(auto-fill, minmax(240px, 1fr))}@keyframes svelte-i8peb-spin{to{transform:rotate(360deg)}}@keyframes svelte-i8peb-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-i8peb-pulse{50%{opacity:.5}}@keyframes svelte-i8peb-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZS5zdmVsdGUiLCJzb3VyY2VzIjpbIk1vZGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+O1xuaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbi5zdmVsdGUnO1xuZXhwb3J0IGxldCBtb2RlcztcbiQ6IHRyYW5zID0gZ2V0Q29udGV4dCgndHJhbnMnKTtcbiQ6IG1vZGVDdHggPSBnZXRDb250ZXh0KCdtb2RlJyk7XG48L3NjcmlwdD5cblxuPHN0eWxlPi8qKiBTY2VuZXMvTW9kZSAoPD0gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9pc3N1ZXMvNDMxMykgKi9cblxuLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICovXG5cbm1haW4ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXG4gKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICovXG5cbmgxIHtcbiAgZm9udC1zaXplOiAyZW07XG4gIG1hcmdpbjogMC42N2VtIDA7XG59XG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuLyoqXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uIHsgLyogMSAqL1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3Jpbmcge1xuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblxuW3R5cGU9XCJyYWRpb1wiXSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxuICovXG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIE1hbnVhbGx5IGZvcmtlZCBmcm9tIFNVSVQgQ1NTIEJhc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdWl0Y3NzL2Jhc2VcbiAqIEEgdGhpbiBsYXllciBvbiB0b3Agb2Ygbm9ybWFsaXplLmNzcyB0aGF0IHByb3ZpZGVzIGEgc3RhcnRpbmcgcG9pbnQgbW9yZVxuICogc3VpdGFibGUgZm9yIHdlYiBhcHBsaWNhdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBkZWZhdWx0IHNwYWNpbmcgYW5kIGJvcmRlciBmb3IgYXBwcm9wcmlhdGUgZWxlbWVudHMuXG4gKi9cblxuXG5oMSxcbmgyLFxucCB7XG4gIG1hcmdpbjogMDtcbn1cblxuYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7XG59XG5cbi8qKlxuICogV29yayBhcm91bmQgYSBGaXJlZm94L0lFIGJ1ZyB3aGVyZSB0aGUgdHJhbnNwYXJlbnQgYGJ1dHRvbmAgYmFja2dyb3VuZFxuICogcmVzdWx0cyBpbiBhIGxvc3Mgb2YgdGhlIGRlZmF1bHQgYGJ1dHRvbmAgZm9jdXMgc3R5bGVzLlxuICovXG5cbmJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmU6IDFweCBkb3R0ZWQ7XG4gIG91dGxpbmU6IDVweCBhdXRvIC13ZWJraXQtZm9jdXMtcmluZy1jb2xvcjtcbn1cblxuLyoqXG4gKiBUYWlsd2luZCBjdXN0b20gcmVzZXQgc3R5bGVzXG4gKi9cblxuLyoqXG4gKiAxLiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIGBzYW5zYCBmb250LWZhbWlseSAod2l0aCBUYWlsd2luZCdzIGRlZmF1bHRcbiAqICAgIHNhbnMtc2VyaWYgZm9udCBzdGFjayBhcyBhIGZhbGxiYWNrKSBhcyBhIHNhbmUgZGVmYXVsdC5cbiAqIDIuIFVzZSBUYWlsd2luZCdzIGRlZmF1bHQgXCJub3JtYWxcIiBsaW5lLWhlaWdodCBzbyB0aGUgdXNlciBpc24ndCBmb3JjZWRcbiAqICAgIHRvIG92ZXJyaWRlIGl0IHRvIGVuc3VyZSBjb25zaXN0ZW5jeSBldmVuIHdoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdGhlbWUuXG4gKi9cblxuaHRtbCB7XG4gIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgQXJpYWwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiLCBcIk5vdG8gQ29sb3IgRW1vamlcIjsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS41OyAvKiAyICovXG59XG5cbi8qKlxuICogMS4gUHJldmVudCBwYWRkaW5nIGFuZCBib3JkZXIgZnJvbSBhZmZlY3RpbmcgZWxlbWVudCB3aWR0aC5cbiAqXG4gKiAgICBXZSB1c2VkIHRvIHNldCB0aGlzIGluIHRoZSBodG1sIGVsZW1lbnQgYW5kIGluaGVyaXQgZnJvbVxuICogICAgdGhlIHBhcmVudCBlbGVtZW50IGZvciBldmVyeXRoaW5nIGVsc2UuIFRoaXMgY2F1c2VkIGlzc3Vlc1xuICogICAgaW4gc2hhZG93LWRvbS1lbmhhbmNlZCBlbGVtZW50cyBsaWtlIDxkZXRhaWxzPiB3aGVyZSB0aGUgY29udGVudFxuICogICAgaXMgd3JhcHBlZCBieSBhIGRpdiB3aXRoIGJveC1zaXppbmcgc2V0IHRvIGBjb250ZW50LWJveGAuXG4gKlxuICogICAgaHR0cHM6Ly9naXRodWIuY29tL21vemRldnMvY3NzcmVtZWR5L2lzc3Vlcy80XG4gKlxuICpcbiAqIDIuIEFsbG93IGFkZGluZyBhIGJvcmRlciB0byBhbiBlbGVtZW50IGJ5IGp1c3QgYWRkaW5nIGEgYm9yZGVyLXdpZHRoLlxuICpcbiAqICAgIEJ5IGRlZmF1bHQsIHRoZSB3YXkgdGhlIGJyb3dzZXIgc3BlY2lmaWVzIHRoYXQgYW4gZWxlbWVudCBzaG91bGQgaGF2ZSBub1xuICogICAgYm9yZGVyIGlzIGJ5IHNldHRpbmcgaXQncyBib3JkZXItc3R5bGUgdG8gYG5vbmVgIGluIHRoZSB1c2VyLWFnZW50XG4gKiAgICBzdHlsZXNoZWV0LlxuICpcbiAqICAgIEluIG9yZGVyIHRvIGVhc2lseSBhZGQgYm9yZGVycyB0byBlbGVtZW50cyBieSBqdXN0IHNldHRpbmcgdGhlIGBib3JkZXItd2lkdGhgXG4gKiAgICBwcm9wZXJ0eSwgd2UgY2hhbmdlIHRoZSBkZWZhdWx0IGJvcmRlci1zdHlsZSBmb3IgYWxsIGVsZW1lbnRzIHRvIGBzb2xpZGAsIGFuZFxuICogICAgdXNlIGJvcmRlci13aWR0aCB0byBoaWRlIHRoZW0gaW5zdGVhZC4gVGhpcyB3YXkgb3VyIGBib3JkZXJgIHV0aWxpdGllcyBvbmx5XG4gKiAgICBuZWVkIHRvIHNldCB0aGUgYGJvcmRlci13aWR0aGAgcHJvcGVydHkgaW5zdGVhZCBvZiB0aGUgZW50aXJlIGBib3JkZXJgXG4gKiAgICBzaG9ydGhhbmQsIG1ha2luZyBvdXIgYm9yZGVyIHV0aWxpdGllcyBtdWNoIG1vcmUgc3RyYWlnaHRmb3J3YXJkIHRvIGNvbXBvc2UuXG4gKlxuICogICAgaHR0cHM6Ly9naXRodWIuY29tL3RhaWx3aW5kY3NzL3RhaWx3aW5kY3NzL3B1bGwvMTE2XG4gKi9cblxuKixcbjo6YmVmb3JlLFxuOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgYm9yZGVyLXdpZHRoOiAwOyAvKiAyICovXG4gIGJvcmRlci1zdHlsZTogc29saWQ7IC8qIDIgKi9cbiAgYm9yZGVyLWNvbG9yOiAjZTJlOGYwOyAvKiAyICovXG59XG5cbi8qXG4gKiBFbnN1cmUgaG9yaXpvbnRhbCBydWxlcyBhcmUgdmlzaWJsZSBieSBkZWZhdWx0XG4gKi9cblxuLyoqXG4gKiBVbmRvIHRoZSBgYm9yZGVyLXN0eWxlOiBub25lYCByZXNldCB0aGF0IE5vcm1hbGl6ZSBhcHBsaWVzIHRvIGltYWdlcyBzbyB0aGF0XG4gKiBvdXIgYGJvcmRlci17d2lkdGh9YCB1dGlsaXRpZXMgaGF2ZSB0aGUgZXhwZWN0ZWQgZWZmZWN0LlxuICpcbiAqIFRoZSBOb3JtYWxpemUgcmVzZXQgaXMgdW5uZWNlc3NhcnkgZm9yIHVzIHNpbmNlIHdlIGRlZmF1bHQgdGhlIGJvcmRlci13aWR0aFxuICogdG8gMCBvbiBhbGwgZWxlbWVudHMuXG4gKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3RhaWx3aW5kY3NzL3RhaWx3aW5kY3NzL2lzc3Vlcy8zNjJcbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IHNvbGlkO1xufVxuXG5pbnB1dDo6cGxhY2Vob2xkZXIge1xuICBjb2xvcjogI2EwYWVjMDtcbn1cblxuYnV0dG9uIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG5oMSxcbmgyIHtcbiAgZm9udC1zaXplOiBpbmhlcml0O1xuICBmb250LXdlaWdodDogaW5oZXJpdDtcbn1cblxuLyoqXG4gKiBSZXNldCBsaW5rcyB0byBvcHRpbWl6ZSBmb3Igb3B0LWluIHN0eWxpbmcgaW5zdGVhZCBvZlxuICogb3B0LW91dC5cbiAqL1xuXG5hIHtcbiAgY29sb3I6IGluaGVyaXQ7XG4gIHRleHQtZGVjb3JhdGlvbjogaW5oZXJpdDtcbn1cblxuLyoqXG4gKiBSZXNldCBmb3JtIGVsZW1lbnQgcHJvcGVydGllcyB0aGF0IGFyZSBlYXN5IHRvIGZvcmdldCB0b1xuICogc3R5bGUgZXhwbGljaXRseSBzbyB5b3UgZG9uJ3QgaW5hZHZlcnRlbnRseSBpbnRyb2R1Y2VcbiAqIHN0eWxlcyB0aGF0IGRldmlhdGUgZnJvbSB5b3VyIGRlc2lnbiBzeXN0ZW0uIFRoZXNlIHN0eWxlc1xuICogc3VwcGxlbWVudCBhIHBhcnRpYWwgcmVzZXQgdGhhdCBpcyBhbHJlYWR5IGFwcGxpZWQgYnlcbiAqIG5vcm1hbGl6ZS5jc3MuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQge1xuICBwYWRkaW5nOiAwO1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbiAgY29sb3I6IGluaGVyaXQ7XG59XG5cbi8qKlxuICogVXNlIHRoZSBjb25maWd1cmVkICdtb25vJyBmb250IGZhbWlseSBmb3IgZWxlbWVudHMgdGhhdFxuICogYXJlIGV4cGVjdGVkIHRvIGJlIHJlbmRlcmVkIHdpdGggYSBtb25vc3BhY2UgZm9udCwgZmFsbGluZ1xuICogYmFjayB0byB0aGUgc3lzdGVtIG1vbm9zcGFjZSBzdGFjayBpZiB0aGVyZSBpcyBubyBjb25maWd1cmVkXG4gKiAnbW9ubycgZm9udCBmYW1pbHkuXG4gKi9cblxuLyoqXG4gKiBNYWtlIHJlcGxhY2VkIGVsZW1lbnRzIGBkaXNwbGF5OiBibG9ja2AgYnkgZGVmYXVsdCBhcyB0aGF0J3NcbiAqIHRoZSBiZWhhdmlvciB5b3Ugd2FudCBhbG1vc3QgYWxsIG9mIHRoZSB0aW1lLiBJbnNwaXJlZCBieVxuICogQ1NTIFJlbWVkeSwgd2l0aCBgc3ZnYCBhZGRlZCBhcyB3ZWxsLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvMTRcbiAqL1xuXG5pbWcsXG5zdmcsXG5vYmplY3Qge1xuICBkaXNwbGF5OiBibG9jaztcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLyoqXG4gKiBDb25zdHJhaW4gaW1hZ2VzIGFuZCB2aWRlb3MgdG8gdGhlIHBhcmVudCB3aWR0aCBhbmQgcHJlc2VydmVcbiAqIHRoZWlyIGluc3RyaW5zaWMgYXNwZWN0IHJhdGlvLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvMTRcbiAqL1xuXG5pbWcge1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLmJnLXdoaXRlIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJnLWdyYXktMTAwIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmYWZjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NywgMjUwLCAyNTIsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJnLWdyYXktMjAwIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWRmMmY3O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzNywgMjQyLCAyNDcsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmhvdmVyXFw6YmctZ3JheS05MDA6aG92ZXIge1xuICAtLWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxYTIwMmM7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjYsIDMyLCA0NCwgdmFyKC0tYmctb3BhY2l0eSkpO1xufVxuXG4uYm9yZGVyLXdoaXRlIHtcbiAgLS1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiAjZmZmO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tYm9yZGVyLW9wYWNpdHkpKTtcbn1cblxuLmJvcmRlci1ncmF5LTIwMCB7XG4gIC0tYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogI2VkZjJmNztcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIzNywgMjQyLCAyNDcsIHZhcigtLWJvcmRlci1vcGFjaXR5KSk7XG59XG5cbi5yb3VuZGVkIHtcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcbn1cblxuLnJvdW5kZWQtbGcge1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG59XG5cbi5ib3JkZXItMiB7XG4gIGJvcmRlci13aWR0aDogMnB4O1xufVxuXG4uYm9yZGVyLTgge1xuICBib3JkZXItd2lkdGg6IDhweDtcbn1cblxuLmJvcmRlciB7XG4gIGJvcmRlci13aWR0aDogMXB4O1xufVxuXG4uaW5saW5lLWJsb2NrIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG4uZmxleCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5pbmxpbmUtZmxleCB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xufVxuXG4uZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG59XG5cbi5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uZmxleC1jb2wge1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG4uaXRlbXMtZW5kIHtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xufVxuXG4uaXRlbXMtY2VudGVyIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmp1c3RpZnktZW5kIHtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbn1cblxuLmp1c3RpZnktY2VudGVyIHtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5mbGV4LWdyb3cge1xuICBmbGV4LWdyb3c6IDE7XG59XG5cbi5mb250LXNlbWlib2xkIHtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbn1cblxuLmgtMiB7XG4gIGhlaWdodDogMC41cmVtO1xufVxuXG4uaC0xMCB7XG4gIGhlaWdodDogMi41cmVtO1xufVxuXG4uaC0zMiB7XG4gIGhlaWdodDogOHJlbTtcbn1cblxuLnRleHQteHMge1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxcmVtO1xufVxuXG4udGV4dC14bCB7XG4gIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDEuNzVyZW07XG59XG5cbi50ZXh0LTJ4bCB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBsaW5lLWhlaWdodDogMnJlbTtcbn1cblxuLm1yLTIge1xuICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcbn1cblxuLm1sLTIge1xuICBtYXJnaW4tbGVmdDogMC41cmVtO1xufVxuXG4ubWItNiB7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbn1cblxuLm1iLTgge1xuICBtYXJnaW4tYm90dG9tOiAycmVtO1xufVxuXG4uLW10LTE2IHtcbiAgbWFyZ2luLXRvcDogLTRyZW07XG59XG5cbi5mb2N1c1xcOm91dGxpbmUtbm9uZTpmb2N1cyB7XG4gIG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbn1cblxuLm92ZXJmbG93LWhpZGRlbiB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5wLTYge1xuICBwYWRkaW5nOiAxLjVyZW07XG59XG5cbi5wLTEyIHtcbiAgcGFkZGluZzogM3JlbTtcbn1cblxuLnB4LTQge1xuICBwYWRkaW5nLWxlZnQ6IDFyZW07XG4gIHBhZGRpbmctcmlnaHQ6IDFyZW07XG59XG5cbi5wdC0xIHtcbiAgcGFkZGluZy10b3A6IDAuMjVyZW07XG59XG5cbi5wci0yIHtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuXG4uZml4ZWQge1xuICBwb3NpdGlvbjogZml4ZWQ7XG59XG5cbi5hYnNvbHV0ZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbn1cblxuLnJlbGF0aXZlIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4udG9wLTAge1xuICB0b3A6IDA7XG59XG5cbi5yaWdodC0wIHtcbiAgcmlnaHQ6IDA7XG59XG5cbi5sZWZ0LTAge1xuICBsZWZ0OiAwO1xufVxuXG4uc2hhZG93LW1kIHtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwIDJweCA0cHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG4udGV4dC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi50ZXh0LXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi50ZXh0LWdyYXktNDAwIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjY2JkNWUwO1xuICBjb2xvcjogcmdiYSgyMDMsIDIxMywgMjI0LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLnRleHQtZ3JheS02MDAge1xuICAtLXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6ICM3MTgwOTY7XG4gIGNvbG9yOiByZ2JhKDExMywgMTI4LCAxNTAsIHZhcigtLXRleHQtb3BhY2l0eSkpO1xufVxuXG4udGV4dC1ncmF5LTcwMCB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogIzRhNTU2ODtcbiAgY29sb3I6IHJnYmEoNzQsIDg1LCAxMDQsIHZhcigtLXRleHQtb3BhY2l0eSkpO1xufVxuXG4uaG92ZXJcXDp0ZXh0LXdoaXRlOmhvdmVyIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjZmZmO1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLmNhcGl0YWxpemUge1xuICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcbn1cblxuLmhvdmVyXFw6dW5kZXJsaW5lOmhvdmVyIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5cbi52aXNpYmxlIHtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cblxuLnctMTAge1xuICB3aWR0aDogMi41cmVtO1xufVxuXG4udy0zMiB7XG4gIHdpZHRoOiA4cmVtO1xufVxuXG4udy0xXFwvMyB7XG4gIHdpZHRoOiAzMy4zMzMzMzMlO1xufVxuXG4uZ2FwLTEwIHtcbiAgZ3JpZC1nYXA6IDIuNXJlbTtcbiAgZ2FwOiAyLjVyZW07XG59XG5cbi5ncmlkLWNvbHMtY2FyZHMge1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyNDBweCwgMWZyKSk7XG59XG5cbi50cmFuc2Zvcm0ge1xuICAtLXRyYW5zZm9ybS10cmFuc2xhdGUteDogMDtcbiAgLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXk6IDA7XG4gIC0tdHJhbnNmb3JtLXJvdGF0ZTogMDtcbiAgLS10cmFuc2Zvcm0tc2tldy14OiAwO1xuICAtLXRyYW5zZm9ybS1za2V3LXk6IDA7XG4gIC0tdHJhbnNmb3JtLXNjYWxlLXg6IDE7XG4gIC0tdHJhbnNmb3JtLXNjYWxlLXk6IDE7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCh2YXIoLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXgpKSB0cmFuc2xhdGVZKHZhcigtLXRyYW5zZm9ybS10cmFuc2xhdGUteSkpIHJvdGF0ZSh2YXIoLS10cmFuc2Zvcm0tcm90YXRlKSkgc2tld1godmFyKC0tdHJhbnNmb3JtLXNrZXcteCkpIHNrZXdZKHZhcigtLXRyYW5zZm9ybS1za2V3LXkpKSBzY2FsZVgodmFyKC0tdHJhbnNmb3JtLXNjYWxlLXgpKSBzY2FsZVkodmFyKC0tdHJhbnNmb3JtLXNjYWxlLXkpKTtcbn1cblxuLnRyYW5zaXRpb24tYWxsIHtcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogYWxsO1xufVxuXG4uZWFzZS1vdXQge1xuICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSk7XG59XG5cbi5kdXJhdGlvbi0xNTAge1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAxNTBtcztcbn1cblxuQGtleWZyYW1lcyBzcGluIHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBwaW5nIHtcbiAgNzUlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBwdWxzZSB7XG4gIDUwJSB7XG4gICAgb3BhY2l0eTogLjU7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBib3VuY2Uge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0yNSUpO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjgsMCwxLDEpO1xuICB9XG5cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAsMCwwLjIsMSk7XG4gIH1cbn1cblxuLmJnLXRyYW5zcGFyZW50LXNoYXBlIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCUzQ3N2ZyUyMHdpZHRoJTNEJTIyMjAlMjIlMjBoZWlnaHQlM0QlMjIyMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDIwJTIwMjAlMjIlMjBmaWxsJTNEJTIybm9uZSUyMiUyMHhtbG5zJTNEJTIyaHR0cCUzQSUyRiUyRnd3dy53My5vcmclMkYyMDAwJTJGc3ZnJTIyJTNFJTBBJTNDcmVjdCUyMHdpZHRoJTNEJTIyMjAlMjIlMjBoZWlnaHQlM0QlMjIyMCUyMiUyMGZpbGwlM0QlMjJ3aGl0ZSUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjAzJTIyJTJGJTNFJTBBJTNDcmVjdCUyMHglM0QlMjIxMCUyMiUyMHklM0QlMjIxMCUyMiUyMHdpZHRoJTNEJTIyMTAlMjIlMjBoZWlnaHQlM0QlMjIxMCUyMiUyMGZpbGwlM0QlMjJibGFjayUyMiUyMGZpbGwtb3BhY2l0eSUzRCUyMjAuMDMlMjIlMkYlM0UlMEElM0NyZWN0JTIweCUzRCUyMjEwJTIyJTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wNiUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB5JTNEJTIyMTAlMjIlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjA2JTIyJTJGJTNFJTBBJTNDJTJGc3ZnJTNFJTBBKTtcbn08L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwicC0xMlwiPlxuICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtY2FyZHMgZ2FwLTEwXCI+XG4gICAgeyNlYWNoIG1vZGVzIGFzIG1vZGV9XG4gICAgICA8ZGl2IGNsYXNzPVwicC02IGJnLWdyYXktMTAwIHRleHQtY2VudGVyIHJvdW5kZWQgZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LXhsIG1iLTYgdGV4dC1ncmF5LTcwMCBjYXBpdGFsaXplXCI+e21vZGV9PC9oMj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LWdyYXktNjAwIG1iLTggZmxleC1ncm93XCI+XG4gICAgICAgICAgeyNpZiBtb2RlID09PSAnY3JlYXRvcid9XG4gICAgICAgICAgICB7dHJhbnMuY3JlYXRvck1vZGVEZXNjcmlwdGlvbn1cbiAgICAgICAgICB7OmVsc2UgaWYgbW9kZSA9PT0gJ2RldGVybWluaXN0aWMnfXt0cmFucy5kZXRlcm1pbmlzdGljTW9kZURlc2NyaXB0aW9ufXsvaWZ9XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPEJ1dHRvbiBvbjpjbGljaz17KCkgPT4gbW9kZUN0eC5zZXQobW9kZSl9PlNlbGVjdDwvQnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIHsvZWFjaH1cbiAgPC9kaXY+XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE2UkEsZUFBRSxDQUNGLENBQUMsYUFBQyxDQUFDLEFBQ0QsTUFBTSxDQUFFLENBQUMsQUFDWCxDQUFDLEFBMkRELGFBQUMsY0FDRCxRQUFRLGNBQ1IsT0FBTyxBQUFDLENBQUMsQUFDUCxVQUFVLENBQUUsVUFBVSxDQUN0QixZQUFZLENBQUUsQ0FBQyxDQUNmLFlBQVksQ0FBRSxLQUFLLENB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 */";
    	append_dev(document.head, style);
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

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trans*/ 2 && t_value !== (t_value = /*trans*/ ctx[1].deterministicModeDescription + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(788:45) ",
    		ctx
    	});

    	return block;
    }

    // (786:10) {#if mode === 'creator'}
    function create_if_block$2(ctx) {
    	let t_value = /*trans*/ ctx[1].creatorModeDescription + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trans*/ 2 && t_value !== (t_value = /*trans*/ ctx[1].creatorModeDescription + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(786:10) {#if mode === 'creator'}",
    		ctx
    	});

    	return block;
    }

    // (791:10) <Button on:click={() => modeCtx.set(mode)}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Select");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(791:10) <Button on:click={() => modeCtx.set(mode)}>",
    		ctx
    	});

    	return block;
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
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler);

    	const block = {
    		c: function create() {
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
    			attr_dev(h2, "class", "text-xl mb-6 text-gray-700 capitalize svelte-i8peb");
    			add_location(h2, file$3, 783, 8, 14639);
    			attr_dev(p, "class", "text-gray-600 mb-8 flex-grow svelte-i8peb");
    			add_location(p, file$3, 784, 8, 14709);
    			attr_dev(div0, "class", "text-center svelte-i8peb");
    			add_location(div0, file$3, 789, 8, 14936);
    			attr_dev(div1, "class", "p-6 bg-gray-100 text-center rounded flex flex-col svelte-i8peb");
    			add_location(div1, file$3, 782, 6, 14567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			if (if_block) if_block.m(p, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*modes*/ 1) && t0_value !== (t0_value = /*mode*/ ctx[4] + "")) set_data_dev(t0, t0_value);

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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (if_block) {
    				if_block.d();
    			}

    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(782:4) {#each modes as mode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let each_value = /*modes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "grid grid-cols-cards gap-10 svelte-i8peb");
    			add_location(div0, file$3, 780, 2, 14493);
    			attr_dev(div1, "class", "p-12 svelte-i8peb");
    			add_location(div1, file$3, 779, 0, 14472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*modeCtx, modes, trans*/ 7) {
    				each_value = /*modes*/ ctx[0];
    				validate_each_argument(each_value);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Mode", slots, []);
    	
    	let { modes } = $$props;
    	const writable_props = ["modes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Mode> was created with unknown prop '${key}'`);
    	});

    	const click_handler = mode => modeCtx.set(mode);

    	$$self.$$set = $$props => {
    		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Button,
    		modes,
    		trans,
    		modeCtx
    	});

    	$$self.$inject_state = $$props => {
    		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
    		if ("trans" in $$props) $$invalidate(1, trans = $$props.trans);
    		if ("modeCtx" in $$props) $$invalidate(2, modeCtx = $$props.modeCtx);
    	};

    	let trans;
    	let modeCtx;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, trans = getContext("trans"));
    	 $$invalidate(2, modeCtx = getContext("mode"));
    	return [modes, trans, modeCtx, click_handler];
    }

    class Mode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-i8peb-style")) add_css$2();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { modes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mode",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modes*/ ctx[0] === undefined && !("modes" in props)) {
    			console.warn("<Mode> was created without expected prop 'modes'");
    		}
    	}

    	get modes() {
    		throw new Error("<Mode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modes(value) {
    		throw new Error("<Mode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/scenes/Style.svelte generated by Svelte v3.29.4 */

    const file$4 = "src/components/scenes/Style.svelte";

    function add_css$3() {
    	var style = element("style");
    	style.id = "svelte-f227p9-style";
    	style.textContent = ".svelte-f227p9,.svelte-f227p9::before,.svelte-f227p9::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes svelte-f227p9-spin{to{transform:rotate(360deg)}}@keyframes svelte-f227p9-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-f227p9-pulse{50%{opacity:.5}}@keyframes svelte-f227p9-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R5bGUuc3ZlbHRlIiwic291cmNlcyI6WyJTdHlsZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBsYW5nPVwidHNcIj48L3NjcmlwdD5cblxuPHN0eWxlPi8qKiBTY2VuZXMvU3R5bGUgKDw9IEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzQzMTMpICovXG5cbi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYiB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbiB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5cblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cbiAqL1xuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBNYW51YWxseSBmb3JrZWQgZnJvbSBTVUlUIENTUyBCYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3VpdGNzcy9iYXNlXG4gKiBBIHRoaW4gbGF5ZXIgb24gdG9wIG9mIG5vcm1hbGl6ZS5jc3MgdGhhdCBwcm92aWRlcyBhIHN0YXJ0aW5nIHBvaW50IG1vcmVcbiAqIHN1aXRhYmxlIGZvciB3ZWIgYXBwbGljYXRpb25zLlxuICovXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZGVmYXVsdCBzcGFjaW5nIGFuZCBib3JkZXIgZm9yIGFwcHJvcHJpYXRlIGVsZW1lbnRzLlxuICovXG5cblxuaDEsXG5oMixcbnAge1xuICBtYXJnaW46IDA7XG59XG5cbmJ1dHRvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xufVxuXG4vKipcbiAqIFdvcmsgYXJvdW5kIGEgRmlyZWZveC9JRSBidWcgd2hlcmUgdGhlIHRyYW5zcGFyZW50IGBidXR0b25gIGJhY2tncm91bmRcbiAqIHJlc3VsdHMgaW4gYSBsb3NzIG9mIHRoZSBkZWZhdWx0IGBidXR0b25gIGZvY3VzIHN0eWxlcy5cbiAqL1xuXG5idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiAxcHggZG90dGVkO1xuICBvdXRsaW5lOiA1cHggYXV0byAtd2Via2l0LWZvY3VzLXJpbmctY29sb3I7XG59XG5cbi8qKlxuICogVGFpbHdpbmQgY3VzdG9tIHJlc2V0IHN0eWxlc1xuICovXG5cbi8qKlxuICogMS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBgc2Fuc2AgZm9udC1mYW1pbHkgKHdpdGggVGFpbHdpbmQncyBkZWZhdWx0XG4gKiAgICBzYW5zLXNlcmlmIGZvbnQgc3RhY2sgYXMgYSBmYWxsYmFjaykgYXMgYSBzYW5lIGRlZmF1bHQuXG4gKiAyLiBVc2UgVGFpbHdpbmQncyBkZWZhdWx0IFwibm9ybWFsXCIgbGluZS1oZWlnaHQgc28gdGhlIHVzZXIgaXNuJ3QgZm9yY2VkXG4gKiAgICB0byBvdmVycmlkZSBpdCB0byBlbnN1cmUgY29uc2lzdGVuY3kgZXZlbiB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHRoZW1lLlxuICovXG5cbmh0bWwge1xuICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuNTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIFByZXZlbnQgcGFkZGluZyBhbmQgYm9yZGVyIGZyb20gYWZmZWN0aW5nIGVsZW1lbnQgd2lkdGguXG4gKlxuICogICAgV2UgdXNlZCB0byBzZXQgdGhpcyBpbiB0aGUgaHRtbCBlbGVtZW50IGFuZCBpbmhlcml0IGZyb21cbiAqICAgIHRoZSBwYXJlbnQgZWxlbWVudCBmb3IgZXZlcnl0aGluZyBlbHNlLiBUaGlzIGNhdXNlZCBpc3N1ZXNcbiAqICAgIGluIHNoYWRvdy1kb20tZW5oYW5jZWQgZWxlbWVudHMgbGlrZSA8ZGV0YWlscz4gd2hlcmUgdGhlIGNvbnRlbnRcbiAqICAgIGlzIHdyYXBwZWQgYnkgYSBkaXYgd2l0aCBib3gtc2l6aW5nIHNldCB0byBgY29udGVudC1ib3hgLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvNFxuICpcbiAqXG4gKiAyLiBBbGxvdyBhZGRpbmcgYSBib3JkZXIgdG8gYW4gZWxlbWVudCBieSBqdXN0IGFkZGluZyBhIGJvcmRlci13aWR0aC5cbiAqXG4gKiAgICBCeSBkZWZhdWx0LCB0aGUgd2F5IHRoZSBicm93c2VyIHNwZWNpZmllcyB0aGF0IGFuIGVsZW1lbnQgc2hvdWxkIGhhdmUgbm9cbiAqICAgIGJvcmRlciBpcyBieSBzZXR0aW5nIGl0J3MgYm9yZGVyLXN0eWxlIHRvIGBub25lYCBpbiB0aGUgdXNlci1hZ2VudFxuICogICAgc3R5bGVzaGVldC5cbiAqXG4gKiAgICBJbiBvcmRlciB0byBlYXNpbHkgYWRkIGJvcmRlcnMgdG8gZWxlbWVudHMgYnkganVzdCBzZXR0aW5nIHRoZSBgYm9yZGVyLXdpZHRoYFxuICogICAgcHJvcGVydHksIHdlIGNoYW5nZSB0aGUgZGVmYXVsdCBib3JkZXItc3R5bGUgZm9yIGFsbCBlbGVtZW50cyB0byBgc29saWRgLCBhbmRcbiAqICAgIHVzZSBib3JkZXItd2lkdGggdG8gaGlkZSB0aGVtIGluc3RlYWQuIFRoaXMgd2F5IG91ciBgYm9yZGVyYCB1dGlsaXRpZXMgb25seVxuICogICAgbmVlZCB0byBzZXQgdGhlIGBib3JkZXItd2lkdGhgIHByb3BlcnR5IGluc3RlYWQgb2YgdGhlIGVudGlyZSBgYm9yZGVyYFxuICogICAgc2hvcnRoYW5kLCBtYWtpbmcgb3VyIGJvcmRlciB1dGlsaXRpZXMgbXVjaCBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCB0byBjb21wb3NlLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9wdWxsLzExNlxuICovXG5cbiosXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGJvcmRlci13aWR0aDogMDsgLyogMiAqL1xuICBib3JkZXItc3R5bGU6IHNvbGlkOyAvKiAyICovXG4gIGJvcmRlci1jb2xvcjogI2UyZThmMDsgLyogMiAqL1xufVxuXG4vKlxuICogRW5zdXJlIGhvcml6b250YWwgcnVsZXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdFxuICovXG5cbi8qKlxuICogVW5kbyB0aGUgYGJvcmRlci1zdHlsZTogbm9uZWAgcmVzZXQgdGhhdCBOb3JtYWxpemUgYXBwbGllcyB0byBpbWFnZXMgc28gdGhhdFxuICogb3VyIGBib3JkZXIte3dpZHRofWAgdXRpbGl0aWVzIGhhdmUgdGhlIGV4cGVjdGVkIGVmZmVjdC5cbiAqXG4gKiBUaGUgTm9ybWFsaXplIHJlc2V0IGlzIHVubmVjZXNzYXJ5IGZvciB1cyBzaW5jZSB3ZSBkZWZhdWx0IHRoZSBib3JkZXItd2lkdGhcbiAqIHRvIDAgb24gYWxsIGVsZW1lbnRzLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9pc3N1ZXMvMzYyXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbn1cblxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNhMGFlYzA7XG59XG5cbmJ1dHRvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaDEsXG5oMiB7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgbGlua3MgdG8gb3B0aW1pemUgZm9yIG9wdC1pbiBzdHlsaW5nIGluc3RlYWQgb2ZcbiAqIG9wdC1vdXQuXG4gKi9cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgZm9ybSBlbGVtZW50IHByb3BlcnRpZXMgdGhhdCBhcmUgZWFzeSB0byBmb3JnZXQgdG9cbiAqIHN0eWxlIGV4cGxpY2l0bHkgc28geW91IGRvbid0IGluYWR2ZXJ0ZW50bHkgaW50cm9kdWNlXG4gKiBzdHlsZXMgdGhhdCBkZXZpYXRlIGZyb20geW91ciBkZXNpZ24gc3lzdGVtLiBUaGVzZSBzdHlsZXNcbiAqIHN1cHBsZW1lbnQgYSBwYXJ0aWFsIHJlc2V0IHRoYXQgaXMgYWxyZWFkeSBhcHBsaWVkIGJ5XG4gKiBub3JtYWxpemUuY3NzLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgcGFkZGluZzogMDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuXG4vKipcbiAqIFVzZSB0aGUgY29uZmlndXJlZCAnbW9ubycgZm9udCBmYW1pbHkgZm9yIGVsZW1lbnRzIHRoYXRcbiAqIGFyZSBleHBlY3RlZCB0byBiZSByZW5kZXJlZCB3aXRoIGEgbW9ub3NwYWNlIGZvbnQsIGZhbGxpbmdcbiAqIGJhY2sgdG8gdGhlIHN5c3RlbSBtb25vc3BhY2Ugc3RhY2sgaWYgdGhlcmUgaXMgbm8gY29uZmlndXJlZFxuICogJ21vbm8nIGZvbnQgZmFtaWx5LlxuICovXG5cbi8qKlxuICogTWFrZSByZXBsYWNlZCBlbGVtZW50cyBgZGlzcGxheTogYmxvY2tgIGJ5IGRlZmF1bHQgYXMgdGhhdCdzXG4gKiB0aGUgYmVoYXZpb3IgeW91IHdhbnQgYWxtb3N0IGFsbCBvZiB0aGUgdGltZS4gSW5zcGlyZWQgYnlcbiAqIENTUyBSZW1lZHksIHdpdGggYHN2Z2AgYWRkZWQgYXMgd2VsbC5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nLFxuc3ZnLFxub2JqZWN0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi8qKlxuICogQ29uc3RyYWluIGltYWdlcyBhbmQgdmlkZW9zIHRvIHRoZSBwYXJlbnQgd2lkdGggYW5kIHByZXNlcnZlXG4gKiB0aGVpciBpbnN0cmluc2ljIGFzcGVjdCByYXRpby5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi5iZy13aGl0ZSB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTEwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZmFmYztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDcsIDI1MCwgMjUyLCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTIwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZjJmNztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5ob3ZlclxcOmJnLWdyYXktOTAwOmhvdmVyIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWEyMDJjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI2LCAzMiwgNDQsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJvcmRlci13aGl0ZSB7XG4gIC0tYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLWJvcmRlci1vcGFjaXR5KSk7XG59XG5cbi5ib3JkZXItZ3JheS0yMDAge1xuICAtLWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6ICNlZGYyZjc7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1ib3JkZXItb3BhY2l0eSkpO1xufVxuXG4ucm91bmRlZCB7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi5yb3VuZGVkLWxnIHtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xufVxuXG4uYm9yZGVyLTIge1xuICBib3JkZXItd2lkdGg6IDJweDtcbn1cblxuLmJvcmRlci04IHtcbiAgYm9yZGVyLXdpZHRoOiA4cHg7XG59XG5cbi5ib3JkZXIge1xuICBib3JkZXItd2lkdGg6IDFweDtcbn1cblxuLmlubGluZS1ibG9jayB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZsZXgge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5saW5lLWZsZXgge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbn1cblxuLmdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLml0ZW1zLWVuZCB7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbn1cblxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5qdXN0aWZ5LWVuZCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uZmxleC1ncm93IHtcbiAgZmxleC1ncm93OiAxO1xufVxuXG4uZm9udC1zZW1pYm9sZCB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi5oLTIge1xuICBoZWlnaHQ6IDAuNXJlbTtcbn1cblxuLmgtMTAge1xuICBoZWlnaHQ6IDIuNXJlbTtcbn1cblxuLmgtMzIge1xuICBoZWlnaHQ6IDhyZW07XG59XG5cbi50ZXh0LXhzIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBsaW5lLWhlaWdodDogMXJlbTtcbn1cblxuLnRleHQteGwge1xuICBmb250LXNpemU6IDEuMjVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjc1cmVtO1xufVxuXG4udGV4dC0yeGwge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDJyZW07XG59XG5cbi5tci0yIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5tbC0yIHtcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbn1cblxuLm1iLTYge1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG5cbi5tYi04IHtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbn1cblxuLi1tdC0xNiB7XG4gIG1hcmdpbi10b3A6IC00cmVtO1xufVxuXG4uZm9jdXNcXDpvdXRsaW5lLW5vbmU6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIG91dGxpbmUtb2Zmc2V0OiAycHg7XG59XG5cbi5vdmVyZmxvdy1oaWRkZW4ge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4ucC02IHtcbiAgcGFkZGluZzogMS41cmVtO1xufVxuXG4ucC0xMiB7XG4gIHBhZGRpbmc6IDNyZW07XG59XG5cbi5weC00IHtcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAxcmVtO1xufVxuXG4ucHQtMSB7XG4gIHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ucHItMiB7XG4gIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbn1cblxuLmZpeGVkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uYWJzb2x1dGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5yZWxhdGl2ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLnRvcC0wIHtcbiAgdG9wOiAwO1xufVxuXG4ucmlnaHQtMCB7XG4gIHJpZ2h0OiAwO1xufVxuXG4ubGVmdC0wIHtcbiAgbGVmdDogMDtcbn1cblxuLnNoYWRvdy1tZCB7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCAycHggNHB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuLnRleHQtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udGV4dC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG4udGV4dC1ncmF5LTQwMCB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2NiZDVlMDtcbiAgY29sb3I6IHJnYmEoMjAzLCAyMTMsIDIyNCwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi50ZXh0LWdyYXktNjAwIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjNzE4MDk2O1xuICBjb2xvcjogcmdiYSgxMTMsIDEyOCwgMTUwLCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLnRleHQtZ3JheS03MDAge1xuICAtLXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6ICM0YTU1Njg7XG4gIGNvbG9yOiByZ2JhKDc0LCA4NSwgMTA0LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLmhvdmVyXFw6dGV4dC13aGl0ZTpob3ZlciB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2ZmZjtcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi5jYXBpdGFsaXplIHtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG59XG5cbi5ob3ZlclxcOnVuZGVybGluZTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4udmlzaWJsZSB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59XG5cbi53LTEwIHtcbiAgd2lkdGg6IDIuNXJlbTtcbn1cblxuLnctMzIge1xuICB3aWR0aDogOHJlbTtcbn1cblxuLnctMVxcLzMge1xuICB3aWR0aDogMzMuMzMzMzMzJTtcbn1cblxuLmdhcC0xMCB7XG4gIGdyaWQtZ2FwOiAyLjVyZW07XG4gIGdhcDogMi41cmVtO1xufVxuXG4uZ3JpZC1jb2xzLWNhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpO1xufVxuXG4udHJhbnNmb3JtIHtcbiAgLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS15OiAwO1xuICAtLXRyYW5zZm9ybS1yb3RhdGU6IDA7XG4gIC0tdHJhbnNmb3JtLXNrZXcteDogMDtcbiAgLS10cmFuc2Zvcm0tc2tldy15OiAwO1xuICAtLXRyYW5zZm9ybS1zY2FsZS14OiAxO1xuICAtLXRyYW5zZm9ybS1zY2FsZS15OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgodmFyKC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS14KSkgdHJhbnNsYXRlWSh2YXIoLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXkpKSByb3RhdGUodmFyKC0tdHJhbnNmb3JtLXJvdGF0ZSkpIHNrZXdYKHZhcigtLXRyYW5zZm9ybS1za2V3LXgpKSBza2V3WSh2YXIoLS10cmFuc2Zvcm0tc2tldy15KSkgc2NhbGVYKHZhcigtLXRyYW5zZm9ybS1zY2FsZS14KSkgc2NhbGVZKHZhcigtLXRyYW5zZm9ybS1zY2FsZS15KSk7XG59XG5cbi50cmFuc2l0aW9uLWFsbCB7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IGFsbDtcbn1cblxuLmVhc2Utb3V0IHtcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uZHVyYXRpb24tMTUwIHtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMTUwbXM7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcGluZyB7XG4gIDc1JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICA1MCUge1xuICAgIG9wYWNpdHk6IC41O1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjUlKTtcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC44LDAsMSwxKTtcbiAgfVxuXG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLDAsMC4yLDEpO1xuICB9XG59XG5cbi5iZy10cmFuc3BhcmVudC1zaGFwZSB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAyMCUyMDIwJTIyJTIwZmlsbCUzRCUyMm5vbmUlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyMiUzRSUwQSUzQ3JlY3QlMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjBmaWxsJTNEJTIyd2hpdGUlMjIlMkYlM0UlMEElM0NyZWN0JTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wMyUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB4JTNEJTIyMTAlMjIlMjB5JTNEJTIyMTAlMjIlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjAzJTIyJTJGJTNFJTBBJTNDcmVjdCUyMHglM0QlMjIxMCUyMiUyMHdpZHRoJTNEJTIyMTAlMjIlMjBoZWlnaHQlM0QlMjIxMCUyMiUyMGZpbGwlM0QlMjJibGFjayUyMiUyMGZpbGwtb3BhY2l0eSUzRCUyMjAuMDYlMjIlMkYlM0UlMEElM0NyZWN0JTIweSUzRCUyMjEwJTIyJTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wNiUyMiUyRiUzRSUwQSUzQyUyRnN2ZyUzRSUwQSk7XG59PC9zdHlsZT5cblxuPGRpdj5TdHlsZTwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFWQSxjQUFDLGVBQ0QsUUFBUSxlQUNSLE9BQU8sQUFBQyxDQUFDLEFBQ1AsVUFBVSxDQUFFLFVBQVUsQ0FDdEIsWUFBWSxDQUFFLENBQUMsQ0FDZixZQUFZLENBQUUsS0FBSyxDQUNuQixZQUFZLENBQUUsT0FBTyxBQUN2QixDQUFDLEFBc1lELFdBQVcsa0JBQUssQ0FBQyxBQUNmLEVBQUUsQUFBQyxDQUFDLEFBQ0YsU0FBUyxDQUFFLE9BQU8sTUFBTSxDQUFDLEFBQzNCLENBQUMsQUFDSCxDQUFDLEFBRUQsV0FBVyxrQkFBSyxDQUFDLEFBQ2YsR0FBRyxDQUFFLElBQUksQUFBQyxDQUFDLEFBQ1QsU0FBUyxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQ25CLE9BQU8sQ0FBRSxDQUFDLEFBQ1osQ0FBQyxBQUNILENBQUMsQUFFRCxXQUFXLG1CQUFNLENBQUMsQUFDaEIsR0FBRyxBQUFDLENBQUMsQUFDSCxPQUFPLENBQUUsRUFBRSxBQUNiLENBQUMsQUFDSCxDQUFDLEFBRUQsV0FBVyxvQkFBTyxDQUFDLEFBQ2pCLEVBQUUsQ0FBRSxJQUFJLEFBQUMsQ0FBQyxBQUNSLFNBQVMsQ0FBRSxXQUFXLElBQUksQ0FBQyxDQUMzQix5QkFBeUIsQ0FBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUNwRCxDQUFDLEFBRUQsR0FBRyxBQUFDLENBQUMsQUFDSCxTQUFTLENBQUUsSUFBSSxDQUNmLHlCQUF5QixDQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEFBQ3BELENBQUMsQUFDSCxDQUFDIn0= */";
    	append_dev(document.head, style);
    }

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Style";
    			attr_dev(div, "class", "svelte-f227p9");
    			add_location(div, file$4, 773, 0, 14312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Style", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Style> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Style extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-f227p9-style")) add_css$3();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Style",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/App.svelte generated by Svelte v3.29.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$5 = "src/components/App.svelte";

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-cu4tlh-style";
    	style.textContent = "h1.svelte-cu4tlh{font-size:2em;margin:0.67em 0}a.svelte-cu4tlh{background-color:transparent}img.svelte-cu4tlh{border-style:none}h1.svelte-cu4tlh,p.svelte-cu4tlh{margin:0}.svelte-cu4tlh,.svelte-cu4tlh::before,.svelte-cu4tlh::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}img.svelte-cu4tlh{border-style:solid}h1.svelte-cu4tlh{font-size:inherit;font-weight:inherit}a.svelte-cu4tlh{color:inherit;text-decoration:inherit}img.svelte-cu4tlh{display:block;vertical-align:middle}img.svelte-cu4tlh{max-width:100%;height:auto}.bg-white.svelte-cu4tlh{--bg-opacity:1;background-color:#fff;background-color:rgba(255, 255, 255, var(--bg-opacity))}.bg-gray-200.svelte-cu4tlh{--bg-opacity:1;background-color:#edf2f7;background-color:rgba(237, 242, 247, var(--bg-opacity))}.border-white.svelte-cu4tlh{--border-opacity:1;border-color:#fff;border-color:rgba(255, 255, 255, var(--border-opacity))}.border-gray-200.svelte-cu4tlh{--border-opacity:1;border-color:#edf2f7;border-color:rgba(237, 242, 247, var(--border-opacity))}.rounded.svelte-cu4tlh{border-radius:0.25rem}.rounded-lg.svelte-cu4tlh{border-radius:0.5rem}.border-2.svelte-cu4tlh{border-width:2px}.border-8.svelte-cu4tlh{border-width:8px}.inline-block.svelte-cu4tlh{display:inline-block}.flex.svelte-cu4tlh{display:flex}.items-end.svelte-cu4tlh{align-items:flex-end}.justify-end.svelte-cu4tlh{justify-content:flex-end}.justify-center.svelte-cu4tlh{justify-content:center}.font-semibold.svelte-cu4tlh{font-weight:600}.h-10.svelte-cu4tlh{height:2.5rem}.h-32.svelte-cu4tlh{height:8rem}.text-xs.svelte-cu4tlh{font-size:0.75rem;line-height:1rem}.text-2xl.svelte-cu4tlh{font-size:1.5rem;line-height:2rem}.mr-2.svelte-cu4tlh{margin-right:0.5rem}.ml-2.svelte-cu4tlh{margin-left:0.5rem}.mb-6.svelte-cu4tlh{margin-bottom:1.5rem}.-mt-16.svelte-cu4tlh{margin-top:-4rem}.overflow-hidden.svelte-cu4tlh{overflow:hidden}.pt-1.svelte-cu4tlh{padding-top:0.25rem}.pr-2.svelte-cu4tlh{padding-right:0.5rem}.absolute.svelte-cu4tlh{position:absolute}.relative.svelte-cu4tlh{position:relative}.top-0.svelte-cu4tlh{top:0}.right-0.svelte-cu4tlh{right:0}.left-0.svelte-cu4tlh{left:0}.shadow-md.svelte-cu4tlh{box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)}.text-center.svelte-cu4tlh{text-align:center}.text-right.svelte-cu4tlh{text-align:right}.text-gray-400.svelte-cu4tlh{--text-opacity:1;color:#cbd5e0;color:rgba(203, 213, 224, var(--text-opacity))}.text-gray-600.svelte-cu4tlh{--text-opacity:1;color:#718096;color:rgba(113, 128, 150, var(--text-opacity))}.hover\\:underline.svelte-cu4tlh:hover{text-decoration:underline}.w-32.svelte-cu4tlh{width:8rem}.w-1\\/3.svelte-cu4tlh{width:33.333333%}.ease-out.svelte-cu4tlh{transition-timing-function:cubic-bezier(0, 0, 0.2, 1)}.duration-150.svelte-cu4tlh{transition-duration:150ms}@keyframes svelte-cu4tlh-spin{to{transform:rotate(360deg)}}@keyframes svelte-cu4tlh-ping{75%,100%{transform:scale(2);opacity:0}}@keyframes svelte-cu4tlh-pulse{50%{opacity:.5}}@keyframes svelte-cu4tlh-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}.bg-transparent-shape.svelte-cu4tlh{background-image:url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22white%22%2F%3E%0A%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.03%22%2F%3E%0A%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22black%22%20fill-opacity%3D%220.06%22%2F%3E%0A%3C%2Fsvg%3E%0A)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQXBwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuO1xuO1xuaW1wb3J0IHsgY3JlYXRlQXZhdGFyIH0gZnJvbSAnQGRpY2ViZWFyL2F2YXRhcnMnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL0J1dHRvbi5zdmVsdGUnO1xuaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSc7XG5pbXBvcnQgRm9ybVNjZW5lIGZyb20gJy4vc2NlbmVzL0Zvcm0uc3ZlbHRlJztcbmltcG9ydCBNb2RlU2NlbmUgZnJvbSAnLi9zY2VuZXMvTW9kZS5zdmVsdGUnO1xuaW1wb3J0IFN0eWxlU2NlbmUgZnJvbSAnLi9zY2VuZXMvU3R5bGUuc3ZlbHRlJztcbmltcG9ydCB7IGFmdGVyVXBkYXRlLCBnZXRDb250ZXh0LCBzZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbmV4cG9ydCBsZXQgbW9kZXMgPSBbJ2NyZWF0b3InXTtcbmV4cG9ydCBsZXQgc3R5bGVzO1xuZXhwb3J0IGxldCBpMThuID0ge307XG5sZXQgbW9kZSA9IG1vZGVzWzBdO1xubGV0IHN0eWxlID0gc3R5bGVzWzBdO1xubGV0IHNjZW5lID0gZ2V0UG9zc2libGVTY2VuZXMoKVswXTtcbmxldCBvcHRpb25zID0ge307XG5sZXQgY29udGVudEhlaWdodCA9IDA7XG5sZXQgY29udGVudFRyYW5zaXRpb25zID0gZmFsc2U7XG4kOiB0cmFucyA9IGdldENvbnRleHQoJ3RyYW5zJyk7XG4kOiBiYWNrU2NlbmUgPSBnZXRCYWNrU2NlbmUoKTtcbiQ6IGF2YXRhciA9XG4gICAgc2NlbmUgPT09ICdmb3JtJ1xuICAgICAgICA/IGNyZWF0ZUF2YXRhcihzdHlsZSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyB3aWR0aDogdW5kZWZpbmVkLCBoZWlnaHQ6IHVuZGVmaW5lZCwgYmFzZTY0OiB0cnVlIH0pKVxuICAgICAgICA6ICdkYXRhOiwnO1xuc2V0Q29udGV4dCgndHJhbnMnLCBPYmplY3QuYXNzaWduKHsgbW9kZUhlYWRsaW5lOiAnQ2hvb3NlIGEgbW9kZScsIHN0eWxlSGVhZGxpbmU6ICdDaG9vc2UgYSBzdHlsZScsIGNyZWF0b3JNb2RlRGVzY3JpcHRpb246ICdDcmVhdGUgYSBpbmRpdmlkdWFsIGF2YXRhciBwaWVjZSBieSBwaWVjZS4nLCBkZXRlcm1pbmlzdGljTW9kZURlc2NyaXB0aW9uOiAnQ3JlYXRlIGRldGVybWluaXN0aWMgYXZhdGFycyBmcm9tIGEgc2VlZC4nIH0sIGkxOG4pKTtcbnNldENvbnRleHQoJ21vZGUnLCB7XG4gICAgZ2V0OiAoKSA9PiBtb2RlLFxuICAgIHNldDogY2hhbmdlTW9kZSxcbn0pO1xuc2V0Q29udGV4dCgnc3R5bGUnLCB7XG4gICAgZ2V0OiAoKSA9PiBzdHlsZSxcbiAgICBzZXQ6IGNoYW5nZVN0eWxlLFxufSk7XG5zZXRDb250ZXh0KCdvcHRpb25zJywge1xuICAgIGdldDogKCkgPT4gb3B0aW9ucyxcbiAgICBzZXQ6IGNoYW5nZU9wdGlvbnMsXG59KTtcbmFmdGVyVXBkYXRlKCgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb250ZW50VHJhbnNpdGlvbnMgPSBjb250ZW50SGVpZ2h0ID4gMDtcbiAgICB9LCAxMDApO1xufSkpO1xuZnVuY3Rpb24gY2hhbmdlTW9kZShuZXdNb2RlKSB7XG4gICAgbW9kZSA9IG5ld01vZGU7XG4gICAgc2NlbmUgPSBnZXRQb3NzaWJsZVNjZW5lcygpLmZpbHRlcigodikgPT4gdiAhPT0gJ21vZGUnKVswXTtcbiAgICBvcHRpb25zID0ge307XG59XG5mdW5jdGlvbiBjaGFuZ2VTdHlsZShuZXdTdHlsZSkge1xuICAgIHN0eWxlID0gbmV3U3R5bGU7XG4gICAgc2NlbmUgPSAnZm9ybSc7XG4gICAgb3B0aW9ucyA9IHt9O1xufVxuZnVuY3Rpb24gY2hhbmdlU2NlbmUobmV3U2NlbmUpIHtcbiAgICBzY2VuZSA9IG5ld1NjZW5lO1xufVxuZnVuY3Rpb24gY2hhbmdlT3B0aW9ucyhuZXdPcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG5ld09wdGlvbnM7XG59XG5mdW5jdGlvbiBnZXRQb3NzaWJsZVNjZW5lcygpIHtcbiAgICBsZXQgc2NlbmVzID0gW107XG4gICAgaWYgKG1vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc2NlbmVzLnB1c2goJ21vZGUnKTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHN0eWxlcykubGVuZ3RoID4gMSkge1xuICAgICAgICBzY2VuZXMucHVzaCgnc3R5bGUnKTtcbiAgICB9XG4gICAgc2NlbmVzLnB1c2goJ2Zvcm0nKTtcbiAgICByZXR1cm4gc2NlbmVzO1xufVxuZnVuY3Rpb24gZ2V0QmFja1NjZW5lKCkge1xuICAgIGxldCBwb3NzaWJsZVNjZW5lcyA9IGdldFBvc3NpYmxlU2NlbmVzKCk7XG4gICAgbGV0IGN1cnJlbnRTY2VuZUluZGV4ID0gcG9zc2libGVTY2VuZXMuaW5kZXhPZihzY2VuZSk7XG4gICAgY29uc29sZS5sb2coY3VycmVudFNjZW5lSW5kZXgpO1xuICAgIHJldHVybiBjdXJyZW50U2NlbmVJbmRleCA9PT0gMCA/IHVuZGVmaW5lZCA6IHBvc3NpYmxlU2NlbmVzW2N1cnJlbnRTY2VuZUluZGV4IC0gMV07XG59XG48L3NjcmlwdD5cblxuPHN0eWxlPi8qKiBBcHAgKDw9IEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzQzMTMpICovXG5cbi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYiB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbi8qKlxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbiB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5cblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cbiAqL1xuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBNYW51YWxseSBmb3JrZWQgZnJvbSBTVUlUIENTUyBCYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3VpdGNzcy9iYXNlXG4gKiBBIHRoaW4gbGF5ZXIgb24gdG9wIG9mIG5vcm1hbGl6ZS5jc3MgdGhhdCBwcm92aWRlcyBhIHN0YXJ0aW5nIHBvaW50IG1vcmVcbiAqIHN1aXRhYmxlIGZvciB3ZWIgYXBwbGljYXRpb25zLlxuICovXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZGVmYXVsdCBzcGFjaW5nIGFuZCBib3JkZXIgZm9yIGFwcHJvcHJpYXRlIGVsZW1lbnRzLlxuICovXG5cblxuaDEsXG5oMixcbnAge1xuICBtYXJnaW46IDA7XG59XG5cbmJ1dHRvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xufVxuXG4vKipcbiAqIFdvcmsgYXJvdW5kIGEgRmlyZWZveC9JRSBidWcgd2hlcmUgdGhlIHRyYW5zcGFyZW50IGBidXR0b25gIGJhY2tncm91bmRcbiAqIHJlc3VsdHMgaW4gYSBsb3NzIG9mIHRoZSBkZWZhdWx0IGBidXR0b25gIGZvY3VzIHN0eWxlcy5cbiAqL1xuXG5idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiAxcHggZG90dGVkO1xuICBvdXRsaW5lOiA1cHggYXV0byAtd2Via2l0LWZvY3VzLXJpbmctY29sb3I7XG59XG5cbi8qKlxuICogVGFpbHdpbmQgY3VzdG9tIHJlc2V0IHN0eWxlc1xuICovXG5cbi8qKlxuICogMS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBgc2Fuc2AgZm9udC1mYW1pbHkgKHdpdGggVGFpbHdpbmQncyBkZWZhdWx0XG4gKiAgICBzYW5zLXNlcmlmIGZvbnQgc3RhY2sgYXMgYSBmYWxsYmFjaykgYXMgYSBzYW5lIGRlZmF1bHQuXG4gKiAyLiBVc2UgVGFpbHdpbmQncyBkZWZhdWx0IFwibm9ybWFsXCIgbGluZS1oZWlnaHQgc28gdGhlIHVzZXIgaXNuJ3QgZm9yY2VkXG4gKiAgICB0byBvdmVycmlkZSBpdCB0byBlbnN1cmUgY29uc2lzdGVuY3kgZXZlbiB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHRoZW1lLlxuICovXG5cbmh0bWwge1xuICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuNTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIFByZXZlbnQgcGFkZGluZyBhbmQgYm9yZGVyIGZyb20gYWZmZWN0aW5nIGVsZW1lbnQgd2lkdGguXG4gKlxuICogICAgV2UgdXNlZCB0byBzZXQgdGhpcyBpbiB0aGUgaHRtbCBlbGVtZW50IGFuZCBpbmhlcml0IGZyb21cbiAqICAgIHRoZSBwYXJlbnQgZWxlbWVudCBmb3IgZXZlcnl0aGluZyBlbHNlLiBUaGlzIGNhdXNlZCBpc3N1ZXNcbiAqICAgIGluIHNoYWRvdy1kb20tZW5oYW5jZWQgZWxlbWVudHMgbGlrZSA8ZGV0YWlscz4gd2hlcmUgdGhlIGNvbnRlbnRcbiAqICAgIGlzIHdyYXBwZWQgYnkgYSBkaXYgd2l0aCBib3gtc2l6aW5nIHNldCB0byBgY29udGVudC1ib3hgLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvNFxuICpcbiAqXG4gKiAyLiBBbGxvdyBhZGRpbmcgYSBib3JkZXIgdG8gYW4gZWxlbWVudCBieSBqdXN0IGFkZGluZyBhIGJvcmRlci13aWR0aC5cbiAqXG4gKiAgICBCeSBkZWZhdWx0LCB0aGUgd2F5IHRoZSBicm93c2VyIHNwZWNpZmllcyB0aGF0IGFuIGVsZW1lbnQgc2hvdWxkIGhhdmUgbm9cbiAqICAgIGJvcmRlciBpcyBieSBzZXR0aW5nIGl0J3MgYm9yZGVyLXN0eWxlIHRvIGBub25lYCBpbiB0aGUgdXNlci1hZ2VudFxuICogICAgc3R5bGVzaGVldC5cbiAqXG4gKiAgICBJbiBvcmRlciB0byBlYXNpbHkgYWRkIGJvcmRlcnMgdG8gZWxlbWVudHMgYnkganVzdCBzZXR0aW5nIHRoZSBgYm9yZGVyLXdpZHRoYFxuICogICAgcHJvcGVydHksIHdlIGNoYW5nZSB0aGUgZGVmYXVsdCBib3JkZXItc3R5bGUgZm9yIGFsbCBlbGVtZW50cyB0byBgc29saWRgLCBhbmRcbiAqICAgIHVzZSBib3JkZXItd2lkdGggdG8gaGlkZSB0aGVtIGluc3RlYWQuIFRoaXMgd2F5IG91ciBgYm9yZGVyYCB1dGlsaXRpZXMgb25seVxuICogICAgbmVlZCB0byBzZXQgdGhlIGBib3JkZXItd2lkdGhgIHByb3BlcnR5IGluc3RlYWQgb2YgdGhlIGVudGlyZSBgYm9yZGVyYFxuICogICAgc2hvcnRoYW5kLCBtYWtpbmcgb3VyIGJvcmRlciB1dGlsaXRpZXMgbXVjaCBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCB0byBjb21wb3NlLlxuICpcbiAqICAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9wdWxsLzExNlxuICovXG5cbiosXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGJvcmRlci13aWR0aDogMDsgLyogMiAqL1xuICBib3JkZXItc3R5bGU6IHNvbGlkOyAvKiAyICovXG4gIGJvcmRlci1jb2xvcjogI2UyZThmMDsgLyogMiAqL1xufVxuXG4vKlxuICogRW5zdXJlIGhvcml6b250YWwgcnVsZXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdFxuICovXG5cbi8qKlxuICogVW5kbyB0aGUgYGJvcmRlci1zdHlsZTogbm9uZWAgcmVzZXQgdGhhdCBOb3JtYWxpemUgYXBwbGllcyB0byBpbWFnZXMgc28gdGhhdFxuICogb3VyIGBib3JkZXIte3dpZHRofWAgdXRpbGl0aWVzIGhhdmUgdGhlIGV4cGVjdGVkIGVmZmVjdC5cbiAqXG4gKiBUaGUgTm9ybWFsaXplIHJlc2V0IGlzIHVubmVjZXNzYXJ5IGZvciB1cyBzaW5jZSB3ZSBkZWZhdWx0IHRoZSBib3JkZXItd2lkdGhcbiAqIHRvIDAgb24gYWxsIGVsZW1lbnRzLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9pc3N1ZXMvMzYyXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbn1cblxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNhMGFlYzA7XG59XG5cbmJ1dHRvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaDEsXG5oMiB7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgbGlua3MgdG8gb3B0aW1pemUgZm9yIG9wdC1pbiBzdHlsaW5nIGluc3RlYWQgb2ZcbiAqIG9wdC1vdXQuXG4gKi9cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IGluaGVyaXQ7XG59XG5cbi8qKlxuICogUmVzZXQgZm9ybSBlbGVtZW50IHByb3BlcnRpZXMgdGhhdCBhcmUgZWFzeSB0byBmb3JnZXQgdG9cbiAqIHN0eWxlIGV4cGxpY2l0bHkgc28geW91IGRvbid0IGluYWR2ZXJ0ZW50bHkgaW50cm9kdWNlXG4gKiBzdHlsZXMgdGhhdCBkZXZpYXRlIGZyb20geW91ciBkZXNpZ24gc3lzdGVtLiBUaGVzZSBzdHlsZXNcbiAqIHN1cHBsZW1lbnQgYSBwYXJ0aWFsIHJlc2V0IHRoYXQgaXMgYWxyZWFkeSBhcHBsaWVkIGJ5XG4gKiBub3JtYWxpemUuY3NzLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgcGFkZGluZzogMDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuXG4vKipcbiAqIFVzZSB0aGUgY29uZmlndXJlZCAnbW9ubycgZm9udCBmYW1pbHkgZm9yIGVsZW1lbnRzIHRoYXRcbiAqIGFyZSBleHBlY3RlZCB0byBiZSByZW5kZXJlZCB3aXRoIGEgbW9ub3NwYWNlIGZvbnQsIGZhbGxpbmdcbiAqIGJhY2sgdG8gdGhlIHN5c3RlbSBtb25vc3BhY2Ugc3RhY2sgaWYgdGhlcmUgaXMgbm8gY29uZmlndXJlZFxuICogJ21vbm8nIGZvbnQgZmFtaWx5LlxuICovXG5cbi8qKlxuICogTWFrZSByZXBsYWNlZCBlbGVtZW50cyBgZGlzcGxheTogYmxvY2tgIGJ5IGRlZmF1bHQgYXMgdGhhdCdzXG4gKiB0aGUgYmVoYXZpb3IgeW91IHdhbnQgYWxtb3N0IGFsbCBvZiB0aGUgdGltZS4gSW5zcGlyZWQgYnlcbiAqIENTUyBSZW1lZHksIHdpdGggYHN2Z2AgYWRkZWQgYXMgd2VsbC5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nLFxuc3ZnLFxub2JqZWN0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi8qKlxuICogQ29uc3RyYWluIGltYWdlcyBhbmQgdmlkZW9zIHRvIHRoZSBwYXJlbnQgd2lkdGggYW5kIHByZXNlcnZlXG4gKiB0aGVpciBpbnN0cmluc2ljIGFzcGVjdCByYXRpby5cbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0XG4gKi9cblxuaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi5iZy13aGl0ZSB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTEwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZmFmYztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDcsIDI1MCwgMjUyLCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5iZy1ncmF5LTIwMCB7XG4gIC0tYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZjJmNztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1iZy1vcGFjaXR5KSk7XG59XG5cbi5ob3ZlclxcOmJnLWdyYXktOTAwOmhvdmVyIHtcbiAgLS1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWEyMDJjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI2LCAzMiwgNDQsIHZhcigtLWJnLW9wYWNpdHkpKTtcbn1cblxuLmJvcmRlci13aGl0ZSB7XG4gIC0tYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLWJvcmRlci1vcGFjaXR5KSk7XG59XG5cbi5ib3JkZXItZ3JheS0yMDAge1xuICAtLWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6ICNlZGYyZjc7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMzcsIDI0MiwgMjQ3LCB2YXIoLS1ib3JkZXItb3BhY2l0eSkpO1xufVxuXG4ucm91bmRlZCB7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi5yb3VuZGVkLWxnIHtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xufVxuXG4uYm9yZGVyLTIge1xuICBib3JkZXItd2lkdGg6IDJweDtcbn1cblxuLmJvcmRlci04IHtcbiAgYm9yZGVyLXdpZHRoOiA4cHg7XG59XG5cbi5ib3JkZXIge1xuICBib3JkZXItd2lkdGg6IDFweDtcbn1cblxuLmlubGluZS1ibG9jayB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZsZXgge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5saW5lLWZsZXgge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbn1cblxuLmdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLml0ZW1zLWVuZCB7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbn1cblxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5qdXN0aWZ5LWVuZCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uZmxleC1ncm93IHtcbiAgZmxleC1ncm93OiAxO1xufVxuXG4uZm9udC1zZW1pYm9sZCB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi5oLTIge1xuICBoZWlnaHQ6IDAuNXJlbTtcbn1cblxuLmgtMTAge1xuICBoZWlnaHQ6IDIuNXJlbTtcbn1cblxuLmgtMzIge1xuICBoZWlnaHQ6IDhyZW07XG59XG5cbi50ZXh0LXhzIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBsaW5lLWhlaWdodDogMXJlbTtcbn1cblxuLnRleHQteGwge1xuICBmb250LXNpemU6IDEuMjVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjc1cmVtO1xufVxuXG4udGV4dC0yeGwge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDJyZW07XG59XG5cbi5tci0yIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5tbC0yIHtcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbn1cblxuLm1iLTYge1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG5cbi5tYi04IHtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbn1cblxuLi1tdC0xNiB7XG4gIG1hcmdpbi10b3A6IC00cmVtO1xufVxuXG4uZm9jdXNcXDpvdXRsaW5lLW5vbmU6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIG91dGxpbmUtb2Zmc2V0OiAycHg7XG59XG5cbi5vdmVyZmxvdy1oaWRkZW4ge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4ucC02IHtcbiAgcGFkZGluZzogMS41cmVtO1xufVxuXG4ucC0xMiB7XG4gIHBhZGRpbmc6IDNyZW07XG59XG5cbi5weC00IHtcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAxcmVtO1xufVxuXG4ucHQtMSB7XG4gIHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ucHItMiB7XG4gIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbn1cblxuLmZpeGVkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uYWJzb2x1dGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5yZWxhdGl2ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLnRvcC0wIHtcbiAgdG9wOiAwO1xufVxuXG4ucmlnaHQtMCB7XG4gIHJpZ2h0OiAwO1xufVxuXG4ubGVmdC0wIHtcbiAgbGVmdDogMDtcbn1cblxuLnNoYWRvdy1tZCB7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCAycHggNHB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuLnRleHQtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udGV4dC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG4udGV4dC1ncmF5LTQwMCB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2NiZDVlMDtcbiAgY29sb3I6IHJnYmEoMjAzLCAyMTMsIDIyNCwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi50ZXh0LWdyYXktNjAwIHtcbiAgLS10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiAjNzE4MDk2O1xuICBjb2xvcjogcmdiYSgxMTMsIDEyOCwgMTUwLCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLnRleHQtZ3JheS03MDAge1xuICAtLXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6ICM0YTU1Njg7XG4gIGNvbG9yOiByZ2JhKDc0LCA4NSwgMTA0LCB2YXIoLS10ZXh0LW9wYWNpdHkpKTtcbn1cblxuLmhvdmVyXFw6dGV4dC13aGl0ZTpob3ZlciB7XG4gIC0tdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogI2ZmZjtcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdGV4dC1vcGFjaXR5KSk7XG59XG5cbi5jYXBpdGFsaXplIHtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG59XG5cbi5ob3ZlclxcOnVuZGVybGluZTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4udmlzaWJsZSB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59XG5cbi53LTEwIHtcbiAgd2lkdGg6IDIuNXJlbTtcbn1cblxuLnctMzIge1xuICB3aWR0aDogOHJlbTtcbn1cblxuLnctMVxcLzMge1xuICB3aWR0aDogMzMuMzMzMzMzJTtcbn1cblxuLmdhcC0xMCB7XG4gIGdyaWQtZ2FwOiAyLjVyZW07XG4gIGdhcDogMi41cmVtO1xufVxuXG4uZ3JpZC1jb2xzLWNhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpO1xufVxuXG4udHJhbnNmb3JtIHtcbiAgLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS15OiAwO1xuICAtLXRyYW5zZm9ybS1yb3RhdGU6IDA7XG4gIC0tdHJhbnNmb3JtLXNrZXcteDogMDtcbiAgLS10cmFuc2Zvcm0tc2tldy15OiAwO1xuICAtLXRyYW5zZm9ybS1zY2FsZS14OiAxO1xuICAtLXRyYW5zZm9ybS1zY2FsZS15OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgodmFyKC0tdHJhbnNmb3JtLXRyYW5zbGF0ZS14KSkgdHJhbnNsYXRlWSh2YXIoLS10cmFuc2Zvcm0tdHJhbnNsYXRlLXkpKSByb3RhdGUodmFyKC0tdHJhbnNmb3JtLXJvdGF0ZSkpIHNrZXdYKHZhcigtLXRyYW5zZm9ybS1za2V3LXgpKSBza2V3WSh2YXIoLS10cmFuc2Zvcm0tc2tldy15KSkgc2NhbGVYKHZhcigtLXRyYW5zZm9ybS1zY2FsZS14KSkgc2NhbGVZKHZhcigtLXRyYW5zZm9ybS1zY2FsZS15KSk7XG59XG5cbi50cmFuc2l0aW9uLWFsbCB7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IGFsbDtcbn1cblxuLmVhc2Utb3V0IHtcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uZHVyYXRpb24tMTUwIHtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMTUwbXM7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcGluZyB7XG4gIDc1JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICA1MCUge1xuICAgIG9wYWNpdHk6IC41O1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjUlKTtcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC44LDAsMSwxKTtcbiAgfVxuXG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLDAsMC4yLDEpO1xuICB9XG59XG5cbi5iZy10cmFuc3BhcmVudC1zaGFwZSB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAyMCUyMDIwJTIyJTIwZmlsbCUzRCUyMm5vbmUlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyMiUzRSUwQSUzQ3JlY3QlMjB3aWR0aCUzRCUyMjIwJTIyJTIwaGVpZ2h0JTNEJTIyMjAlMjIlMjBmaWxsJTNEJTIyd2hpdGUlMjIlMkYlM0UlMEElM0NyZWN0JTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wMyUyMiUyRiUzRSUwQSUzQ3JlY3QlMjB4JTNEJTIyMTAlMjIlMjB5JTNEJTIyMTAlMjIlMjB3aWR0aCUzRCUyMjEwJTIyJTIwaGVpZ2h0JTNEJTIyMTAlMjIlMjBmaWxsJTNEJTIyYmxhY2slMjIlMjBmaWxsLW9wYWNpdHklM0QlMjIwLjAzJTIyJTJGJTNFJTBBJTNDcmVjdCUyMHglM0QlMjIxMCUyMiUyMHdpZHRoJTNEJTIyMTAlMjIlMjBoZWlnaHQlM0QlMjIxMCUyMiUyMGZpbGwlM0QlMjJibGFjayUyMiUyMGZpbGwtb3BhY2l0eSUzRCUyMjAuMDYlMjIlMkYlM0UlMEElM0NyZWN0JTIweSUzRCUyMjEwJTIyJTIwd2lkdGglM0QlMjIxMCUyMiUyMGhlaWdodCUzRCUyMjEwJTIyJTIwZmlsbCUzRCUyMmJsYWNrJTIyJTIwZmlsbC1vcGFjaXR5JTNEJTIyMC4wNiUyMiUyRiUzRSUwQSUzQyUyRnN2ZyUzRSUwQSk7XG59PC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cImJnLWdyYXktMjAwIGJvcmRlci04IHJvdW5kZWQtbGcgYm9yZGVyLWdyYXktMjAwXCI+XG4gIDxkaXYgY2xhc3M9XCJoLTEwIGZsZXggbWItNlwiPlxuICAgIDxkaXYgY2xhc3M9XCJmbGV4IHctMS8zXCI+XG4gICAgICB7I2lmIGJhY2tTY2VuZX1cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1yLTJcIj5cbiAgICAgICAgICA8QnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBjaGFuZ2VTY2VuZShiYWNrU2NlbmUpfSBpY29uPVwiY2hldnJvbi1sZWZ0XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICB7L2lmfVxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ3LTEvMyBmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWVuZCBcIj5cbiAgICAgIHsjaWYgc2NlbmUgPT09ICdtb2RlJ31cbiAgICAgICAgPGgxIGNsYXNzPVwidGV4dC0yeGwgdGV4dC1ncmF5LTYwMFwiPnt0cmFucy5tb2RlSGVhZGxpbmV9PC9oMT5cbiAgICAgIHs6ZWxzZSBpZiBzY2VuZSA9PT0gJ3N0eWxlJ31cbiAgICAgICAgPGgxIGNsYXNzPVwidGV4dC0yeGwgdGV4dC1ncmF5LTYwMFwiPnt0cmFucy5zdHlsZUhlYWRsaW5lfTwvaDE+XG4gICAgICB7OmVsc2UgaWYgc2NlbmUgPT09ICdmb3JtJ31cbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIGxlZnQtMCByaWdodC0wXCI+XG4gICAgICAgICAgPGltZ1xuICAgICAgICAgICAgc3JjPXthdmF0YXJ9XG4gICAgICAgICAgICBjbGFzcz1cInctMzIgaC0zMiAtbXQtMTYgaW5saW5lLWJsb2NrIGJvcmRlci0yIGJvcmRlci13aGl0ZSByb3VuZGVkLWxnIHNoYWRvdy1tZCBiZy10cmFuc3BhcmVudC1zaGFwZVwiXG4gICAgICAgICAgICBhbHQ9XCJZb3VyIEF2YXRhclwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgey9pZn1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZmxleCB3LTEvMyBqdXN0aWZ5LWVuZFwiPlxuICAgICAgeyNpZiBzY2VuZSA9PT0gJ2Zvcm0nfVxuICAgICAgICA8ZGl2IGNsYXNzPVwibWwtMlwiPlxuICAgICAgICAgIDxCdXR0b24gaWNvbj1cInJlZnJlc2hcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1sLTJcIj5cbiAgICAgICAgICA8QnV0dG9uIGljb249XCJkb3dubG9hZFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgey9pZn1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJyb3VuZGVkIGJnLXdoaXRlIHNoYWRvdy1tZCByZWxhdGl2ZVwiPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwicmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuICR7Y29udGVudFRyYW5zaXRpb25zID8gJ3RyYW5zaXRpb24tYWxsIGVhc2Utb3V0IGR1cmF0aW9uLTE1MCcgOiAnJ31cIlxuICAgICAgc3R5bGU9XCJoZWlnaHQ6IHtjb250ZW50SGVpZ2h0fXB4O1wiPlxuICAgICAgeyNrZXkgc2NlbmV9XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhYnNvbHV0ZSB0b3AtMCBsZWZ0LTAgcmlnaHQtMFwiIGJpbmQ6b2Zmc2V0SGVpZ2h0PXtjb250ZW50SGVpZ2h0fT5cbiAgICAgICAgICB7I2lmIHNjZW5lID09PSAnbW9kZSd9XG4gICAgICAgICAgICA8TW9kZVNjZW5lIHttb2Rlc30gLz5cbiAgICAgICAgICB7OmVsc2UgaWYgc2NlbmUgPT09ICdzdHlsZSd9XG4gICAgICAgICAgICA8U3R5bGVTY2VuZSAvPlxuICAgICAgICAgIHs6ZWxzZSBpZiBzY2VuZSA9PT0gJ2Zvcm0nfVxuICAgICAgICAgICAgPEZvcm1TY2VuZSAvPlxuICAgICAgICAgIHsvaWZ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgey9rZXl9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG48cCBjbGFzcz1cInRleHQtcmlnaHQgdGV4dC14cyB0ZXh0LWdyYXktNDAwIHByLTIgcHQtMVwiPlxuICBQb3dlcmVkIEJ5XG4gIDxhIGhyZWY9XCJodHRwczovL2F2YXRhcnMuZGljZWJlYXIuY29tXCIgY2xhc3M9XCJmb250LXNlbWlib2xkIGhvdmVyOnVuZGVybGluZVwiPkRpY2VCZWFyIEF2YXRhcnM8L2E+XG48L3A+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0hBLEVBQUUsY0FBQyxDQUFDLEFBQ0YsU0FBUyxDQUFFLEdBQUcsQ0FDZCxNQUFNLENBQUUsTUFBTSxDQUFDLENBQUMsQUFDbEIsQ0FBQyxBQXNCRCxDQUFDLGNBQUMsQ0FBQyxBQUNELGdCQUFnQixDQUFFLFdBQVcsQUFDL0IsQ0FBQyxBQStDRCxHQUFHLGNBQUMsQ0FBQyxBQUNILFlBQVksQ0FBRSxJQUFJLEFBQ3BCLENBQUMsQUErSkQsZ0JBQUUsQ0FFRixDQUFDLGNBQUMsQ0FBQyxBQUNELE1BQU0sQ0FBRSxDQUFDLEFBQ1gsQ0FBQyxBQTJERCxjQUFDLGVBQ0QsUUFBUSxlQUNSLE9BQU8sQUFBQyxDQUFDLEFBQ1AsVUFBVSxDQUFFLFVBQVUsQ0FDdEIsWUFBWSxDQUFFLENBQUMsQ0FDZixZQUFZLENBQUUsS0FBSyxDQUNuQixZQUFZLENBQUUsT0FBTyxBQUN2QixDQUFDLEFBZ0JELEdBQUcsY0FBQyxDQUFDLEFBQ0gsWUFBWSxDQUFFLEtBQUssQUFDckIsQ0FBQyxBQVVELEVBQUUsY0FDQyxDQUFDLEFBQ0YsU0FBUyxDQUFFLE9BQU8s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 */";
    	append_dev(document.head, style);
    }

    // (861:6) {#if backScene}
    function create_if_block_7(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: { icon: "chevron-left" },
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[10]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "mr-2 svelte-cu4tlh");
    			add_location(div, file$5, 861, 8, 17406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(861:6) {#if backScene}",
    		ctx
    	});

    	return block;
    }

    // (872:33) 
    function create_if_block_6(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = /*avatar*/ ctx[6])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape svelte-cu4tlh");
    			attr_dev(img, "alt", "Your Avatar");
    			add_location(img, file$5, 873, 10, 17895);
    			attr_dev(div, "class", "text-center left-0 right-0 svelte-cu4tlh");
    			add_location(div, file$5, 872, 8, 17844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*avatar*/ 64 && img.src !== (img_src_value = /*avatar*/ ctx[6])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(872:33) ",
    		ctx
    	});

    	return block;
    }

    // (870:34) 
    function create_if_block_5(ctx) {
    	let h1;
    	let t_value = /*trans*/ ctx[4].styleHeadline + "";
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "class", "text-2xl text-gray-600 svelte-cu4tlh");
    			add_location(h1, file$5, 870, 8, 17740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trans*/ 16 && t_value !== (t_value = /*trans*/ ctx[4].styleHeadline + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(870:34) ",
    		ctx
    	});

    	return block;
    }

    // (868:6) {#if scene === 'mode'}
    function create_if_block_4$1(ctx) {
    	let h1;
    	let t_value = /*trans*/ ctx[4].modeHeadline + "";
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "class", "text-2xl text-gray-600 svelte-cu4tlh");
    			add_location(h1, file$5, 868, 8, 17636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trans*/ 16 && t_value !== (t_value = /*trans*/ ctx[4].modeHeadline + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(868:6) {#if scene === 'mode'}",
    		ctx
    	});

    	return block;
    }

    // (882:6) {#if scene === 'form'}
    function create_if_block_3$1(ctx) {
    	let div0;
    	let button0;
    	let t;
    	let div1;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: { icon: "refresh" },
    			$$inline: true
    		});

    	button1 = new Button({
    			props: { icon: "download" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(button1.$$.fragment);
    			attr_dev(div0, "class", "ml-2 svelte-cu4tlh");
    			add_location(div0, file$5, 882, 8, 18188);
    			attr_dev(div1, "class", "ml-2 svelte-cu4tlh");
    			add_location(div1, file$5, 885, 8, 18266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(button0, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(button1, div1, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(882:6) {#if scene === 'form'}",
    		ctx
    	});

    	return block;
    }

    // (902:37) 
    function create_if_block_2$1(ctx) {
    	let formscene;
    	let current;
    	formscene = new Form({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(formscene.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formscene, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formscene.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formscene.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formscene, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(902:37) ",
    		ctx
    	});

    	return block;
    }

    // (900:38) 
    function create_if_block_1$2(ctx) {
    	let stylescene;
    	let current;
    	stylescene = new Style({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(stylescene.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stylescene, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stylescene.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stylescene.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stylescene, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(900:38) ",
    		ctx
    	});

    	return block;
    }

    // (898:10) {#if scene === 'mode'}
    function create_if_block$3(ctx) {
    	let modescene;
    	let current;

    	modescene = new Mode({
    			props: { modes: /*modes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modescene.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modescene, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modescene_changes = {};
    			if (dirty & /*modes*/ 1) modescene_changes.modes = /*modes*/ ctx[0];
    			modescene.$set(modescene_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modescene.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modescene.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modescene, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(898:10) {#if scene === 'mode'}",
    		ctx
    	});

    	return block;
    }

    // (896:6) {#key scene}
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

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "absolute top-0 left-0 right-0 svelte-cu4tlh");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[11].call(div));
    			add_location(div, file$5, 896, 8, 18606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[11].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(896:6) {#key scene}",
    		ctx
    	});

    	return block;
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
    	let t4;
    	let a;
    	let current;
    	let if_block0 = /*backScene*/ ctx[5] && create_if_block_7(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*scene*/ ctx[1] === "mode") return create_if_block_4$1;
    		if (/*scene*/ ctx[1] === "style") return create_if_block_5;
    		if (/*scene*/ ctx[1] === "form") return create_if_block_6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = /*scene*/ ctx[1] === "form" && create_if_block_3$1(ctx);
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
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
    			t4 = text("Powered By\n  ");
    			a = element("a");
    			a.textContent = "DiceBear Avatars";
    			attr_dev(div0, "class", "flex w-1/3 svelte-cu4tlh");
    			add_location(div0, file$5, 859, 4, 17351);
    			attr_dev(div1, "class", "w-1/3 flex justify-center items-end  svelte-cu4tlh");
    			add_location(div1, file$5, 866, 4, 17548);
    			attr_dev(div2, "class", "flex w-1/3 justify-end svelte-cu4tlh");
    			add_location(div2, file$5, 880, 4, 18114);
    			attr_dev(div3, "class", "h-10 flex mb-6 svelte-cu4tlh");
    			add_location(div3, file$5, 858, 2, 17318);

    			attr_dev(div4, "class", div4_class_value = "relative overflow-hidden $" + (/*contentTransitions*/ ctx[3]
    			? "transition-all ease-out duration-150"
    			: "") + " svelte-cu4tlh");

    			set_style(div4, "height", /*contentHeight*/ ctx[2] + "px");
    			add_location(div4, file$5, 892, 4, 18425);
    			attr_dev(div5, "class", "rounded bg-white shadow-md relative svelte-cu4tlh");
    			add_location(div5, file$5, 891, 2, 18371);
    			attr_dev(div6, "class", "bg-gray-200 border-8 rounded-lg border-gray-200 svelte-cu4tlh");
    			add_location(div6, file$5, 857, 0, 17254);
    			attr_dev(a, "href", "https://avatars.dicebear.com");
    			attr_dev(a, "class", "font-semibold hover:underline svelte-cu4tlh");
    			add_location(a, file$5, 911, 2, 19022);
    			attr_dev(p, "class", "text-right text-xs text-gray-400 pr-2 pt-1 svelte-cu4tlh");
    			add_location(p, file$5, 909, 0, 18952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div3);
    			append_dev(div3, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			key_block.m(div4, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t4);
    			append_dev(p, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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
    					if_block2 = create_if_block_3$1(ctx);
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
    				attr_dev(div4, "class", div4_class_value);
    			}

    			if (!current || dirty & /*contentHeight*/ 4) {
    				set_style(div4, "height", /*contentHeight*/ ctx[2] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			if (if_block2) if_block2.d();
    			key_block.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

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

    	const writable_props = ["modes", "styles", "i18n"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

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

    	$$self.$capture_state = () => ({
    		__awaiter,
    		createAvatar: f,
    		Button,
    		Icon,
    		FormScene: Form,
    		ModeScene: Mode,
    		StyleScene: Style,
    		afterUpdate,
    		getContext,
    		setContext,
    		modes,
    		styles,
    		i18n,
    		mode,
    		style,
    		scene,
    		options,
    		contentHeight,
    		contentTransitions,
    		changeMode,
    		changeStyle,
    		changeScene,
    		changeOptions,
    		getPossibleScenes,
    		getBackScene,
    		trans,
    		backScene,
    		avatar
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("modes" in $$props) $$invalidate(0, modes = $$props.modes);
    		if ("styles" in $$props) $$invalidate(8, styles = $$props.styles);
    		if ("i18n" in $$props) $$invalidate(9, i18n = $$props.i18n);
    		if ("mode" in $$props) mode = $$props.mode;
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("scene" in $$props) $$invalidate(1, scene = $$props.scene);
    		if ("options" in $$props) $$invalidate(14, options = $$props.options);
    		if ("contentHeight" in $$props) $$invalidate(2, contentHeight = $$props.contentHeight);
    		if ("contentTransitions" in $$props) $$invalidate(3, contentTransitions = $$props.contentTransitions);
    		if ("trans" in $$props) $$invalidate(4, trans = $$props.trans);
    		if ("backScene" in $$props) $$invalidate(5, backScene = $$props.backScene);
    		if ("avatar" in $$props) $$invalidate(6, avatar = $$props.avatar);
    	};

    	let trans;
    	let backScene;
    	let avatar;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*scene, style, options*/ 24578) {
    			 $$invalidate(6, avatar = scene === "form"
    			? f(style, Object.assign(Object.assign({}, options), {
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

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-cu4tlh-style")) add_css$4();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { modes: 0, styles: 8, i18n: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*styles*/ ctx[8] === undefined && !("styles" in props)) {
    			console_1.warn("<App> was created without expected prop 'styles'");
    		}
    	}

    	get modes() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modes(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styles() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get i18n() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i18n(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = (function (options) {
      var target = options.target,
          props = __rest(options, ["target"]);

      return new App({
        target: target,
        props: props
      });
    });

    var watch = app({
      target: document.body,
      modes: ['creator', 'deterministic'],
      styles: [F]
    });

    exports.default = watch;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
