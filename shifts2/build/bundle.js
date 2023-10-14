
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
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
        else if (callback) {
            callback();
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
        if (text.data === data)
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
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
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

    const DEFAULT_DELAY = 300; // ms
    const DEFAULT_MIN_SWIPE_DISTANCE = 60; // px
    const DEFAULT_TOUCH_ACTION = 'none';

    // export type PointerType = 'mouse' | 'touch' | 'pen' | 'all';

    function addEventListener(node, event, handler) {
      node.addEventListener(event, handler);
      return () => node.removeEventListener(event, handler);
    }
    function removeEvent(event, activeEvents) {
      return activeEvents.filter(activeEvent => {
        return event.pointerId !== activeEvent.pointerId;
      });
    }
    function dispatch(node, gestureName, event, activeEvents, actionType) {
      node.dispatchEvent(new CustomEvent(`${gestureName}${actionType}`, {
        detail: {
          event,
          pointersCount: activeEvents.length,
          target: event.target
        }
      }));
    }
    function setPointerControls(gestureName, node, onMoveCallback, onDownCallback, onUpCallback, touchAction = DEFAULT_TOUCH_ACTION) {
      node.style.touchAction = touchAction;
      let activeEvents = [];
      function handlePointerdown(event) {
        activeEvents.push(event);
        dispatch(node, gestureName, event, activeEvents, 'down');
        onDownCallback?.(activeEvents, event);
        const pointerId = event.pointerId;
        function onup(e) {
          if (pointerId === e.pointerId) {
            activeEvents = removeEvent(e, activeEvents);
            if (!activeEvents.length) {
              removeEventHandlers();
            }
            dispatch(node, gestureName, e, activeEvents, 'up');
            onUpCallback?.(activeEvents, e);
          }
        }
        function removeEventHandlers() {
          removePointermoveHandler();
          removeLostpointercaptureHandler();
          removepointerupHandler();
          removepointerleaveHandler();
        }
        const removePointermoveHandler = addEventListener(node, 'pointermove', e => {
          activeEvents = activeEvents.map(activeEvent => {
            return e.pointerId === activeEvent.pointerId ? e : activeEvent;
          });
          dispatch(node, gestureName, e, activeEvents, 'move');
          onMoveCallback?.(activeEvents, e);
        });
        const removeLostpointercaptureHandler = addEventListener(node, 'lostpointercapture', e => {
          onup(e);
        });
        const removepointerupHandler = addEventListener(node, 'pointerup', e => {
          onup(e);
        });
        const removepointerleaveHandler = addEventListener(node, 'pointerleave', e => {
          activeEvents = [];
          removeEventHandlers();
          dispatch(node, gestureName, e, activeEvents, 'up');
          onUpCallback?.(activeEvents, e);
        });
      }
      const removePointerdownHandler = addEventListener(node, 'pointerdown', handlePointerdown);
      return {
        destroy: () => {
          removePointerdownHandler();
        }
      };
    }

    function swipe(node, inputParameters) {
      const parameters = {
        timeframe: DEFAULT_DELAY,
        minSwipeDistance: DEFAULT_MIN_SWIPE_DISTANCE,
        touchAction: DEFAULT_TOUCH_ACTION,
        composed: false,
        ...inputParameters
      };
      const gestureName = 'swipe';
      let startTime;
      let clientX;
      let clientY;
      let target;
      function onDown(activeEvents, event) {
        clientX = event.clientX;
        clientY = event.clientY;
        startTime = Date.now();
        if (activeEvents.length === 1) {
          target = event.target;
        }
      }
      function onUp(activeEvents, event) {
        if (event.type === 'pointerup' && activeEvents.length === 0 && Date.now() - startTime < parameters.timeframe) {
          const x = event.clientX - clientX;
          const y = event.clientY - clientY;
          const absX = Math.abs(x);
          const absY = Math.abs(y);
          let direction = null;
          if (absX >= 2 * absY && absX > parameters.minSwipeDistance) {
            // horizontal (by *2 we eliminate diagonal movements)
            direction = x > 0 ? 'right' : 'left';
          } else if (absY >= 2 * absX && absY > parameters.minSwipeDistance) {
            // vertical (by *2 we eliminate diagonal movements)
            direction = y > 0 ? 'bottom' : 'top';
          }
          if (direction) {
            node.dispatchEvent(new CustomEvent(gestureName, {
              detail: {
                direction,
                target
              }
            }));
          }
        }
      }
      if (parameters.composed) {
        return {
          onMove: null,
          onDown,
          onUp
        };
      }
      return setPointerControls(gestureName, node, null, onDown, onUp, parameters.touchAction);
    }

    /* src\Cell.svelte generated by Svelte v3.59.2 */

    const file$6 = "src\\Cell.svelte";

    function create_fragment$6(ctx) {
    	let td;
    	let t0;
    	let br;
    	let t1;
    	let td_class_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t0 = text(/*cell*/ ctx[0]);
    			br = element("br");
    			t1 = text(/*cell2*/ ctx[1]);
    			add_location(br, file$6, 11, 10, 302);
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*tdClass*/ ctx[2] + " " + /*selected*/ ctx[3]) + " svelte-10o8nm8"));
    			add_location(td, file$6, 10, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t0);
    			append_dev(td, br);
    			append_dev(td, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cell*/ 1) set_data_dev(t0, /*cell*/ ctx[0]);
    			if (dirty & /*cell2*/ 2) set_data_dev(t1, /*cell2*/ ctx[1]);

    			if (dirty & /*tdClass, selected*/ 12 && td_class_value !== (td_class_value = "" + (null_to_empty(/*tdClass*/ ctx[2] + " " + /*selected*/ ctx[3]) + " svelte-10o8nm8"))) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cell', slots, []);
    	let { cell = "" } = $$props;
    	let { cell2 = "" } = $$props;
    	let { tdClass = "" } = $$props;
    	let { selectedDay = "" } = $$props;
    	let selected = "";
    	const writable_props = ['cell', 'cell2', 'tdClass', 'selectedDay'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cell' in $$props) $$invalidate(0, cell = $$props.cell);
    		if ('cell2' in $$props) $$invalidate(1, cell2 = $$props.cell2);
    		if ('tdClass' in $$props) $$invalidate(2, tdClass = $$props.tdClass);
    		if ('selectedDay' in $$props) $$invalidate(4, selectedDay = $$props.selectedDay);
    	};

    	$$self.$capture_state = () => ({
    		cell,
    		cell2,
    		tdClass,
    		selectedDay,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('cell' in $$props) $$invalidate(0, cell = $$props.cell);
    		if ('cell2' in $$props) $$invalidate(1, cell2 = $$props.cell2);
    		if ('tdClass' in $$props) $$invalidate(2, tdClass = $$props.tdClass);
    		if ('selectedDay' in $$props) $$invalidate(4, selectedDay = $$props.selectedDay);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedDay*/ 16) {
    			$$invalidate(3, selected = selectedDay ? "selected" : "");
    		}
    	};

    	return [cell, cell2, tdClass, selected, selectedDay];
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			cell: 0,
    			cell2: 1,
    			tdClass: 2,
    			selectedDay: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get cell() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cell(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cell2() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cell2(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tdClass() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tdClass(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedDay() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedDay(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const log = writable([]);
    const showDate$1 = writable("");
    // export function addLog(newLine){
    //     log = [...log,newLine];
    // }
    // export function clearLog(){
    //     log = [];
    // }

    /* src\Header.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\Header.svelte";

    function create_fragment$5(ctx) {
    	let th;
    	let t0;
    	let br;
    	let t1;
    	let th_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(/*header*/ ctx[0]);
    			br = element("br");
    			t1 = text(/*header2*/ ctx[1]);
    			add_location(br, file$5, 17, 12, 364);
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*thClass*/ ctx[2]) + " svelte-q7fyvq"));
    			add_location(th, file$5, 16, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, br);
    			append_dev(th, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					th,
    					"click",
    					function () {
    						if (is_function(/*changeDate*/ ctx[4](/*event*/ ctx[3]))) /*changeDate*/ ctx[4](/*event*/ ctx[3]).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*header*/ 1) set_data_dev(t0, /*header*/ ctx[0]);
    			if (dirty & /*header2*/ 2) set_data_dev(t1, /*header2*/ ctx[1]);

    			if (dirty & /*thClass*/ 4 && th_class_value !== (th_class_value = "" + (null_to_empty(/*thClass*/ ctx[2]) + " svelte-q7fyvq"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			mounted = false;
    			dispose();
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
    	let $showDate;
    	validate_store(showDate$1, 'showDate');
    	component_subscribe($$self, showDate$1, $$value => $$invalidate(5, $showDate = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { header = "" } = $$props;
    	let { header2 = "" } = $$props;
    	let { thClass = "" } = $$props;
    	let { event = "" } = $$props;

    	// $showDate;
    	function changeDate(day) {
    		if (day !== "") set_store_value(showDate$1, $showDate = day, $showDate);
    	}

    	const writable_props = ['header', 'header2', 'thClass', 'event'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('header2' in $$props) $$invalidate(1, header2 = $$props.header2);
    		if ('thClass' in $$props) $$invalidate(2, thClass = $$props.thClass);
    		if ('event' in $$props) $$invalidate(3, event = $$props.event);
    	};

    	$$self.$capture_state = () => ({
    		header,
    		header2,
    		thClass,
    		showDate: showDate$1,
    		event,
    		changeDate,
    		$showDate
    	});

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('header2' in $$props) $$invalidate(1, header2 = $$props.header2);
    		if ('thClass' in $$props) $$invalidate(2, thClass = $$props.thClass);
    		if ('event' in $$props) $$invalidate(3, event = $$props.event);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, header2, thClass, event, changeDate];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			header: 0,
    			header2: 1,
    			thClass: 2,
    			event: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get header() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header2() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header2(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thClass() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thClass(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\TableList.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\TableList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (9:0) {#if workers.length > 0 }
    function create_if_block$1(ctx) {
    	let table;
    	let thead;
    	let tr;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let t1;
    	let tbody;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*week*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_2 = /*dates*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*body*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each1_else = null;

    	if (!each_value.length) {
    		each1_else = create_else_block_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			if_block.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each1_else) {
    				each1_else.c();
    			}

    			add_location(tr, file$4, 12, 12, 329);
    			add_location(thead, file$4, 11, 8, 308);
    			add_location(tbody, file$4, 29, 8, 952);
    			attr_dev(table, "class", "svelte-1klxd7g");
    			add_location(table, file$4, 9, 4, 265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			if_blocks[current_block_type_index].m(tr, null);
    			append_dev(tr, t0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(tr, null);
    				}
    			}

    			append_dev(table, t1);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			if (each1_else) {
    				each1_else.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dates, week*/ 10) {
    				each_value_2 = /*dates*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*body, week, workers*/ 13) {
    				each_value = /*body*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();

    				if (each_value.length) {
    					if (each1_else) {
    						each1_else.d(1);
    						each1_else = null;
    					}
    				} else if (!each1_else) {
    					each1_else = create_else_block_1(ctx);
    					each1_else.c();
    					each1_else.m(tbody, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (each1_else) each1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:0) {#if workers.length > 0 }",
    		ctx
    	});

    	return block;
    }

    // (17:16) {:else}
    function create_else_block_3(ctx) {
    	let header;
    	let current;

    	header = new Header({
    			props: { header: "Shift", thClass: "shift" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(17:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:16) {#if week}
    function create_if_block_4(ctx) {
    	let header0;
    	let t;
    	let header1;
    	let current;

    	header0 = new Header({
    			props: { header: "Shift" },
    			$$inline: true
    		});

    	header1 = new Header({
    			props: { header: "Name" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header0.$$.fragment);
    			t = space();
    			create_component(header1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(header1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header0.$$.fragment, local);
    			transition_in(header1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header0.$$.fragment, local);
    			transition_out(header1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(header1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(14:16) {#if week}",
    		ctx
    	});

    	return block;
    }

    // (24:20) {:else}
    function create_else_block_2(ctx) {
    	let header;
    	let current;

    	header = new Header({
    			props: {
    				header: /*day*/ ctx[10][0] + " " + /*day*/ ctx[10][1],
    				event: /*day*/ ctx[10][0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const header_changes = {};
    			if (dirty & /*dates*/ 2) header_changes.header = /*day*/ ctx[10][0] + " " + /*day*/ ctx[10][1];
    			if (dirty & /*dates*/ 2) header_changes.event = /*day*/ ctx[10][0];
    			header.$set(header_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(24:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:20) {#if week}
    function create_if_block_3(ctx) {
    	let header;
    	let current;

    	header = new Header({
    			props: {
    				header: /*day*/ ctx[10][0],
    				header2: /*day*/ ctx[10][1],
    				event: /*day*/ ctx[10][0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const header_changes = {};
    			if (dirty & /*dates*/ 2) header_changes.header = /*day*/ ctx[10][0];
    			if (dirty & /*dates*/ 2) header_changes.header2 = /*day*/ ctx[10][1];
    			if (dirty & /*dates*/ 2) header_changes.event = /*day*/ ctx[10][0];
    			header.$set(header_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(22:20) {#if week}",
    		ctx
    	});

    	return block;
    }

    // (21:16) {#each dates as day}
    function create_each_block_2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*week*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(21:16) {#each dates as day}",
    		ctx
    	});

    	return block;
    }

    // (50:12) {:else}
    function create_else_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Empty list");
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(50:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:20) {#if week}
    function create_if_block_2(ctx) {
    	let cell;
    	let current;

    	cell = new Cell({
    			props: {
    				cell: /*workers*/ ctx[2][/*i*/ ctx[6]],
    				tdClass: "worker"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cell_changes = {};
    			if (dirty & /*workers*/ 4) cell_changes.cell = /*workers*/ ctx[2][/*i*/ ctx[6]];
    			cell.$set(cell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(38:20) {#if week}",
    		ctx
    	});

    	return block;
    }

    // (45:24) {:else}
    function create_else_block(ctx) {
    	let cell;
    	let current;

    	cell = new Cell({
    			props: {
    				cell: /*cell*/ ctx[7].shift,
    				cell2: /*workers*/ ctx[2][/*i*/ ctx[6]],
    				tdClass: /*cell*/ ctx[7].class
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cell_changes = {};
    			if (dirty & /*body*/ 1) cell_changes.cell = /*cell*/ ctx[7].shift;
    			if (dirty & /*workers*/ 4) cell_changes.cell2 = /*workers*/ ctx[2][/*i*/ ctx[6]];
    			if (dirty & /*body*/ 1) cell_changes.tdClass = /*cell*/ ctx[7].class;
    			cell.$set(cell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(45:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:24) {#if week}
    function create_if_block_1(ctx) {
    	let cell;
    	let current;

    	cell = new Cell({
    			props: {
    				cell: /*cell*/ ctx[7].shift,
    				tdClass: /*cell*/ ctx[7].class,
    				selectedDay: /*cell*/ ctx[7].selected
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cell_changes = {};
    			if (dirty & /*body*/ 1) cell_changes.cell = /*cell*/ ctx[7].shift;
    			if (dirty & /*body*/ 1) cell_changes.tdClass = /*cell*/ ctx[7].class;
    			if (dirty & /*body*/ 1) cell_changes.selectedDay = /*cell*/ ctx[7].selected;
    			cell.$set(cell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(43:24) {#if week}",
    		ctx
    	});

    	return block;
    }

    // (42:20) {#each row as cell}
    function create_each_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*week*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(42:20) {#each row as cell}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#each body as row,i}
    function create_each_block$1(ctx) {
    	let tr;
    	let cell;
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	cell = new Cell({
    			props: { cell: /*i*/ ctx[6] + 1, tdClass: "shift" },
    			$$inline: true
    		});

    	let if_block = /*week*/ ctx[3] && create_if_block_2(ctx);
    	let each_value_1 = /*row*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			create_component(cell.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(tr, file$4, 31, 16, 1012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			mount_component(cell, tr, null);
    			append_dev(tr, t0);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tr, null);
    				}
    			}

    			append_dev(tr, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*week*/ ctx[3]) if_block.p(ctx, dirty);

    			if (dirty & /*body, week, workers*/ 13) {
    				each_value_1 = /*row*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			transition_in(if_block);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(cell);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:12) {#each body as row,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*workers*/ ctx[2].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*workers*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*workers*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableList', slots, []);
    	let { body } = $$props;
    	let { dates } = $$props;
    	let { workers } = $$props;
    	let week = dates.length > 1 ? true : false; // false mean 1 day

    	$$self.$$.on_mount.push(function () {
    		if (body === undefined && !('body' in $$props || $$self.$$.bound[$$self.$$.props['body']])) {
    			console.warn("<TableList> was created without expected prop 'body'");
    		}

    		if (dates === undefined && !('dates' in $$props || $$self.$$.bound[$$self.$$.props['dates']])) {
    			console.warn("<TableList> was created without expected prop 'dates'");
    		}

    		if (workers === undefined && !('workers' in $$props || $$self.$$.bound[$$self.$$.props['workers']])) {
    			console.warn("<TableList> was created without expected prop 'workers'");
    		}
    	});

    	const writable_props = ['body', 'dates', 'workers'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('body' in $$props) $$invalidate(0, body = $$props.body);
    		if ('dates' in $$props) $$invalidate(1, dates = $$props.dates);
    		if ('workers' in $$props) $$invalidate(2, workers = $$props.workers);
    	};

    	$$self.$capture_state = () => ({ body, dates, workers, Cell, Header, week });

    	$$self.$inject_state = $$props => {
    		if ('body' in $$props) $$invalidate(0, body = $$props.body);
    		if ('dates' in $$props) $$invalidate(1, dates = $$props.dates);
    		if ('workers' in $$props) $$invalidate(2, workers = $$props.workers);
    		if ('week' in $$props) $$invalidate(3, week = $$props.week);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [body, dates, workers, week];
    }

    class TableList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { body: 0, dates: 1, workers: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableList",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get body() {
    		throw new Error("<TableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<TableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dates() {
    		throw new Error("<TableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dates(value) {
    		throw new Error("<TableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get workers() {
    		throw new Error("<TableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set workers(value) {
    		throw new Error("<TableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // helper functions
    function dateToString$1(date){
        return  date.toISOString().slice(0,10);
    }

    function changeShowDate(date,n){
            let day = new Date(date);
            day.setDate(day.getDate()+n);
            // console.log(date);
            // console.log(dateToString(day));
            return dateToString$1(day);
    }

    // date store 
    function createDate() {
    	const { subscribe, set, update } = writable("");



    	return {
    		subscribe, set, update,
    		nextDay: ()=>update((date)=>changeShowDate(date,1)),
    		prevDay: ()=>update((date)=>changeShowDate(date,-1)),
    		nextWeek: ()=>update((date)=>changeShowDate(date,7)),
    		prevWeek: ()=>update((date)=>changeShowDate(date,-7)),
    		reset: () => set(0),
        }
    }

    const showDate = createDate();

    /* src\NextPrev.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\NextPrev.svelte";

    function create_fragment$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = `${prevWeek}`;
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = `${prev}`;
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = `${next}`;
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = `${nextWeek}`;
    			attr_dev(button0, "class", "left svelte-ff5gnk");
    			add_location(button0, file$3, 8, 0, 180);
    			attr_dev(button1, "class", "svelte-ff5gnk");
    			add_location(button1, file$3, 9, 0, 257);
    			attr_dev(button2, "class", "svelte-ff5gnk");
    			add_location(button2, file$3, 10, 0, 316);
    			attr_dev(button3, "class", "right svelte-ff5gnk");
    			add_location(button3, file$3, 11, 0, 375);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button3, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[2], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button3);
    			mounted = false;
    			run_all(dispose);
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

    const next = ">>";
    const prev = "<<";
    const nextWeek = ">>>>>  ";
    const prevWeek = "  <<<<<";

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NextPrev', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NextPrev> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => showDate.prevWeek();
    	const click_handler_1 = () => showDate.prevDay();
    	const click_handler_2 = () => showDate.nextDay();
    	const click_handler_3 = () => showDate.nextWeek();
    	$$self.$capture_state = () => ({ showDate, next, prev, nextWeek, prevWeek });
    	return [click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class NextPrev extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NextPrev",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Log.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$2 = "src\\Log.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (13:0) {#if visible}
    function create_if_block(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let each_value = /*$log*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "log");
    			attr_dev(div, "class", "svelte-rxonch");
    			add_location(div, file$2, 13, 0, 292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false, false),
    					listen_dev(div, "keypress", /*keypress_handler*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$log*/ 2) {
    				each_value = /*$log*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#each $log as line}
    function create_each_block(ctx) {
    	let div;
    	let t_value = /*line*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$2, 15, 8, 405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$log*/ 2 && t_value !== (t_value = /*line*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:4) {#each $log as line}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*visible*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let $log;
    	validate_store(log, 'log');
    	component_subscribe($$self, log, $$value => $$invalidate(1, $log = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Log', slots, []);
    	console.log($log);
    	let { logMessage } = $$props;
    	let visible = false;

    	function newMessage(message) {
    		set_store_value(log, $log = [...$log, message], $log);
    		$$invalidate(0, visible = true);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (logMessage === undefined && !('logMessage' in $$props || $$self.$$.bound[$$self.$$.props['logMessage']])) {
    			console_1.warn("<Log> was created without expected prop 'logMessage'");
    		}
    	});

    	const writable_props = ['logMessage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Log> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, visible = false);
    	const keypress_handler = () => $$invalidate(0, visible = false);

    	$$self.$$set = $$props => {
    		if ('logMessage' in $$props) $$invalidate(2, logMessage = $$props.logMessage);
    	};

    	$$self.$capture_state = () => ({
    		log,
    		logMessage,
    		visible,
    		newMessage,
    		$log
    	});

    	$$self.$inject_state = $$props => {
    		if ('logMessage' in $$props) $$invalidate(2, logMessage = $$props.logMessage);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*logMessage*/ 4) {
    			newMessage(logMessage);
    		}
    	};

    	return [visible, $log, logMessage, click_handler, keypress_handler];
    }

    class Log extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { logMessage: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Log",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get logMessage() {
    		throw new Error("<Log>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logMessage(value) {
    		throw new Error("<Log>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Bottom.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\Bottom.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Made using svelte by KD version ");
    			t1 = text(/*version*/ ctx[0]);
    			attr_dev(div, "id", "bottom");
    			add_location(div, file$1, 4, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*version*/ 1) set_data_dev(t1, /*version*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots('Bottom', slots, []);
    	let { version = "0.0" } = $$props;
    	const writable_props = ['version'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bottom> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({ version });

    	$$self.$inject_state = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [version];
    }

    class Bottom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { version: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bottom",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get version() {
    		throw new Error("<Bottom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<Bottom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let div1;
    	let nextprev;
    	let t7;
    	let div5;
    	let div3;
    	let tablelist0;
    	let t8;
    	let div4;
    	let tablelist1;
    	let t9;
    	let log_1;
    	let updating_logMessage;
    	let t10;
    	let bottom;
    	let current;
    	let mounted;
    	let dispose;
    	nextprev = new NextPrev({ $$inline: true });

    	tablelist0 = new TableList({
    			props: {
    				body: /*selectedDayPattern*/ ctx[6],
    				dates: /*selectedDay*/ ctx[5],
    				workers: /*selectedWeekWorkers*/ ctx[7]
    			},
    			$$inline: true
    		});

    	tablelist1 = new TableList({
    			props: {
    				body: /*weekPattern*/ ctx[1],
    				dates: /*showWeek*/ ctx[8],
    				workers: /*selectedWeekWorkers*/ ctx[7]
    			},
    			$$inline: true
    		});

    	function log_1_logMessage_binding(value) {
    		/*log_1_logMessage_binding*/ ctx[17](value);
    	}

    	let log_1_props = {};

    	if (/*logMessage*/ ctx[4] !== void 0) {
    		log_1_props.logMessage = /*logMessage*/ ctx[4];
    	}

    	log_1 = new Log({ props: log_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(log_1, 'logMessage', log_1_logMessage_binding));
    	bottom = new Bottom({ props: { version }, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Day";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Switch Pattern";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Switch Day Name";
    			t6 = space();
    			div1 = element("div");
    			create_component(nextprev.$$.fragment);
    			t7 = space();
    			div5 = element("div");
    			div3 = element("div");
    			create_component(tablelist0.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			create_component(tablelist1.$$.fragment);
    			t9 = space();
    			create_component(log_1.$$.fragment);
    			t10 = space();
    			create_component(bottom.$$.fragment);
    			attr_dev(label, "for", "targetDay");
    			add_location(label, file, 195, 3, 5344);
    			attr_dev(input, "type", "date");
    			attr_dev(input, "id", "targetDay");
    			attr_dev(input, "name", "targetDay");
    			add_location(input, file, 196, 3, 5384);
    			add_location(button0, file, 197, 3, 5465);
    			add_location(button1, file, 198, 3, 5562);
    			attr_dev(div0, "id", "datePanel");
    			attr_dev(div0, "class", "svelte-284xyn");
    			add_location(div0, file, 194, 2, 5319);
    			attr_dev(div1, "id", "nextPrev");
    			attr_dev(div1, "class", "svelte-284xyn");
    			add_location(div1, file, 200, 2, 5665);
    			attr_dev(div2, "id", "tools");
    			attr_dev(div2, "class", "tools svelte-284xyn");
    			add_location(div2, file, 193, 1, 5285);
    			attr_dev(main, "class", "svelte-284xyn");
    			add_location(main, file, 192, 0, 5276);
    			attr_dev(div3, "id", "dayPanel");
    			set_style(div3, "flex", "1");
    			attr_dev(div3, "class", "center svelte-284xyn");
    			add_location(div3, file, 206, 2, 5740);
    			attr_dev(div4, "id", "weekPanel");
    			set_style(div4, "flex", "4");
    			attr_dev(div4, "class", "center svelte-284xyn");
    			add_location(div4, file, 210, 2, 5997);
    			attr_dev(div5, "class", "svelte-284xyn");
    			add_location(div5, file, 205, 0, 5731);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, label);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*$showDate*/ ctx[3]);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			mount_component(nextprev, div1, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			mount_component(tablelist0, div3, null);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			mount_component(tablelist1, div4, null);
    			insert_dev(target, t9, anchor);
    			mount_component(log_1, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(bottom, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[14]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[15], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[16], false, false, false, false),
    					action_destroyer(swipe.call(null, div3, {
    						timeframe: 300,
    						minSwipeDistance: 30,
    						touchAction: 'pan-x'
    					})),
    					listen_dev(div3, "swipe", /*swipeDay*/ ctx[9], false, false, false, false),
    					action_destroyer(swipe.call(null, div4, {
    						timeframe: 300,
    						minSwipeDistance: 100,
    						touchAction: 'pan-x'
    					})),
    					listen_dev(div4, "swipe", /*swipeWeek*/ ctx[10], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$showDate*/ 8) {
    				set_input_value(input, /*$showDate*/ ctx[3]);
    			}

    			const tablelist0_changes = {};
    			if (dirty & /*selectedDayPattern*/ 64) tablelist0_changes.body = /*selectedDayPattern*/ ctx[6];
    			if (dirty & /*selectedDay*/ 32) tablelist0_changes.dates = /*selectedDay*/ ctx[5];
    			if (dirty & /*selectedWeekWorkers*/ 128) tablelist0_changes.workers = /*selectedWeekWorkers*/ ctx[7];
    			tablelist0.$set(tablelist0_changes);
    			const tablelist1_changes = {};
    			if (dirty & /*weekPattern*/ 2) tablelist1_changes.body = /*weekPattern*/ ctx[1];
    			if (dirty & /*showWeek*/ 256) tablelist1_changes.dates = /*showWeek*/ ctx[8];
    			if (dirty & /*selectedWeekWorkers*/ 128) tablelist1_changes.workers = /*selectedWeekWorkers*/ ctx[7];
    			tablelist1.$set(tablelist1_changes);
    			const log_1_changes = {};

    			if (!updating_logMessage && dirty & /*logMessage*/ 16) {
    				updating_logMessage = true;
    				log_1_changes.logMessage = /*logMessage*/ ctx[4];
    				add_flush_callback(() => updating_logMessage = false);
    			}

    			log_1.$set(log_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nextprev.$$.fragment, local);
    			transition_in(tablelist0.$$.fragment, local);
    			transition_in(tablelist1.$$.fragment, local);
    			transition_in(log_1.$$.fragment, local);
    			transition_in(bottom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nextprev.$$.fragment, local);
    			transition_out(tablelist0.$$.fragment, local);
    			transition_out(tablelist1.$$.fragment, local);
    			transition_out(log_1.$$.fragment, local);
    			transition_out(bottom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nextprev);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div5);
    			destroy_component(tablelist0);
    			destroy_component(tablelist1);
    			if (detaching) detach_dev(t9);
    			destroy_component(log_1, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(bottom, detaching);
    			mounted = false;
    			run_all(dispose);
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

    const version = "1.1.1";
    const startingDate = "2023-07-16";

    // funciton calculates week based on given date and number of weeks
    function calcWeekNo(day, noOfWeeks) {
    	const start = new Date(startingDate);
    	const day0 = new Date(day);
    	let diff = day0.getTime() - start.getTime();

    	// $log += diff;
    	let days = diff / (1000 * 60 * 60 * 24);

    	// $log += " days "+days;
    	// console.log(days);
    	let weeks = Math.floor(days / 7);

    	// $log += " weeks "+weeks;
    	// console.log(weeks);
    	let weekNo = weeks % noOfWeeks;

    	// $log += " week no "+weekNo;
    	return weekNo;
    }

    // dates
    function dateToString(date) {
    	return date.toISOString().slice(0, 10);
    }

    function instance($$self, $$props, $$invalidate) {
    	let showWeek;
    	let selectedWeekWorkers;
    	let selectedDayPattern;
    	let selectedDay;
    	let $showDate;
    	let $log;
    	validate_store(showDate, 'showDate');
    	component_subscribe($$self, showDate, $$value => $$invalidate(3, $showDate = $$value));
    	validate_store(log, 'log');
    	component_subscribe($$self, log, $$value => $$invalidate(18, $log = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { workers } = $$props;
    	let { shiftKey } = $$props;
    	let { shiftsWeek } = $$props;
    	let logMessage = "";

    	function clearLog() {
    		set_store_value(log, $log = [], $log);
    	}

    	const weekDays = [
    		["Sun", "Sunday"],
    		["Mon", "Monday"],
    		["Tue", "Tuesday"],
    		["Wed", "Wednesday"],
    		["Thu", "Thursday"],
    		["Fri", "Friday"],
    		["Sat", "Saturday"]
    	];

    	// I need a structure? or 3
    	// date/s 
    	// workers in order
    	// shiftWeek
    	var patternSelector = 0;

    	// array of objects with information about week shift
    	function createWeekPattern(patternSelector = 0) {
    		return shiftsWeek[patternSelector].map(shift => shift.map(shiftDay => createDay(shiftDay)));
    	}

    	function createDay(shiftDay, selected = false) {
    		// let day =
    		return {
    			class: shiftDay,
    			shift: shiftKey[patternSelector][shiftDay],
    			selected
    		};
    	}

    	function createSelectedDayPattern(day, weekPattern) {
    		const selectedDay = new Date(day);
    		const dayNo = selectedDay.getDay();
    		return weekPattern.map(shift => [shift[dayNo]]);
    	}

    	let weekPattern = createWeekPattern(patternSelector);

    	// object with table of workers that returns array 
    	// for a given week
    	let weekdWorkers = {
    		workers,
    		Pattern(weekNo) {
    			return workers.slice(weekNo, workers.length).concat(workers.slice(0, weekNo));
    		},
    		CalculateWeek(date) {
    			let weekNo = this.workers.length - calcWeekNo(date, this.workers.length);
    			return this.Pattern(weekNo);
    		}
    	};

    	let longDayName = true; // set to false for short name 

    	function calculateWeekDates(day, longDayName) {
    		let week = [];

    		// date and name of weekday
    		let dayDate = new Date(day);

    		const dayOfWeek = dayDate.getDay();
    		const longName = longDayName ? 1 : 0;

    		// calculate sunday using day0 and dayOfWeek
    		let sunday = new Date(day.concat("T10:00:00Z"));

    		// for change of time to ot go over to previous day
    		sunday.setDate(sunday.getDate() - dayOfWeek);

    		// addLog("Suday: "+sunday.getDay()+" : "+sunday.getDate());
    		let dateForDay = new Date(dateToString(sunday));

    		// $log += "date "+dateForDay;
    		// $log += " day no: "+dateForDay.getDay()+ " <<>> ";
    		for (let i = 0; i < 7; i++) {
    			if (dateForDay.getDay() == i) {
    				week[i] = [dateToString(dateForDay), weekDays[dateForDay.getDay()][longName]];
    			} else {
    				week[i] = ["ERROR", "something went wrong"];
    			}

    			dateForDay.setDate(dateForDay.getDate() + 1);
    		}

    		return week;
    	}

    	function createSelectedDay(day, longDayName) {
    		const selectedDay = new Date(day);
    		const longName = longDayName ? 1 : 0;

    		// console.log(day);
    		return [[day, weekDays[selectedDay.getDay()][longName]]];
    	}

    	function selectDayInWeekPattern(day) {
    		// change all selected to false
    		// and for one day change selected to true
    		weekPattern.forEach(shift => shift.forEach(day => day.selected = false));

    		// adding selected first:
    		const sDay = new Date(day);

    		const dayNo = sDay.getDay(); // 0 -6

    		//$log += weekPattern[1][dayNo].selected;
    		weekPattern.forEach(shift => shift[dayNo].selected = true);
    	} // console.log(weekPattern);

    	const today = new Date();

    	// let showDate = dateToString(today);
    	set_store_value(showDate, $showDate = dateToString(today), $showDate);

    	// console.log("sel day "+selectedDay);
    	let targetDate = "";

    	// Swipes for next prev day
    	function swipeDay(event) {
    		direction = event.detail.direction;
    		alert("day");

    		if (direction == "left") {
    			showDate.nextDay();
    		} else if (direction == "right") {
    			showDate.prevDay();
    		}
    	}

    	function swipeWeek(event) {
    		direction = event.detail.direction;
    		alert("week");

    		if (direction == "left") {
    			showDate.nextWeek();
    		} else if (direction == "right") {
    			showDate.prevWeek();
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (workers === undefined && !('workers' in $$props || $$self.$$.bound[$$self.$$.props['workers']])) {
    			console.warn("<App> was created without expected prop 'workers'");
    		}

    		if (shiftKey === undefined && !('shiftKey' in $$props || $$self.$$.bound[$$self.$$.props['shiftKey']])) {
    			console.warn("<App> was created without expected prop 'shiftKey'");
    		}

    		if (shiftsWeek === undefined && !('shiftsWeek' in $$props || $$self.$$.bound[$$self.$$.props['shiftsWeek']])) {
    			console.warn("<App> was created without expected prop 'shiftsWeek'");
    		}
    	});

    	const writable_props = ['workers', 'shiftKey', 'shiftsWeek'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$showDate = this.value;
    		showDate.set($showDate);
    	}

    	const click_handler = () => {
    		$$invalidate(0, patternSelector = patternSelector == 0 ? 1 : 0);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(2, longDayName = longDayName ? false : true);
    	};

    	function log_1_logMessage_binding(value) {
    		logMessage = value;
    		$$invalidate(4, logMessage);
    	}

    	$$self.$$set = $$props => {
    		if ('workers' in $$props) $$invalidate(11, workers = $$props.workers);
    		if ('shiftKey' in $$props) $$invalidate(12, shiftKey = $$props.shiftKey);
    		if ('shiftsWeek' in $$props) $$invalidate(13, shiftsWeek = $$props.shiftsWeek);
    	};

    	$$self.$capture_state = () => ({
    		workers,
    		shiftKey,
    		shiftsWeek,
    		swipe,
    		TableList,
    		NextPrev,
    		Log,
    		log,
    		showDate,
    		attr_dev,
    		Bottom,
    		version,
    		logMessage,
    		clearLog,
    		weekDays,
    		startingDate,
    		patternSelector,
    		createWeekPattern,
    		createDay,
    		createSelectedDayPattern,
    		weekPattern,
    		calcWeekNo,
    		weekdWorkers,
    		dateToString,
    		longDayName,
    		calculateWeekDates,
    		createSelectedDay,
    		selectDayInWeekPattern,
    		today,
    		targetDate,
    		swipeDay,
    		swipeWeek,
    		selectedDay,
    		selectedDayPattern,
    		selectedWeekWorkers,
    		showWeek,
    		$showDate,
    		$log
    	});

    	$$self.$inject_state = $$props => {
    		if ('workers' in $$props) $$invalidate(11, workers = $$props.workers);
    		if ('shiftKey' in $$props) $$invalidate(12, shiftKey = $$props.shiftKey);
    		if ('shiftsWeek' in $$props) $$invalidate(13, shiftsWeek = $$props.shiftsWeek);
    		if ('logMessage' in $$props) $$invalidate(4, logMessage = $$props.logMessage);
    		if ('patternSelector' in $$props) $$invalidate(0, patternSelector = $$props.patternSelector);
    		if ('weekPattern' in $$props) $$invalidate(1, weekPattern = $$props.weekPattern);
    		if ('weekdWorkers' in $$props) $$invalidate(24, weekdWorkers = $$props.weekdWorkers);
    		if ('longDayName' in $$props) $$invalidate(2, longDayName = $$props.longDayName);
    		if ('targetDate' in $$props) targetDate = $$props.targetDate;
    		if ('selectedDay' in $$props) $$invalidate(5, selectedDay = $$props.selectedDay);
    		if ('selectedDayPattern' in $$props) $$invalidate(6, selectedDayPattern = $$props.selectedDayPattern);
    		if ('selectedWeekWorkers' in $$props) $$invalidate(7, selectedWeekWorkers = $$props.selectedWeekWorkers);
    		if ('showWeek' in $$props) $$invalidate(8, showWeek = $$props.showWeek);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*patternSelector*/ 1) {
    			{
    				$$invalidate(1, weekPattern = createWeekPattern(patternSelector));
    			} // createDay($showDate);
    		}

    		if ($$self.$$.dirty & /*$showDate, longDayName*/ 12) {
    			$$invalidate(8, showWeek = calculateWeekDates($showDate, longDayName));
    		}

    		if ($$self.$$.dirty & /*$showDate*/ 8) {
    			$$invalidate(7, selectedWeekWorkers = weekdWorkers.CalculateWeek($showDate));
    		}

    		if ($$self.$$.dirty & /*$showDate, weekPattern*/ 10) {
    			{
    				selectDayInWeekPattern($showDate);
    				(($$invalidate(1, weekPattern), $$invalidate(0, patternSelector)), $$invalidate(3, $showDate));
    			}
    		}

    		if ($$self.$$.dirty & /*$showDate, weekPattern*/ 10) {
    			$$invalidate(6, selectedDayPattern = createSelectedDayPattern($showDate, weekPattern));
    		}

    		if ($$self.$$.dirty & /*$showDate, longDayName*/ 12) {
    			$$invalidate(5, selectedDay = createSelectedDay($showDate, longDayName));
    		}
    	};

    	return [
    		patternSelector,
    		weekPattern,
    		longDayName,
    		$showDate,
    		logMessage,
    		selectedDay,
    		selectedDayPattern,
    		selectedWeekWorkers,
    		showWeek,
    		swipeDay,
    		swipeWeek,
    		workers,
    		shiftKey,
    		shiftsWeek,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		log_1_logMessage_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			workers: 11,
    			shiftKey: 12,
    			shiftsWeek: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get workers() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set workers(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shiftKey() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shiftKey(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shiftsWeek() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shiftsWeek(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		workers: ["B.C.","G.O`D","J.N","W.C","P.G","A.C","K.D","M.C","J.W"],
    		shiftKey: [
    			{
    				"R": "Rest Day",
    				"L1": "18.00-4.00",
    				"L2": "18.00-2.00",
    				"L3": "17.00-2.00",
    				"L4": "19.00-4.00",
    				"L5": "16.00-2.00",
    				"L6": "17.00-3.00",
    				"D1": "9.00-18.00",
    				"D2": "7.00-16.00",
    				"D3": "8.00-17.00",
    				"P1": "Priority 1",
    				"P2": "Priority 2",
    				"P3": "Priority 3",
    				"P4": "Priority 4",
    				"P5": "Rest Day: <br>P2 drop days"
    			},
    			{
    				"R": "Rest Day",
    				"L1": "18.00-4.00",
    				"L2": "18.00-2.00",
    				"L3": "16.00-2.00",
    				"L4": "19.00-4.00",
    				"L5": "16.00-4.00",
    				"L6": "17.00-3.00",
    				"L7": "20.00-4.00",
    				"D1": "8.00-16.00",
    				"D2": "6.00-16.00",
    				"D3": "8.00-14.00",
    				"D4": "6.00-13.00",
    				"D5": "6.00-15.00",
    				"D6": "6.00-14.00",
    				"P1": "Priority 1",
    				"P2": "Priority 2",
    				"P3": "Priority 3",
    				"P4": "Priority 4",
    				"P5": "Priority 5"				
    			}
    		]
    			,
    		shiftsWeek : [

    			[
    				["R", "D1", "L1", "L1", "L2", "P3", "P1"],
    				["P1", "R", "D1", "D1", "L1", "L2", "P4"],
    				["P2", "P1", "L1", "L4", "R", "D1", "L1"],
    				["L1", "L1", "P3", "P2", "P1", "L1", "L1"],
    				["L3", "L2", "P1", "R", "D1", "D2", "D1"],
    				["D3", "P2", "L4", "L1", "L4", "P2", "P2"],
    				["R", "D2", "D2", "D2", "D2", "P1", "P3"],
    				["P3", "L1", "L2", "L2", "R", "L1", "L4"],
    				["L1", "L4", "P2", "P1", "L1", "L4", "R"]
    			],
    			[
    				["R", "D1", "L3", "L1", "L3", "P1", "P4"],
    				["P1", "P2", "D1", "D2", "L1", "L1", "P5"],
    				["P2", "P1", "L6", "L6", "R", "D4", "L5"],
    				["L1", "L1", "P2", "P2", "P1", "L6", "L1"],
    				["L1", "L6", "P1", "R", "D5", "P2", "L1"],
    				["L5", "R", "D4", "D3", "D1", "L7", "P2"],
    				["P3", "D6", "L1", "L3", "L1", "P3", "P1"],
    				["P4", "L7", "L7", "L7", "P2", "D1", "D1"],
    				["D1", "L3", "P3", "P1", "L6", "L3", "P3"]
    			]

    		]
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
