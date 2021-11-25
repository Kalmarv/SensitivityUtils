
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
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

    /* src\Home.svelte generated by Svelte v3.44.2 */

    const file$5 = "src\\Home.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let ul4;
    	let li0;
    	let t5;
    	let ul0;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let ul1;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let ul2;
    	let li5;
    	let t14;
    	let br;
    	let t15;
    	let t16;
    	let li6;
    	let t18;
    	let ul3;
    	let li7;
    	let t20;
    	let div0;
    	let h2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Sensitivity Tools";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Wrote some tools you may find useful if you're a nolifer in Kovaak's/Aimlab";
    			t3 = space();
    			ul4 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Random Sensitivity";
    			t5 = space();
    			ul0 = element("ul");
    			li1 = element("li");
    			li1.textContent = "Generates a random sensitivty for your selected game, can specify a range.";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Convert: Distance";
    			t9 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Converts cm/360 between two games or DPIs";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "Convert: Focal Length";
    			t13 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			t14 = text("Converts sensitivity between two games using focal length scaling,");
    			br = element("br");
    			t15 = text("\r\n                which is the superior way");
    			t16 = space();
    			li6 = element("li");
    			li6.textContent = "Convert: FOV";
    			t18 = space();
    			ul3 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Helper calculator for focal length scaling";
    			t20 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Made by Kalmarv";
    			add_location(h1, file$5, 1, 4, 28);
    			add_location(p, file$5, 2, 4, 60);
    			add_location(li0, file$5, 4, 8, 162);
    			add_location(li1, file$5, 6, 12, 217);
    			add_location(ul0, file$5, 5, 8, 199);
    			add_location(li2, file$5, 8, 8, 325);
    			add_location(li3, file$5, 10, 12, 379);
    			add_location(ul1, file$5, 9, 8, 361);
    			add_location(li4, file$5, 12, 8, 454);
    			add_location(br, file$5, 14, 82, 582);
    			add_location(li5, file$5, 14, 12, 512);
    			add_location(ul2, file$5, 13, 8, 494);
    			add_location(li6, file$5, 17, 8, 659);
    			add_location(li7, file$5, 19, 12, 708);
    			add_location(ul3, file$5, 18, 8, 690);
    			add_location(ul4, file$5, 3, 4, 148);
    			add_location(h2, file$5, 24, 8, 820);
    			attr_dev(div0, "id", "footer");
    			add_location(div0, file$5, 23, 4, 793);
    			attr_dev(div1, "id", "HomeContent");
    			attr_dev(div1, "class", "svelte-uma6qo");
    			add_location(div1, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, ul4);
    			append_dev(ul4, li0);
    			append_dev(ul4, t5);
    			append_dev(ul4, ul0);
    			append_dev(ul0, li1);
    			append_dev(ul4, t7);
    			append_dev(ul4, li2);
    			append_dev(ul4, t9);
    			append_dev(ul4, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul4, t11);
    			append_dev(ul4, li4);
    			append_dev(ul4, t13);
    			append_dev(ul4, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, t14);
    			append_dev(li5, br);
    			append_dev(li5, t15);
    			append_dev(ul4, t16);
    			append_dev(ul4, li6);
    			append_dev(ul4, t18);
    			append_dev(ul4, ul3);
    			append_dev(ul3, li7);
    			append_dev(div1, t20);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\Random.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1$1 } = globals;
    const file$4 = "src\\Random.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (56:12) {#if !custom.yaw}
    function create_if_block_1$1(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$4, 56, 12, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12]),
    					listen_dev(select, "change", /*setGame*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 256) {
    				each_value = /*items*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*value, items*/ 257) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(56:12) {#if !custom.yaw}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#each items as item}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[20] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*item*/ ctx[20];
    			option.value = option.__value;
    			add_location(option, file$4, 58, 16, 1400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(58:16) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (63:12) {#if custom.yaw}
    function create_if_block$1(ctx) {
    	let p;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Yaw:";
    			t1 = space();
    			input = element("input");
    			add_location(p, file$4, 63, 16, 1551);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "size", "2");
    			add_location(input, file$4, 64, 16, 1580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*yaw*/ ctx[5]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yaw*/ 32 && input.value !== /*yaw*/ ctx[5]) {
    				set_input_value(input, /*yaw*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:12) {#if custom.yaw}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div0;
    	let h1;
    	let t1;
    	let div6;
    	let div2;
    	let h3;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let button0;
    	let t7;
    	let div3;
    	let p0;
    	let t9;
    	let input0;
    	let t10;
    	let p1;
    	let t12;
    	let input1;
    	let t13;
    	let p2;
    	let t15;
    	let input2;
    	let t16;
    	let div4;
    	let button1;
    	let t18;
    	let div5;
    	let p3;
    	let t19;
    	let t20;
    	let t21;
    	let p4;
    	let t22;
    	let t23;
    	let t24;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*custom*/ ctx[7].yaw && create_if_block_1$1(ctx);
    	let if_block1 = /*custom*/ ctx[7].yaw && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Random Sensitivity Generator";
    			t1 = space();
    			div6 = element("div");
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Generate Random Sensitivity for:";
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Use Custom Yaw";
    			t7 = space();
    			div3 = element("div");
    			p0 = element("p");
    			p0.textContent = "DPI:";
    			t9 = space();
    			input0 = element("input");
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "Min:";
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			p2 = element("p");
    			p2.textContent = "Max:";
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			div4 = element("div");
    			button1 = element("button");
    			button1.textContent = "Generate Sensitivity";
    			t18 = space();
    			div5 = element("div");
    			p3 = element("p");
    			t19 = text("Your sensitivity is: ");
    			t20 = text(/*sens*/ ctx[1]);
    			t21 = space();
    			p4 = element("p");
    			t22 = text("(");
    			t23 = text(/*randNumRounded*/ ctx[6]);
    			t24 = text(" cm/360)");
    			add_location(h1, file$4, 50, 8, 1129);
    			add_location(div0, file$4, 49, 4, 1114);
    			add_location(h3, file$4, 54, 12, 1218);
    			add_location(button0, file$4, 67, 16, 1683);
    			add_location(div1, file$4, 66, 12, 1660);
    			add_location(div2, file$4, 53, 8, 1199);
    			add_location(p0, file$4, 71, 12, 1816);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "size", "1");
    			add_location(input0, file$4, 72, 12, 1841);
    			add_location(p1, file$4, 73, 12, 1902);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "size", "1");
    			add_location(input1, file$4, 74, 12, 1927);
    			add_location(p2, file$4, 75, 12, 1990);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "size", "1");
    			add_location(input2, file$4, 76, 12, 2015);
    			add_location(div3, file$4, 70, 8, 1797);
    			add_location(button1, file$4, 79, 12, 2110);
    			add_location(div4, file$4, 78, 8, 2091);
    			add_location(p3, file$4, 82, 12, 2211);
    			add_location(p4, file$4, 83, 12, 2259);
    			add_location(div5, file$4, 81, 8, 2192);
    			add_location(div6, file$4, 52, 4, 1184);
    			add_location(main, file$4, 48, 0, 1102);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(main, t1);
    			append_dev(main, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h3);
    			append_dev(div2, t3);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			append_dev(div3, p0);
    			append_dev(div3, t9);
    			append_dev(div3, input0);
    			set_input_value(input0, /*dpi*/ ctx[2]);
    			append_dev(div3, t10);
    			append_dev(div3, p1);
    			append_dev(div3, t12);
    			append_dev(div3, input1);
    			set_input_value(input1, /*lower*/ ctx[3]);
    			append_dev(div3, t13);
    			append_dev(div3, p2);
    			append_dev(div3, t15);
    			append_dev(div3, input2);
    			set_input_value(input2, /*higher*/ ctx[4]);
    			append_dev(div6, t16);
    			append_dev(div6, div4);
    			append_dev(div4, button1);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, p3);
    			append_dev(p3, t19);
    			append_dev(p3, t20);
    			append_dev(div5, t21);
    			append_dev(div5, p4);
    			append_dev(p4, t22);
    			append_dev(p4, t23);
    			append_dev(p4, t24);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle*/ ctx[9], false, false, false),
    					listen_dev(button0, "click", /*setGame*/ ctx[10], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(button1, "click", /*genSens*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*custom*/ ctx[7].yaw) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div2, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*custom*/ ctx[7].yaw) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div2, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*dpi*/ 4 && input0.value !== /*dpi*/ ctx[2]) {
    				set_input_value(input0, /*dpi*/ ctx[2]);
    			}

    			if (dirty & /*lower*/ 8 && input1.value !== /*lower*/ ctx[3]) {
    				set_input_value(input1, /*lower*/ ctx[3]);
    			}

    			if (dirty & /*higher*/ 16 && input2.value !== /*higher*/ ctx[4]) {
    				set_input_value(input2, /*higher*/ ctx[4]);
    			}

    			if (dirty & /*sens*/ 2) set_data_dev(t20, /*sens*/ ctx[1]);
    			if (dirty & /*randNumRounded*/ 64) set_data_dev(t23, /*randNumRounded*/ ctx[6]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Random', slots, []);

    	let games_dic = {
    		Overwatch: [0.0066, 2],
    		Fortnite: [0.005555, 3],
    		CounterStrike: [0.022, 2],
    		QuakeChampions: [0.022, 6]
    	};

    	let value = "Overwatch";
    	let items = ["Overwatch", "Fortnite", "CounterStrike", "QuakeChampions"];
    	let sens = 6;
    	let dpi = 800;
    	let lower = 20;
    	let higher = 40;
    	let yaw = 0.0066;
    	let precision = 2;
    	let randNumRounded = 28.86;
    	let custom = { yaw: false };

    	function toggle() {
    		$$invalidate(7, custom.yaw = !custom.yaw, custom);
    	}

    	function setGame() {
    		for (const [key, values] of Object.entries(games_dic)) {
    			if (key == value) {
    				$$invalidate(5, yaw = values[0]);
    				precision = values[1];
    			}
    		}
    	}

    	function genSens() {
    		let randNum = Number(lower) + Math.random() * (Number(higher) - Number(lower));
    		let unrounded = 360 * 2.54 / (randNum * Number(dpi) * yaw);
    		$$invalidate(1, sens = Number.parseFloat(unrounded).toFixed(precision));
    		$$invalidate(6, randNumRounded = Number.parseFloat(realCM(sens)).toFixed(2));
    	}

    	function realCM(inputSens) {
    		return 360 * 2.54 / (inputSens * dpi * yaw);
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Random> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    		$$invalidate(8, items);
    	}

    	function input_input_handler() {
    		yaw = this.value;
    		$$invalidate(5, yaw);
    	}

    	function input0_input_handler() {
    		dpi = this.value;
    		$$invalidate(2, dpi);
    	}

    	function input1_input_handler() {
    		lower = this.value;
    		$$invalidate(3, lower);
    	}

    	function input2_input_handler() {
    		higher = this.value;
    		$$invalidate(4, higher);
    	}

    	$$self.$capture_state = () => ({
    		games_dic,
    		value,
    		items,
    		sens,
    		dpi,
    		lower,
    		higher,
    		yaw,
    		precision,
    		randNumRounded,
    		custom,
    		toggle,
    		setGame,
    		genSens,
    		realCM
    	});

    	$$self.$inject_state = $$props => {
    		if ('games_dic' in $$props) games_dic = $$props.games_dic;
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('items' in $$props) $$invalidate(8, items = $$props.items);
    		if ('sens' in $$props) $$invalidate(1, sens = $$props.sens);
    		if ('dpi' in $$props) $$invalidate(2, dpi = $$props.dpi);
    		if ('lower' in $$props) $$invalidate(3, lower = $$props.lower);
    		if ('higher' in $$props) $$invalidate(4, higher = $$props.higher);
    		if ('yaw' in $$props) $$invalidate(5, yaw = $$props.yaw);
    		if ('precision' in $$props) precision = $$props.precision;
    		if ('randNumRounded' in $$props) $$invalidate(6, randNumRounded = $$props.randNumRounded);
    		if ('custom' in $$props) $$invalidate(7, custom = $$props.custom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		sens,
    		dpi,
    		lower,
    		higher,
    		yaw,
    		randNumRounded,
    		custom,
    		items,
    		toggle,
    		setGame,
    		genSens,
    		select_change_handler,
    		input_input_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Random extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Random",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\CM.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\CM.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (51:8) {#each items as item}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[20] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*item*/ ctx[20];
    			option.value = option.__value;
    			add_location(option, file$3, 51, 8, 1292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(51:8) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#each items as item}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[20] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*item*/ ctx[20];
    			option.value = option.__value;
    			add_location(option, file$3, 61, 8, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(61:8) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let select0;
    	let t4;
    	let p1;
    	let t6;
    	let input0;
    	let t7;
    	let p2;
    	let t9;
    	let input1;
    	let t10;
    	let p3;
    	let t12;
    	let select1;
    	let t13;
    	let p4;
    	let t15;
    	let input2;
    	let t16;
    	let div0;
    	let button;
    	let t18;
    	let p5;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let p6;
    	let t25;
    	let t26;
    	let t27;
    	let t28;
    	let t29;
    	let t30;
    	let t31;
    	let br;
    	let t32;
    	let t33;
    	let t34;
    	let t35;
    	let t36;
    	let t37;
    	let t38;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*items*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*items*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Convert Between Games/DPIs";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "From:";
    			t3 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Sens:";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "DPI From:";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			p3 = element("p");
    			p3.textContent = "To:";
    			t12 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "DPI To:";
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Convert Sensitivity";
    			t18 = space();
    			p5 = element("p");
    			t19 = text("New Sens: ");
    			t20 = text(/*sensTo*/ ctx[5]);
    			t21 = text(" (");
    			t22 = text(/*realCMO*/ ctx[6]);
    			t23 = text(" cm/360)");
    			t24 = space();
    			p6 = element("p");
    			t25 = text("Converted ");
    			t26 = text(/*sensFrom*/ ctx[4]);
    			t27 = text(" in ");
    			t28 = text(/*gameFrom*/ ctx[0]);
    			t29 = text(" at ");
    			t30 = text(/*dpiFrom*/ ctx[2]);
    			t31 = text(" DPI to ");
    			br = element("br");
    			t32 = space();
    			t33 = text(/*sensTo*/ ctx[5]);
    			t34 = text(" in ");
    			t35 = text(/*gameTo*/ ctx[1]);
    			t36 = text(" at ");
    			t37 = text(/*dpiTo*/ ctx[3]);
    			t38 = text(" DPI");
    			add_location(h1, file$3, 47, 4, 1123);
    			add_location(p0, file$3, 48, 4, 1164);
    			if (/*gameFrom*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[10].call(select0));
    			add_location(select0, file$3, 49, 4, 1182);
    			add_location(p1, file$3, 54, 4, 1366);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "size", "1");
    			add_location(input0, file$3, 55, 4, 1384);
    			add_location(p2, file$3, 56, 4, 1466);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "size", "1");
    			add_location(input1, file$3, 57, 4, 1488);
    			add_location(p3, file$3, 58, 4, 1569);
    			if (/*gameTo*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$3, 59, 4, 1585);
    			add_location(p4, file$3, 64, 4, 1765);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "size", "1");
    			add_location(input2, file$3, 65, 4, 1785);
    			add_location(button, file$3, 67, 8, 1879);
    			add_location(div0, file$3, 66, 4, 1864);
    			add_location(p5, file$3, 69, 4, 1956);
    			add_location(br, file$3, 70, 62, 2064);
    			add_location(p6, file$3, 70, 4, 2006);
    			add_location(div1, file$3, 46, 0, 1112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*gameFrom*/ ctx[0]);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, input0);
    			set_input_value(input0, /*sensFrom*/ ctx[4]);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(div1, t9);
    			append_dev(div1, input1);
    			set_input_value(input1, /*dpiFrom*/ ctx[2]);
    			append_dev(div1, t10);
    			append_dev(div1, p3);
    			append_dev(div1, t12);
    			append_dev(div1, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*gameTo*/ ctx[1]);
    			append_dev(div1, t13);
    			append_dev(div1, p4);
    			append_dev(div1, t15);
    			append_dev(div1, input2);
    			set_input_value(input2, /*dpiTo*/ ctx[3]);
    			append_dev(div1, t16);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(div1, t18);
    			append_dev(div1, p5);
    			append_dev(p5, t19);
    			append_dev(p5, t20);
    			append_dev(p5, t21);
    			append_dev(p5, t22);
    			append_dev(p5, t23);
    			append_dev(div1, t24);
    			append_dev(div1, p6);
    			append_dev(p6, t25);
    			append_dev(p6, t26);
    			append_dev(p6, t27);
    			append_dev(p6, t28);
    			append_dev(p6, t29);
    			append_dev(p6, t30);
    			append_dev(p6, t31);
    			append_dev(p6, br);
    			append_dev(p6, t32);
    			append_dev(p6, t33);
    			append_dev(p6, t34);
    			append_dev(p6, t35);
    			append_dev(p6, t36);
    			append_dev(p6, t37);
    			append_dev(p6, t38);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[10]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[11], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input0, "change", /*convertSens*/ ctx[9], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(input1, "change", /*convertSens*/ ctx[9], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(select1, "change", /*change_handler_1*/ ctx[15], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(input2, "change", /*convertSens*/ ctx[9], false, false, false),
    					listen_dev(button, "click", /*convertSens*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 128) {
    				each_value_1 = /*items*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*gameFrom, items*/ 129) {
    				select_option(select0, /*gameFrom*/ ctx[0]);
    			}

    			if (dirty & /*sensFrom*/ 16 && input0.value !== /*sensFrom*/ ctx[4]) {
    				set_input_value(input0, /*sensFrom*/ ctx[4]);
    			}

    			if (dirty & /*dpiFrom*/ 4 && input1.value !== /*dpiFrom*/ ctx[2]) {
    				set_input_value(input1, /*dpiFrom*/ ctx[2]);
    			}

    			if (dirty & /*items*/ 128) {
    				each_value = /*items*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*gameTo, items*/ 130) {
    				select_option(select1, /*gameTo*/ ctx[1]);
    			}

    			if (dirty & /*dpiTo*/ 8 && input2.value !== /*dpiTo*/ ctx[3]) {
    				set_input_value(input2, /*dpiTo*/ ctx[3]);
    			}

    			if (dirty & /*sensTo*/ 32) set_data_dev(t20, /*sensTo*/ ctx[5]);
    			if (dirty & /*realCMO*/ 64) set_data_dev(t22, /*realCMO*/ ctx[6]);
    			if (dirty & /*sensFrom*/ 16) set_data_dev(t26, /*sensFrom*/ ctx[4]);
    			if (dirty & /*gameFrom*/ 1) set_data_dev(t28, /*gameFrom*/ ctx[0]);
    			if (dirty & /*dpiFrom*/ 4) set_data_dev(t30, /*dpiFrom*/ ctx[2]);
    			if (dirty & /*sensTo*/ 32) set_data_dev(t33, /*sensTo*/ ctx[5]);
    			if (dirty & /*gameTo*/ 2) set_data_dev(t35, /*gameTo*/ ctx[1]);
    			if (dirty & /*dpiTo*/ 8) set_data_dev(t37, /*dpiTo*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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

    function realCM(inputSens, dpi, yaw) {
    	return 360 * 2.54 / (inputSens * dpi * yaw);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CM', slots, []);

    	onMount(() => {
    		setGame(gameFrom, 0);
    		setGame(gameTo, 1);
    		convertSens();
    	});

    	let games_dic = {
    		Overwatch: [0.0066, 2],
    		Fortnite: [0.005555, 3],
    		CounterStrike: [0.022, 2],
    		QuakeChampions: [0.022, 6]
    	};

    	let gameFrom = "Overwatch";
    	let gameTo = "CounterStrike";
    	let items = ["Overwatch", "Fortnite", "CounterStrike", "QuakeChampions"];
    	let yaw = [];
    	let precision = [];
    	let dpiFrom = 800;
    	let dpiTo = 400;
    	let sensFrom = 6;
    	let sensTo;
    	let realCMO;

    	function setGame(valueToUpdate, i) {
    		for (const [key, values] of Object.entries(games_dic)) {
    			if (key == valueToUpdate) {
    				yaw[i] = values[0];
    				precision[i] = values[1];
    			}
    		}
    	}

    	function convertSens() {
    		let tempSens = dpiFrom * sensFrom * yaw[0] / (dpiTo * yaw[1]);
    		$$invalidate(5, sensTo = Number.parseFloat(tempSens).toFixed(precision[1]));
    		$$invalidate(6, realCMO = Number.parseFloat(realCM(sensTo, dpiTo, yaw[1])).toFixed(2));
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CM> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		gameFrom = select_value(this);
    		$$invalidate(0, gameFrom);
    		$$invalidate(7, items);
    	}

    	const change_handler = () => setGame(gameFrom, 0);

    	function input0_input_handler() {
    		sensFrom = this.value;
    		$$invalidate(4, sensFrom);
    	}

    	function input1_input_handler() {
    		dpiFrom = this.value;
    		$$invalidate(2, dpiFrom);
    	}

    	function select1_change_handler() {
    		gameTo = select_value(this);
    		$$invalidate(1, gameTo);
    		$$invalidate(7, items);
    	}

    	const change_handler_1 = () => setGame(gameTo, 1);

    	function input2_input_handler() {
    		dpiTo = this.value;
    		$$invalidate(3, dpiTo);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		games_dic,
    		gameFrom,
    		gameTo,
    		items,
    		yaw,
    		precision,
    		dpiFrom,
    		dpiTo,
    		sensFrom,
    		sensTo,
    		realCMO,
    		setGame,
    		convertSens,
    		realCM
    	});

    	$$self.$inject_state = $$props => {
    		if ('games_dic' in $$props) games_dic = $$props.games_dic;
    		if ('gameFrom' in $$props) $$invalidate(0, gameFrom = $$props.gameFrom);
    		if ('gameTo' in $$props) $$invalidate(1, gameTo = $$props.gameTo);
    		if ('items' in $$props) $$invalidate(7, items = $$props.items);
    		if ('yaw' in $$props) yaw = $$props.yaw;
    		if ('precision' in $$props) precision = $$props.precision;
    		if ('dpiFrom' in $$props) $$invalidate(2, dpiFrom = $$props.dpiFrom);
    		if ('dpiTo' in $$props) $$invalidate(3, dpiTo = $$props.dpiTo);
    		if ('sensFrom' in $$props) $$invalidate(4, sensFrom = $$props.sensFrom);
    		if ('sensTo' in $$props) $$invalidate(5, sensTo = $$props.sensTo);
    		if ('realCMO' in $$props) $$invalidate(6, realCMO = $$props.realCMO);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gameFrom,
    		gameTo,
    		dpiFrom,
    		dpiTo,
    		sensFrom,
    		sensTo,
    		realCMO,
    		items,
    		setGame,
    		convertSens,
    		select0_change_handler,
    		change_handler,
    		input0_input_handler,
    		input1_input_handler,
    		select1_change_handler,
    		change_handler_1,
    		input2_input_handler
    	];
    }

    class CM extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CM",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\FocalLength.svelte generated by Svelte v3.44.2 */

    const file$2 = "src\\FocalLength.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Convert with Focal Length Scaling";
    			t1 = space();
    			p = element("p");
    			p.textContent = "16:9 idk";
    			add_location(h1, file$2, 1, 4, 11);
    			add_location(p, file$2, 2, 4, 59);
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
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
    	validate_slots('FocalLength', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FocalLength> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FocalLength extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FocalLength",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\FOV.svelte generated by Svelte v3.44.2 */

    const file$1 = "src\\FOV.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Convert True FOV";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Try 103 idk";
    			add_location(h1, file$1, 1, 4, 11);
    			add_location(p, file$1, 2, 4, 42);
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FOV', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FOV> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FOV extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FOV",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    // (34:12) {:else}
    function create_else_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:45) 
    function create_if_block_4(ctx) {
    	let fov;
    	let current;
    	fov = new FOV({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fov.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fov, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fov.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fov.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fov, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(32:45) ",
    		ctx
    	});

    	return block;
    }

    // (30:44) 
    function create_if_block_3(ctx) {
    	let focallength;
    	let current;
    	focallength = new FocalLength({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(focallength.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(focallength, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(focallength.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(focallength.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(focallength, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(30:44) ",
    		ctx
    	});

    	return block;
    }

    // (28:44) 
    function create_if_block_2(ctx) {
    	let cm;
    	let current;
    	cm = new CM({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cm.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cm, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cm, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(28:44) ",
    		ctx
    	});

    	return block;
    }

    // (26:41) 
    function create_if_block_1(ctx) {
    	let random;
    	let current;
    	random = new Random({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(random.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(random, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(random.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(random.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(random, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(26:41) ",
    		ctx
    	});

    	return block;
    }

    // (24:12) {#if page==="#home"}
    function create_if_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:12) {#if page===\\\"#home\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let a4;
    	let t11;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_else_block
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[0] === "#home") return 0;
    		if (/*page*/ ctx[0] === "#random") return 1;
    		if (/*page*/ ctx[0] === "#convertCM") return 2;
    		if (/*page*/ ctx[0] === "#convertFL") return 3;
    		if (/*page*/ ctx[0] === "#convertFOV") return 4;
    		return 5;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Menu";
    			t1 = space();
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Random Sensitvity";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Convert: Distance";
    			t7 = space();
    			a3 = element("a");
    			a3.textContent = "Convert: Focal Length";
    			t9 = space();
    			a4 = element("a");
    			a4.textContent = "Convert: FOV";
    			t11 = space();
    			div1 = element("div");
    			if_block.c();
    			add_location(h1, file, 15, 12, 402);
    			attr_dev(a0, "href", "#home");
    			add_location(a0, file, 16, 12, 428);
    			attr_dev(a1, "href", "#random");
    			add_location(a1, file, 17, 12, 465);
    			attr_dev(a2, "href", "#convertCM");
    			add_location(a2, file, 18, 12, 517);
    			attr_dev(a3, "href", "#convertFL");
    			add_location(a3, file, 19, 12, 572);
    			attr_dev(a4, "href", "#convertFOV");
    			add_location(a4, file, 20, 12, 631);
    			attr_dev(div0, "id", "sidebar");
    			attr_dev(div0, "class", "pane svelte-1cktkt6");
    			add_location(div0, file, 14, 8, 358);
    			attr_dev(div1, "id", "content");
    			attr_dev(div1, "class", "pane svelte-1cktkt6");
    			add_location(div1, file, 22, 8, 693);
    			attr_dev(div2, "id", "page");
    			attr_dev(div2, "class", "svelte-1cktkt6");
    			add_location(div2, file, 13, 4, 334);
    			attr_dev(main, "id", "main");
    			add_location(main, file, 12, 0, 313);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, a0);
    			append_dev(div0, t3);
    			append_dev(div0, a1);
    			append_dev(div0, t5);
    			append_dev(div0, a2);
    			append_dev(div0, t7);
    			append_dev(div0, a3);
    			append_dev(div0, t9);
    			append_dev(div0, a4);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
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
    				if_block.m(div1, null);
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
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
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
    	validate_slots('App', slots, []);
    	let page = document.location.hash;

    	window.onpopstate = function (event) {
    		$$invalidate(0, page = document.location.hash);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Home, Random, CM, FocalLength, FOV, page });

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
