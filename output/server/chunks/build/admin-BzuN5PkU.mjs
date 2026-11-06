import { u as useHead$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { T as Table_default, a as TableHeader_default, b as TableRow_default, c as TableHead_default, d as TableBody_default, e as TableCell_default, f as cn } from './table-C5wIZS21.mjs';
import { A as AdminShell_default } from './AdminShell-C5e8khbI.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, Fragment, renderList, createTextVNode, withModifiers, toDisplayString, h, renderSlot, watch, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderSlot, ssrRenderStyle } from 'vue/server-renderer';
import { useForwardPropsEmits, SelectRoot, useForwardProps, SelectTrigger, SelectIcon, SelectValue, SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemIndicator, SelectItemText, Primitive, SelectScrollUpButton, SelectScrollDownButton, SelectGroup, SelectLabel, SelectSeparator } from 'reka-ui';
import { reactiveOmit } from '@vueuse/core';
import { ChevronDown, Check, ChevronUp } from '@lucide/vue';
import { FileText, Send, PencilLine, Activity, Plus, Image, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next';
import { useVueTable, getSortedRowModel, getPaginationRowModel, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import { cva } from 'class-variance-authority';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import 'clsx';
import 'tailwind-merge';

//#region app/components/ui/select/Select.vue?vue&type=script&setup=true&lang.ts
var Select_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Select",
	__ssrInlineRender: true,
	props: {
		open: { type: Boolean },
		defaultOpen: { type: Boolean },
		defaultValue: {},
		modelValue: {},
		nullableValue: {},
		by: { type: [String, Function] },
		dir: {},
		multiple: { type: Boolean },
		autocomplete: {},
		disabled: { type: Boolean },
		name: {},
		required: { type: Boolean }
	},
	emits: ["update:modelValue", "update:open"],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectRoot), mergeProps({ "data-slot": "select" }, unref(forwarded), _attrs), {
				default: withCtx((slotProps, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", slotProps, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", slotProps)];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/Select.vue
var _sfc_setup$13 = Select_vue_vue_type_script_setup_true_lang_default.setup;
Select_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/Select.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var Select_default = Object.assign(Select_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelect" });
//#endregion
//#region app/components/ui/select/SelectContent.vue?vue&type=script&setup=true&lang.ts
var SelectContent_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "SelectContent",
	__ssrInlineRender: true,
	props: {
		forceMount: { type: Boolean },
		position: { default: "popper" },
		bodyLock: { type: Boolean },
		memoDependencies: {},
		side: {},
		sideOffset: {},
		sideFlip: { type: Boolean },
		align: {},
		alignOffset: {},
		alignFlip: { type: Boolean },
		avoidCollisions: { type: Boolean },
		collisionBoundary: {},
		collisionPadding: {},
		arrowPadding: {},
		hideShiftedArrow: { type: Boolean },
		sticky: {},
		hideWhenDetached: { type: Boolean },
		positionStrategy: {},
		updatePositionStrategy: {},
		disableUpdateOnLayoutShift: { type: Boolean },
		prioritizePosition: { type: Boolean },
		reference: {},
		dir: {},
		asChild: { type: Boolean },
		as: {},
		disableOutsidePointerEvents: { type: Boolean },
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	emits: [
		"closeAutoFocus",
		"escapeKeyDown",
		"pointerDownOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const delegatedProps = reactiveOmit(props, "class");
		const forwarded = useForwardPropsEmits(delegatedProps, emits);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectPortal), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(SelectContent), mergeProps({ "data-slot": "select-content" }, {
						..._ctx.$attrs,
						...unref(forwarded)
					}, { class: unref(cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--reka-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md", __props.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", props.class) }), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(SelectScrollUpButton_default), null, null, _parent, _scopeId));
								_push(ssrRenderComponent(unref(SelectViewport), { class: unref(cn)("p-1", __props.position === "popper" && "h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1") }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "default")];
									}),
									_: 3
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(SelectScrollDownButton_default), null, null, _parent, _scopeId));
							} else return [
								createVNode(unref(SelectScrollUpButton_default)),
								createVNode(unref(SelectViewport), { class: unref(cn)("p-1", __props.position === "popper" && "h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1") }, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
									_: 3
								}, 8, ["class"]),
								createVNode(unref(SelectScrollDownButton_default))
							];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [createVNode(unref(SelectContent), mergeProps({ "data-slot": "select-content" }, {
						..._ctx.$attrs,
						...unref(forwarded)
					}, { class: unref(cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--reka-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md", __props.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", props.class) }), {
						default: withCtx(() => [
							createVNode(unref(SelectScrollUpButton_default)),
							createVNode(unref(SelectViewport), { class: unref(cn)("p-1", __props.position === "popper" && "h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1") }, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
								_: 3
							}, 8, ["class"]),
							createVNode(unref(SelectScrollDownButton_default))
						]),
						_: 3
					}, 16, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectContent.vue
var _sfc_setup$12 = SelectContent_vue_vue_type_script_setup_true_lang_default.setup;
SelectContent_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectContent.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var SelectContent_default = Object.assign(SelectContent_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectContent" });
//#endregion
//#region app/components/ui/select/SelectGroup.vue?vue&type=script&setup=true&lang.ts
var SelectGroup_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectGroup",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectGroup), mergeProps({ "data-slot": "select-group" }, props, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectGroup.vue
var _sfc_setup$11 = SelectGroup_vue_vue_type_script_setup_true_lang_default.setup;
SelectGroup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectGroup.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
Object.assign(SelectGroup_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectGroup" });
//#endregion
//#region app/components/ui/select/SelectItem.vue?vue&type=script&setup=true&lang.ts
var SelectItem_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectItem",
	__ssrInlineRender: true,
	props: {
		value: {},
		disabled: { type: Boolean },
		textValue: {},
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		const forwardedProps = useForwardProps(delegatedProps);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectItem), mergeProps({ "data-slot": "select-item" }, unref(forwardedProps), { class: unref(cn)(`focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2`, props.class) }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<span class="absolute right-2 flex size-3.5 items-center justify-center"${_scopeId}>`);
						_push(ssrRenderComponent(unref(SelectItemIndicator), null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "indicator-icon", {}, () => {
									_push(ssrRenderComponent(unref(Check), { class: "size-4" }, null, _parent, _scopeId));
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "indicator-icon", {}, () => [createVNode(unref(Check), { class: "size-4" })])];
							}),
							_: 3
						}, _parent, _scopeId));
						_push(`</span>`);
						_push(ssrRenderComponent(unref(SelectItemText), null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default")];
							}),
							_: 3
						}, _parent, _scopeId));
					} else return [createVNode("span", { class: "absolute right-2 flex size-3.5 items-center justify-center" }, [createVNode(unref(SelectItemIndicator), null, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "indicator-icon", {}, () => [createVNode(unref(Check), { class: "size-4" })])]),
						_: 3
					})]), createVNode(unref(SelectItemText), null, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					})];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectItem.vue
var _sfc_setup$10 = SelectItem_vue_vue_type_script_setup_true_lang_default.setup;
SelectItem_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectItem.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var SelectItem_default = Object.assign(SelectItem_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectItem" });
//#endregion
//#region app/components/ui/select/SelectItemText.vue?vue&type=script&setup=true&lang.ts
var SelectItemText_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectItemText",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectItemText), mergeProps({ "data-slot": "select-item-text" }, props, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectItemText.vue
var _sfc_setup$9 = SelectItemText_vue_vue_type_script_setup_true_lang_default.setup;
SelectItemText_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectItemText.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
Object.assign(SelectItemText_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectItemText" });
//#endregion
//#region app/components/ui/select/SelectLabel.vue?vue&type=script&setup=true&lang.ts
var SelectLabel_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectLabel",
	__ssrInlineRender: true,
	props: {
		for: {},
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectLabel), mergeProps({
				"data-slot": "select-label",
				class: unref(cn)("text-muted-foreground px-2 py-1.5 text-xs", props.class)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectLabel.vue
var _sfc_setup$8 = SelectLabel_vue_vue_type_script_setup_true_lang_default.setup;
SelectLabel_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectLabel.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
Object.assign(SelectLabel_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectLabel" });
//#endregion
//#region app/components/ui/select/SelectScrollDownButton.vue?vue&type=script&setup=true&lang.ts
var SelectScrollDownButton_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectScrollDownButton",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		const forwardedProps = useForwardProps(delegatedProps);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectScrollDownButton), mergeProps({ "data-slot": "select-scroll-down-button" }, unref(forwardedProps), { class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class) }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
						_push(ssrRenderComponent(unref(ChevronDown), { class: "size-4" }, null, _parent, _scopeId));
					}, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, () => [createVNode(unref(ChevronDown), { class: "size-4" })])];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectScrollDownButton.vue
var _sfc_setup$7 = SelectScrollDownButton_vue_vue_type_script_setup_true_lang_default.setup;
SelectScrollDownButton_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollDownButton.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var SelectScrollDownButton_default = Object.assign(SelectScrollDownButton_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectScrollDownButton" });
//#endregion
//#region app/components/ui/select/SelectScrollUpButton.vue?vue&type=script&setup=true&lang.ts
var SelectScrollUpButton_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectScrollUpButton",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		const forwardedProps = useForwardProps(delegatedProps);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectScrollUpButton), mergeProps({ "data-slot": "select-scroll-up-button" }, unref(forwardedProps), { class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class) }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
						_push(ssrRenderComponent(unref(ChevronUp), { class: "size-4" }, null, _parent, _scopeId));
					}, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, () => [createVNode(unref(ChevronUp), { class: "size-4" })])];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectScrollUpButton.vue
var _sfc_setup$6 = SelectScrollUpButton_vue_vue_type_script_setup_true_lang_default.setup;
SelectScrollUpButton_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollUpButton.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var SelectScrollUpButton_default = Object.assign(SelectScrollUpButton_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectScrollUpButton" });
//#endregion
//#region app/components/ui/select/SelectSeparator.vue?vue&type=script&setup=true&lang.ts
var SelectSeparator_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectSeparator",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectSeparator), mergeProps({ "data-slot": "select-separator" }, unref(delegatedProps), { class: unref(cn)("bg-border pointer-events-none -mx-1 my-1 h-px", props.class) }, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectSeparator.vue
var _sfc_setup$5 = SelectSeparator_vue_vue_type_script_setup_true_lang_default.setup;
SelectSeparator_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectSeparator.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
Object.assign(SelectSeparator_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectSeparator" });
//#endregion
//#region app/components/ui/select/SelectTrigger.vue?vue&type=script&setup=true&lang.ts
var SelectTrigger_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectTrigger",
	__ssrInlineRender: true,
	props: {
		disabled: { type: Boolean },
		reference: {},
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		size: { default: "default" }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class", "size");
		const forwardedProps = useForwardProps(delegatedProps);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectTrigger), mergeProps({
				"data-slot": "select-trigger",
				"data-size": __props.size
			}, unref(forwardedProps), { class: unref(cn)(`border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`, props.class) }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						_push(ssrRenderComponent(unref(SelectIcon), { "as-child": "" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(ChevronDown), { class: "size-4 opacity-50" }, null, _parent, _scopeId));
								else return [createVNode(unref(ChevronDown), { class: "size-4 opacity-50" })];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [renderSlot(_ctx.$slots, "default"), createVNode(unref(SelectIcon), { "as-child": "" }, {
						default: withCtx(() => [createVNode(unref(ChevronDown), { class: "size-4 opacity-50" })]),
						_: 1
					})];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectTrigger.vue
var _sfc_setup$4 = SelectTrigger_vue_vue_type_script_setup_true_lang_default.setup;
SelectTrigger_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectTrigger.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var SelectTrigger_default = Object.assign(SelectTrigger_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectTrigger" });
//#endregion
//#region app/components/ui/select/SelectValue.vue?vue&type=script&setup=true&lang.ts
var SelectValue_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SelectValue",
	__ssrInlineRender: true,
	props: {
		placeholder: {},
		asChild: { type: Boolean },
		as: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectValue), mergeProps({ "data-slot": "select-value" }, props, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/select/SelectValue.vue
var _sfc_setup$3 = SelectValue_vue_vue_type_script_setup_true_lang_default.setup;
SelectValue_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectValue.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var SelectValue_default = Object.assign(SelectValue_vue_vue_type_script_setup_true_lang_default, { __name: "UiSelectValue" });
//#endregion
//#region app/components/AdminStatusSelect.vue?vue&type=script&setup=true&lang.ts
var AdminStatusSelect_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminStatusSelect",
	__ssrInlineRender: true,
	props: { status: {} },
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const OPTIONS = [
			{
				value: "draft",
				label: "草稿"
			},
			{
				value: "published",
				label: "已发布"
			},
			{
				value: "unpublished",
				label: "下架"
			}
		];
		const TRIGGER_TONE = {
			draft: "bg-zinc-100 text-zinc-600 hover:bg-zinc-100",
			published: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
			unpublished: "bg-amber-100 text-amber-700 hover:bg-amber-100"
		};
		const open = ref(false);
		const activeIndex = ref(0);
		const viewportEl = ref(null);
		const pillStyle = ref({ opacity: "0" });
		const triggerClass = computed(() => ["h-7 w-auto justify-center gap-1 rounded-full border-0 px-3 text-[12px] font-medium shadow-none focus-visible:ring-2", TRIGGER_TONE[props.status] ?? TRIGGER_TONE.draft]);
		/** 把胶囊移动到当前高亮项的位置 */
		function movePill(animate = true) {
			const vp = viewportEl.value;
			if (!vp) return;
			const el = Array.from(vp.querySelectorAll("[role=\"option\"]"))[activeIndex.value];
			if (!el) {
				pillStyle.value = { opacity: "0" };
				return;
			}
			pillStyle.value = {
				opacity: "1",
				transform: `translateY(${el.offsetTop}px)`,
				height: `${el.offsetHeight}px`,
				transition: animate ? "transform .18s cubic-bezier(.4, 0, .2, 1), height .18s cubic-bezier(.4, 0, .2, 1), opacity .12s ease" : "none"
			};
		}
		/** 键盘上下键时 reka 会在选项上标记 data-highlighted,观察它来同步胶囊 */
		function syncFromDom() {
			const vp = viewportEl.value;
			if (!vp) return;
			const i = Array.from(vp.querySelectorAll("[role=\"option\"]")).findIndex((el) => el.hasAttribute("data-highlighted"));
			if (i >= 0 && i !== activeIndex.value) {
				activeIndex.value = i;
				movePill();
			}
		}
		function onPointerOver(e) {
			const target = e.target.closest?.("[role=\"option\"]");
			const vp = viewportEl.value;
			if (!target || !vp) return;
			const i = Array.from(vp.querySelectorAll("[role=\"option\"]")).indexOf(target);
			if (i >= 0 && i !== activeIndex.value) {
				activeIndex.value = i;
				movePill();
			}
		}
		let observer;
		watch(open, async (isOpen) => {
			if (!isOpen) {
				observer?.disconnect();
				observer = void 0;
				return;
			}
			await nextTick();
			activeIndex.value = Math.max(0, OPTIONS.findIndex((o) => o.value === props.status));
			await nextTick();
			movePill(false);
			if (viewportEl.value) {
				observer = new MutationObserver(syncFromDom);
				observer.observe(viewportEl.value, {
					subtree: true,
					attributes: true,
					attributeFilter: ["data-highlighted"]
				});
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Select_default), mergeProps({
				"model-value": __props.status,
				open: open.value,
				"onUpdate:open": ($event) => open.value = $event,
				"onUpdate:modelValue": (v) => emit("change", String(v))
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(SelectTrigger_default), { class: unref(triggerClass) }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(SelectValue_default), null, null, _parent, _scopeId));
								else return [createVNode(unref(SelectValue_default))];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(SelectContent_default), { class: "min-w-[104px]" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="relative"${_scopeId}><div class="pointer-events-none absolute inset-x-1 top-0 rounded-md bg-zinc-100" style="${ssrRenderStyle(pillStyle.value)}" aria-hidden="true"${_scopeId}></div><!--[-->`);
									ssrRenderList(OPTIONS, (opt) => {
										_push(ssrRenderComponent(unref(SelectItem_default), {
											key: opt.value,
											value: opt.value,
											class: "relative z-[1] rounded-md bg-transparent py-2 pl-3 pr-8 text-[13px] text-zinc-700 shadow-none focus:bg-transparent data-[highlighted]:bg-transparent data-[highlighted]:text-zinc-900"
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(`${ssrInterpolate(opt.label)}`);
												else return [createTextVNode(toDisplayString(opt.label), 1)];
											}),
											_: 2
										}, _parent, _scopeId));
									});
									_push(`<!--]--></div>`);
								} else return [createVNode("div", {
									ref_key: "viewportEl",
									ref: viewportEl,
									class: "relative",
									onPointerover: onPointerOver
								}, [createVNode("div", {
									class: "pointer-events-none absolute inset-x-1 top-0 rounded-md bg-zinc-100",
									style: pillStyle.value,
									"aria-hidden": "true"
								}, null, 4), (openBlock(), createBlock(Fragment, null, renderList(OPTIONS, (opt) => {
									return createVNode(unref(SelectItem_default), {
										key: opt.value,
										value: opt.value,
										class: "relative z-[1] rounded-md bg-transparent py-2 pl-3 pr-8 text-[13px] text-zinc-700 shadow-none focus:bg-transparent data-[highlighted]:bg-transparent data-[highlighted]:text-zinc-900"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(opt.label), 1)]),
										_: 2
									}, 1032, ["value"]);
								}), 64))], 544)];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(SelectTrigger_default), { class: unref(triggerClass) }, {
						default: withCtx(() => [createVNode(unref(SelectValue_default))]),
						_: 1
					}, 8, ["class"]), createVNode(unref(SelectContent_default), { class: "min-w-[104px]" }, {
						default: withCtx(() => [createVNode("div", {
							ref_key: "viewportEl",
							ref: viewportEl,
							class: "relative",
							onPointerover: onPointerOver
						}, [createVNode("div", {
							class: "pointer-events-none absolute inset-x-1 top-0 rounded-md bg-zinc-100",
							style: pillStyle.value,
							"aria-hidden": "true"
						}, null, 4), (openBlock(), createBlock(Fragment, null, renderList(OPTIONS, (opt) => {
							return createVNode(unref(SelectItem_default), {
								key: opt.value,
								value: opt.value,
								class: "relative z-[1] rounded-md bg-transparent py-2 pl-3 pr-8 text-[13px] text-zinc-700 shadow-none focus:bg-transparent data-[highlighted]:bg-transparent data-[highlighted]:text-zinc-900"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(opt.label), 1)]),
								_: 2
							}, 1032, ["value"]);
						}), 64))], 544)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/AdminStatusSelect.vue
var _sfc_setup$2 = AdminStatusSelect_vue_vue_type_script_setup_true_lang_default.setup;
AdminStatusSelect_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminStatusSelect.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AdminStatusSelect_default = Object.assign(AdminStatusSelect_vue_vue_type_script_setup_true_lang_default, { __name: "AdminStatusSelect" });
//#endregion
//#region app/components/ui/button/Button.vue?vue&type=script&setup=true&lang.ts
var Button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Button",
	__ssrInlineRender: true,
	props: {
		variant: {},
		size: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		asChild: { type: Boolean },
		as: { default: "button" }
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				"data-slot": "button",
				"data-variant": __props.variant,
				"data-size": __props.size,
				as: __props.as,
				"as-child": __props.asChild,
				class: unref(cn)(unref(buttonVariants)({
					variant: __props.variant,
					size: __props.size
				}), props.class)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/button/Button.vue
var _sfc_setup$1 = Button_vue_vue_type_script_setup_true_lang_default.setup;
Button_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/button/Button.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Button_default = Object.assign(Button_vue_vue_type_script_setup_true_lang_default, { __name: "UiButton" });
//#endregion
//#region app/components/ui/button/index.ts
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			"default": "h-9 px-4 py-2 has-[>svg]:px-3",
			"xs": "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			"sm": "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
			"lg": "h-10 rounded-md px-6 has-[>svg]:px-4",
			"icon": "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
//#endregion
//#region app/pages/admin/index.vue?vue&type=script&setup=true&lang.ts
var CHART_W = 640;
var CHART_H = 170;
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const authenticated = ref(null);
		const password = ref("");
		const loginError = ref("");
		const loggingIn = ref(false);
		const posts = ref([]);
		const loadingPosts = ref(false);
		const riskStats = ref(null);
		useHead$1({ title: "博客后台 — IP Ready" });
		async function loadPosts() {
			loadingPosts.value = true;
			try {
				posts.value = await $fetch$2("/api/admin/posts");
			} finally {
				loadingPosts.value = false;
			}
		}
		async function loadRiskStats() {
			riskStats.value = await $fetch$2("/api/admin/risk-stats").catch(() => null);
		}
		async function removePost(slug) {
			if (!(void 0).confirm(`确定删除「${slug}」?此操作不可恢复。`)) return;
			await $fetch$2(`/api/admin/posts/${slug}`, { method: "DELETE" });
			loadPosts();
			loadRiskStats();
		}
		const stats = computed(() => {
			const published = posts.value.filter((p) => p.status === "published").length;
			const drafts = posts.value.filter((p) => p.status !== "published").length;
			return [
				{
					label: "总文章",
					value: String(posts.value.length),
					icon: FileText,
					tone: "zinc"
				},
				{
					label: "已发布",
					value: String(published),
					icon: Send,
					tone: "green"
				},
				{
					label: "草稿/下架",
					value: String(drafts),
					icon: PencilLine,
					tone: "amber"
				},
				{
					label: "平均风险分",
					value: riskStats.value ? Number(riskStats.value.summary.avg).toFixed(1) : "—",
					icon: Activity,
					tone: "blue"
				}
			];
		});
		const chartPoints = computed(() => {
			const scans = riskStats.value?.scans ?? [];
			if (scans.length === 0) return "";
			if (scans.length === 1) {
				const y = 150 - (scans[0].risk_score ?? 0) / 100 * 130;
				return `620,${Math.round(y * 10) / 10}`;
			}
			const stepX = 600 / (scans.length - 1);
			return scans.map((s, i) => {
				const x = 20 + i * stepX;
				const y = 150 - (s.risk_score ?? 0) / 100 * 130;
				return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
			}).join(" ");
		});
		const chartAreaPath = computed(() => {
			const scans = riskStats.value?.scans ?? [];
			if (scans.length < 2) return "";
			const stepX = 600 / (scans.length - 1);
			const bottom = 150;
			return `M${scans.map((s, i) => {
				const x = 20 + i * stepX;
				const y = 150 - (s.risk_score ?? 0) / 100 * 130;
				return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
			}).join(" L")} L620,${bottom} L20,${bottom} Z`;
		});
		const chartDots = computed(() => {
			const scans = riskStats.value?.scans ?? [];
			if (scans.length === 0) return [];
			const stepX = scans.length === 1 ? 0 : 600 / (scans.length - 1);
			return scans.map((s, i) => ({
				x: 20 + i * stepX,
				y: 150 - (s.risk_score ?? 0) / 100 * 130,
				level: (s.risk_score ?? 0) > 70 ? "high" : (s.risk_score ?? 0) >= 40 ? "medium" : "low",
				score: s.risk_score,
				ip: s.ip
			}));
		});
		async function updateStatus(slug, status) {
			const post = posts.value.find((p) => p.slug === slug);
			if (!post || post.status === status) return;
			const prev = post.status;
			post.status = status;
			try {
				await $fetch$2(`/api/admin/posts/${slug}`, {
					method: "PUT",
					body: { status }
				});
			} catch {
				post.status = prev;
			}
		}
		const columnDefs = [
			{
				id: "drag",
				header: () => "",
				cell: () => h("span", {
					class: "select-none text-[13px] tracking-[-1px] text-zinc-300 cursor-grab",
					title: "拖动排序"
				}, "⋮⋮"),
				enableSorting: false
			},
			{
				id: "cover",
				header: () => "",
				enableSorting: false,
				cell: ({ row }) => row.original.coverImage ? h("img", {
					src: row.original.coverImage,
					alt: row.original.title,
					class: "w-[72px] max-w-none rounded-md border border-zinc-200",
					loading: "lazy"
				}) : h("span", { class: "grid h-12 w-[72px] place-items-center rounded-md border border-zinc-200 bg-zinc-100 text-zinc-300" }, [h(Image, { class: "size-4" })])
			},
			{
				accessorKey: "title",
				header: sortableHeader("标题"),
				cell: ({ row }) => h("div", { class: "min-w-0 max-w-[420px]" }, [h("a", {
					class: "block truncate font-medium text-zinc-900 hover:underline underline-offset-4",
					href: `/admin/posts/${row.original.slug}`,
					title: row.original.title
				}, row.original.title), h("span", {
					class: "block truncate text-xs text-zinc-400 mt-0.5",
					title: `/blog/${row.original.slug}`
				}, `/blog/${row.original.slug}`)]),
				enableSorting: true
			},
			{
				accessorKey: "status",
				header: "状态",
				cell: ({ row }) => h(AdminStatusSelect_default, {
					status: row.original.status,
					onChange: (v) => updateStatus(row.original.slug, v)
				}),
				enableSorting: false
			},
			{
				accessorKey: "date",
				header: sortableHeader("日期"),
				enableSorting: true
			},
			{
				accessorKey: "category",
				header: sortableHeader("分类"),
				enableSorting: true
			},
			{
				id: "actions",
				header: () => "",
				cell: ({ row }) => h("div", { class: "flex justify-end gap-2" }, [h(Button_default, {
					variant: "outline",
					class: "h-9 rounded-md border-zinc-200 bg-white px-4 text-[14px] font-medium text-zinc-900 shadow-none hover:bg-zinc-50",
					as: "a",
					href: `/blog/${row.original.slug}`
				}, () => "查看"), h(Button_default, {
					variant: "outline",
					class: "h-9 rounded-md border-0 bg-red-100 px-4 text-[14px] font-medium text-red-600 shadow-none hover:bg-red-200",
					onClick: () => removePost(row.original.slug)
				}, () => "删除")])
			}
		];
		const table = useVueTable({
			get data() {
				return posts.value;
			},
			columns: columnDefs,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			initialState: { pagination: { pageSize: 10 } }
		});
		/** Sortable header cell: label + direction icon (shadcn data-table style). */
		function sortableHeader(label) {
			return ({ column }) => {
				const dir = column.getIsSorted();
				const Icon = dir === "asc" ? ArrowUp : dir === "desc" ? ArrowDown : ArrowUpDown;
				return h("button", {
					class: "group inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors",
					onClick: column.getToggleSortingHandler()
				}, [label, h(Icon, { class: `size-3.5 ${dir ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}` })]);
			};
		}
		/** beUI Pro style numeric page list: 1 … around current … last (ellipsis on gaps). */
		const visiblePages = computed(() => {
			const total = table.getPageCount();
			const current = table.getState().pagination.pageIndex + 1;
			if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
			const sorted = [...new Set([
				1,
				current - 1,
				current,
				current + 1,
				total
			].filter((p) => p >= 1 && p <= total))].sort((a, b) => a - b);
			const out = [];
			let prev = 0;
			for (const p of sorted) {
				if (p - prev > 1) out.push("…");
				out.push(p);
				prev = p;
			}
			return out;
		});
		/** While a column sort is active, drag-to-reorder pauses (order would be ambiguous). */
		const isSorted = computed(() => table.getState().sorting.length > 0);
		const currentPage = computed(() => table.getState().pagination.pageIndex + 1);
		const paginationRange = computed(() => {
			const { pageIndex, pageSize } = table.getState().pagination;
			const total = table.getFilteredRowModel().rows.length;
			if (!total) return "0 条";
			return `第 ${pageIndex * pageSize + 1}–${Math.min((pageIndex + 1) * pageSize, total)} 条 · 共 ${total} 篇`;
		});
		const dragIndex = ref(null);
		const dragOverIndex = ref(null);
		const savingOrder = ref(false);
		function onDragStart(globalIndex) {
			dragIndex.value = globalIndex;
		}
		function onDragEnter(globalIndex) {
			if (dragIndex.value === null || globalIndex === dragIndex.value) return;
			dragOverIndex.value = globalIndex;
		}
		async function onDrop(globalIndex) {
			const from = dragIndex.value;
			dragIndex.value = null;
			dragOverIndex.value = null;
			if (isSorted.value || from === null || from === globalIndex) return;
			const moved = posts.value.splice(from, 1)[0];
			if (!moved) return;
			posts.value.splice(globalIndex, 0, moved);
			savingOrder.value = true;
			try {
				await $fetch$2("/api/admin/posts/order", {
					method: "POST",
					body: { slugs: posts.value.map((p) => p.slug) }
				});
			} catch {
				loadPosts();
			} finally {
				savingOrder.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AdminShell = AdminShell_default;
			if (unref(authenticated) === false) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><form class="admin-login"><h1>登录后台</h1><p class="admin-login-hint">输入管理员密码,管理你的博客文章。</p><input${ssrRenderAttr("value", unref(password))} type="password" placeholder="管理员密码" autocomplete="current-password">`);
				if (unref(loginError)) _push(`<p class="admin-message admin-message-error">${ssrInterpolate(unref(loginError))}</p>`);
				else _push(`<!---->`);
				_push(`<button class="admin-btn admin-btn-primary" type="submit"${ssrIncludeBooleanAttr(unref(loggingIn) || !unref(password)) ? " disabled" : ""}>${ssrInterpolate(unref(loggingIn) ? "登录中…" : "登录")}</button></form></div>`);
			} else if (unref(authenticated) === null) _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><div class="admin-loading admin-loading-center">加载中…</div></div>`);
			else _push(ssrRenderComponent(_component_AdminShell, mergeProps({
				title: "概览",
				subtitle: "管理博客内容与 IP 风险动态"
			}, _attrs), {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(Button_default), {
						as: "a",
						href: "/admin/posts/new",
						class: "admin-primary-btn"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(Plus), null, null, _parent, _scopeId));
								_push(` 新建文章 `);
							} else return [createVNode(unref(Plus)), createTextVNode(" 新建文章 ")];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(Button_default), {
						as: "a",
						href: "/admin/posts/new",
						class: "admin-primary-btn"
					}, {
						default: withCtx(() => [createVNode(unref(Plus)), createTextVNode(" 新建文章 ")]),
						_: 1
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="admin-stats"${_scopeId}><!--[-->`);
						ssrRenderList(unref(stats), (stat) => {
							_push(`<div class="admin-stat-card"${_scopeId}><span class="${ssrRenderClass([`tone-${stat.tone}`, "admin-stat-icon"])}"${_scopeId}>`);
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(stat.icon), null, null), _parent, _scopeId);
							_push(`</span><div class="admin-stat-meta"${_scopeId}><b${_scopeId}>${ssrInterpolate(stat.value)}</b><span${_scopeId}>${ssrInterpolate(stat.label)}</span></div></div>`);
						});
						_push(`<!--]--></div><section class="admin-risk"${_scopeId}><div class="admin-risk-head"${_scopeId}><h2${_scopeId}>IP 风险概览</h2><span class="admin-risk-sub"${_scopeId}>最近 ${ssrInterpolate(unref(riskStats)?.scans.length ?? 0)} 次扫描 · 共 ${ssrInterpolate(unref(riskStats)?.summary.count ?? 0)} 条</span></div><div class="admin-risk-body"${_scopeId}><div class="admin-risk-chips"${_scopeId}><span class="admin-chip admin-chip-low"${_scopeId}><b${_scopeId}>${ssrInterpolate(unref(riskStats)?.summary.low ?? 0)}</b>低风险</span><span class="admin-chip admin-chip-medium"${_scopeId}><b${_scopeId}>${ssrInterpolate(unref(riskStats)?.summary.medium ?? 0)}</b>中风险</span><span class="admin-chip admin-chip-high"${_scopeId}><b${_scopeId}>${ssrInterpolate(unref(riskStats)?.summary.high ?? 0)}</b>高风险</span><span class="admin-chip admin-chip-avg"${_scopeId}><b${_scopeId}>${ssrInterpolate(Number(unref(riskStats)?.summary.avg ?? 0).toFixed(1))}</b>平均分</span></div><div class="admin-risk-chart"${_scopeId}><svg${ssrRenderAttr("viewBox", `0 0 ${CHART_W} ${CHART_H}`)} preserveAspectRatio="none" role="img" aria-label="风险分走势"${_scopeId}><defs${_scopeId}><linearGradient id="riskAreaFill" x1="0" y1="0" x2="0" y2="1"${_scopeId}><stop offset="0%" stop-color="#12b84f" stop-opacity=".22"${_scopeId}></stop><stop offset="100%" stop-color="#12b84f" stop-opacity="0"${_scopeId}></stop></linearGradient></defs><line x1="20"${ssrRenderAttr("y1", 150)}${ssrRenderAttr("x2", 620)}${ssrRenderAttr("y2", 150)} class="risk-axis"${_scopeId}></line><line x1="20" y1="20"${ssrRenderAttr("x2", 620)} y2="20" class="risk-axis risk-axis-dashed"${_scopeId}></line>`);
						if (unref(chartAreaPath)) _push(`<path${ssrRenderAttr("d", unref(chartAreaPath))} fill="url(#riskAreaFill)"${_scopeId}></path>`);
						else _push(`<!---->`);
						if (unref(chartPoints)) _push(`<polyline${ssrRenderAttr("points", unref(chartPoints))} class="risk-line"${_scopeId}></polyline>`);
						else _push(`<!---->`);
						_push(`<!--[-->`);
						ssrRenderList(unref(chartDots), (dot, i) => {
							_push(`<circle${ssrRenderAttr("cx", dot.x)}${ssrRenderAttr("cy", dot.y)} r="4" class="${ssrRenderClass(`risk-dot risk-dot-${dot.level}`)}"${_scopeId}><title${_scopeId}>${ssrInterpolate(dot.ip)} — 风险分 ${ssrInterpolate(Number(dot.score ?? 0).toFixed(1))}</title></circle>`);
						});
						_push(`<!--]--></svg>`);
						if (!unref(chartDots).length) _push(`<p class="admin-risk-empty"${_scopeId}>暂无扫描记录——访客运行 IP 检测后,图表会自动填充。</p>`);
						else _push(`<!---->`);
						_push(`</div></div></section><div class="admin-posts-head"${_scopeId}><h2${_scopeId}>全部文章</h2>`);
						if (unref(savingOrder)) _push(`<span class="admin-order-saving"${_scopeId}>正在保存排序…</span>`);
						else _push(`<!---->`);
						_push(`<span class="admin-drag-hint"${_scopeId}>${ssrInterpolate(unref(isSorted) ? "按列排序中——点击排序图标取消后可恢复拖动排序。" : "拖动行即可排序——博客页面将按此顺序展示。")}</span></div>`);
						if (unref(loadingPosts)) _push(`<div class="admin-loading"${_scopeId}>文章加载中…</div>`);
						else if (!unref(posts).length) _push(`<p class="admin-empty"${_scopeId}>还没有文章,去创建第一篇吧。</p>`);
						else {
							_push(`<div class="rounded-xl border border-zinc-200 bg-white overflow-hidden"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Table_default), null, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(ssrRenderComponent(unref(TableHeader_default), null, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(ssrRenderComponent(unref(TableRow_default), { class: "hover:bg-transparent" }, {
													default: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) {
															_push(`<!--[-->`);
															ssrRenderList(unref(table).getHeaderGroups()[0]?.headers ?? [], (header) => {
																_push(ssrRenderComponent(unref(TableHead_default), {
																	key: header.id,
																	class: "h-11 px-4 first:pl-4 last:pr-4"
																}, {
																	default: withCtx((_, _push, _parent, _scopeId) => {
																		if (_push) {
																			if (!header.isPlaceholder) _push(ssrRenderComponent(unref(FlexRender), {
																				render: header.column.columnDef.header,
																				props: header.getContext()
																			}, null, _parent, _scopeId));
																			else _push(`<!---->`);
																		} else return [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
																			key: 0,
																			render: header.column.columnDef.header,
																			props: header.getContext()
																		}, null, 8, ["render", "props"])) : createCommentVNode("", true)];
																	}),
																	_: 2
																}, _parent, _scopeId));
															});
															_push(`<!--]-->`);
														} else return [(openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups()[0]?.headers ?? [], (header) => {
															return openBlock(), createBlock(unref(TableHead_default), {
																key: header.id,
																class: "h-11 px-4 first:pl-4 last:pr-4"
															}, {
																default: withCtx(() => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
																	key: 0,
																	render: header.column.columnDef.header,
																	props: header.getContext()
																}, null, 8, ["render", "props"])) : createCommentVNode("", true)]),
																_: 2
															}, 1024);
														}), 128))];
													}),
													_: 1
												}, _parent, _scopeId));
												else return [createVNode(unref(TableRow_default), { class: "hover:bg-transparent" }, {
													default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups()[0]?.headers ?? [], (header) => {
														return openBlock(), createBlock(unref(TableHead_default), {
															key: header.id,
															class: "h-11 px-4 first:pl-4 last:pr-4"
														}, {
															default: withCtx(() => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
																key: 0,
																render: header.column.columnDef.header,
																props: header.getContext()
															}, null, 8, ["render", "props"])) : createCommentVNode("", true)]),
															_: 2
														}, 1024);
													}), 128))]),
													_: 1
												})];
											}),
											_: 1
										}, _parent, _scopeId));
										_push(ssrRenderComponent(unref(TableBody_default), null, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													if (unref(table).getRowModel().rows.length) {
														_push(`<!--[-->`);
														ssrRenderList(unref(table).getRowModel().rows, (row) => {
															_push(ssrRenderComponent(unref(TableRow_default), {
																key: row.id,
																draggable: !unref(isSorted),
																class: {
																	"opacity-40": unref(dragIndex) === row.index,
																	"row-drag-over": unref(dragOverIndex) === row.index && unref(dragIndex) !== row.index
																},
																onDragstart: ($event) => !unref(isSorted) && onDragStart(row.index),
																onDragenter: ($event) => !unref(isSorted) && onDragEnter(row.index),
																onDragover: () => {},
																onDragleave: ($event) => unref(dragOverIndex) === row.index && (dragOverIndex.value = null),
																onDrop: ($event) => onDrop(row.index),
																onDragend: ($event) => {
																	dragIndex.value = null;
																	dragOverIndex.value = null;
																}
															}, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) {
																		_push(`<!--[-->`);
																		ssrRenderList(row.getVisibleCells(), (cell) => {
																			_push(ssrRenderComponent(unref(TableCell_default), {
																				key: cell.id,
																				class: "px-4 py-[18px] first:pl-4 last:pr-4"
																			}, {
																				default: withCtx((_, _push, _parent, _scopeId) => {
																					if (_push) _push(ssrRenderComponent(unref(FlexRender), {
																						render: cell.column.columnDef.cell,
																						props: cell.getContext()
																					}, null, _parent, _scopeId));
																					else return [createVNode(unref(FlexRender), {
																						render: cell.column.columnDef.cell,
																						props: cell.getContext()
																					}, null, 8, ["render", "props"])];
																				}),
																				_: 2
																			}, _parent, _scopeId));
																		});
																		_push(`<!--]-->`);
																	} else return [(openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
																		return openBlock(), createBlock(unref(TableCell_default), {
																			key: cell.id,
																			class: "px-4 py-[18px] first:pl-4 last:pr-4"
																		}, {
																			default: withCtx(() => [createVNode(unref(FlexRender), {
																				render: cell.column.columnDef.cell,
																				props: cell.getContext()
																			}, null, 8, ["render", "props"])]),
																			_: 2
																		}, 1024);
																	}), 128))];
																}),
																_: 2
															}, _parent, _scopeId));
														});
														_push(`<!--]-->`);
													} else _push(ssrRenderComponent(unref(TableRow_default), null, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(ssrRenderComponent(unref(TableCell_default), {
																colspan: columnDefs.length,
																class: "h-24 text-center text-zinc-500"
															}, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) _push(`暂无文章。`);
																	else return [createTextVNode("暂无文章。")];
																}),
																_: 1
															}, _parent, _scopeId));
															else return [createVNode(unref(TableCell_default), {
																colspan: columnDefs.length,
																class: "h-24 text-center text-zinc-500"
															}, {
																default: withCtx(() => [createTextVNode("暂无文章。")]),
																_: 1
															}, 8, ["colspan"])];
														}),
														_: 1
													}, _parent, _scopeId));
												} else return [unref(table).getRowModel().rows.length ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(table).getRowModel().rows, (row) => {
													return openBlock(), createBlock(unref(TableRow_default), {
														key: row.id,
														draggable: !unref(isSorted),
														class: {
															"opacity-40": unref(dragIndex) === row.index,
															"row-drag-over": unref(dragOverIndex) === row.index && unref(dragIndex) !== row.index
														},
														onDragstart: ($event) => !unref(isSorted) && onDragStart(row.index),
														onDragenter: withModifiers(($event) => !unref(isSorted) && onDragEnter(row.index), ["prevent"]),
														onDragover: withModifiers(() => {}, ["prevent"]),
														onDragleave: ($event) => unref(dragOverIndex) === row.index && (dragOverIndex.value = null),
														onDrop: withModifiers(($event) => onDrop(row.index), ["prevent"]),
														onDragend: ($event) => {
															dragIndex.value = null;
															dragOverIndex.value = null;
														}
													}, {
														default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
															return openBlock(), createBlock(unref(TableCell_default), {
																key: cell.id,
																class: "px-4 py-[18px] first:pl-4 last:pr-4"
															}, {
																default: withCtx(() => [createVNode(unref(FlexRender), {
																	render: cell.column.columnDef.cell,
																	props: cell.getContext()
																}, null, 8, ["render", "props"])]),
																_: 2
															}, 1024);
														}), 128))]),
														_: 2
													}, 1032, [
														"draggable",
														"class",
														"onDragstart",
														"onDragenter",
														"onDragover",
														"onDragleave",
														"onDrop",
														"onDragend"
													]);
												}), 128)) : (openBlock(), createBlock(unref(TableRow_default), { key: 1 }, {
													default: withCtx(() => [createVNode(unref(TableCell_default), {
														colspan: columnDefs.length,
														class: "h-24 text-center text-zinc-500"
													}, {
														default: withCtx(() => [createTextVNode("暂无文章。")]),
														_: 1
													}, 8, ["colspan"])]),
													_: 1
												}))];
											}),
											_: 1
										}, _parent, _scopeId));
									} else return [createVNode(unref(TableHeader_default), null, {
										default: withCtx(() => [createVNode(unref(TableRow_default), { class: "hover:bg-transparent" }, {
											default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups()[0]?.headers ?? [], (header) => {
												return openBlock(), createBlock(unref(TableHead_default), {
													key: header.id,
													class: "h-11 px-4 first:pl-4 last:pr-4"
												}, {
													default: withCtx(() => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
														key: 0,
														render: header.column.columnDef.header,
														props: header.getContext()
													}, null, 8, ["render", "props"])) : createCommentVNode("", true)]),
													_: 2
												}, 1024);
											}), 128))]),
											_: 1
										})]),
										_: 1
									}), createVNode(unref(TableBody_default), null, {
										default: withCtx(() => [unref(table).getRowModel().rows.length ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(table).getRowModel().rows, (row) => {
											return openBlock(), createBlock(unref(TableRow_default), {
												key: row.id,
												draggable: !unref(isSorted),
												class: {
													"opacity-40": unref(dragIndex) === row.index,
													"row-drag-over": unref(dragOverIndex) === row.index && unref(dragIndex) !== row.index
												},
												onDragstart: ($event) => !unref(isSorted) && onDragStart(row.index),
												onDragenter: withModifiers(($event) => !unref(isSorted) && onDragEnter(row.index), ["prevent"]),
												onDragover: withModifiers(() => {}, ["prevent"]),
												onDragleave: ($event) => unref(dragOverIndex) === row.index && (dragOverIndex.value = null),
												onDrop: withModifiers(($event) => onDrop(row.index), ["prevent"]),
												onDragend: ($event) => {
													dragIndex.value = null;
													dragOverIndex.value = null;
												}
											}, {
												default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
													return openBlock(), createBlock(unref(TableCell_default), {
														key: cell.id,
														class: "px-4 py-[18px] first:pl-4 last:pr-4"
													}, {
														default: withCtx(() => [createVNode(unref(FlexRender), {
															render: cell.column.columnDef.cell,
															props: cell.getContext()
														}, null, 8, ["render", "props"])]),
														_: 2
													}, 1024);
												}), 128))]),
												_: 2
											}, 1032, [
												"draggable",
												"class",
												"onDragstart",
												"onDragenter",
												"onDragover",
												"onDragleave",
												"onDrop",
												"onDragend"
											]);
										}), 128)) : (openBlock(), createBlock(unref(TableRow_default), { key: 1 }, {
											default: withCtx(() => [createVNode(unref(TableCell_default), {
												colspan: columnDefs.length,
												class: "h-24 text-center text-zinc-500"
											}, {
												default: withCtx(() => [createTextVNode("暂无文章。")]),
												_: 1
											}, 8, ["colspan"])]),
											_: 1
										}))]),
										_: 1
									})];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						}
						if (unref(posts).length) {
							_push(`<div class="flex flex-wrap items-center justify-between gap-4 mt-3 px-1"${_scopeId}><p class="text-[13px] text-zinc-500"${_scopeId}>${ssrInterpolate(unref(paginationRange))}</p><div class="flex flex-wrap items-center gap-5"${_scopeId}><div class="flex items-center gap-1"${_scopeId}><!--[-->`);
							ssrRenderList(unref(visiblePages), (p, i) => {
								_push(`<!--[-->`);
								if (p === "…") _push(`<span class="grid h-8 min-w-8 place-items-center text-[13px] text-zinc-400"${_scopeId}>…</span>`);
								else _push(`<button class="${ssrRenderClass([p === unref(currentPage) ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100", "grid h-8 min-w-8 place-items-center rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors"])}" type="button"${ssrRenderAttr("aria-label", `第 ${p} 页`)}${ssrRenderAttr("aria-current", p === unref(currentPage) ? "page" : void 0)}${_scopeId}>${ssrInterpolate(p)}</button>`);
								_push(`<!--]-->`);
							});
							_push(`<!--]--></div>`);
							_push(ssrRenderComponent(unref(Select_default), {
								"model-value": String(unref(table).getState().pagination.pageSize),
								"onUpdate:modelValue": (v) => unref(table).setPageSize(Number(v))
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(ssrRenderComponent(unref(SelectTrigger_default), { class: "h-8 w-[92px] text-[13px] text-zinc-600 shadow-none" }, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(ssrRenderComponent(unref(SelectValue_default), null, null, _parent, _scopeId));
												else return [createVNode(unref(SelectValue_default))];
											}),
											_: 1
										}, _parent, _scopeId));
										_push(ssrRenderComponent(unref(SelectContent_default), null, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push(`<!--[-->`);
													ssrRenderList([
														10,
														20,
														30,
														50
													], (size) => {
														_push(ssrRenderComponent(unref(SelectItem_default), {
															key: size,
															value: String(size)
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(`${ssrInterpolate(size)} 条 / 页 `);
																else return [createTextVNode(toDisplayString(size) + " 条 / 页 ", 1)];
															}),
															_: 2
														}, _parent, _scopeId));
													});
													_push(`<!--]-->`);
												} else return [(openBlock(), createBlock(Fragment, null, renderList([
													10,
													20,
													30,
													50
												], (size) => {
													return createVNode(unref(SelectItem_default), {
														key: size,
														value: String(size)
													}, {
														default: withCtx(() => [createTextVNode(toDisplayString(size) + " 条 / 页 ", 1)]),
														_: 2
													}, 1032, ["value"]);
												}), 64))];
											}),
											_: 1
										}, _parent, _scopeId));
									} else return [createVNode(unref(SelectTrigger_default), { class: "h-8 w-[92px] text-[13px] text-zinc-600 shadow-none" }, {
										default: withCtx(() => [createVNode(unref(SelectValue_default))]),
										_: 1
									}), createVNode(unref(SelectContent_default), null, {
										default: withCtx(() => [(openBlock(), createBlock(Fragment, null, renderList([
											10,
											20,
											30,
											50
										], (size) => {
											return createVNode(unref(SelectItem_default), {
												key: size,
												value: String(size)
											}, {
												default: withCtx(() => [createTextVNode(toDisplayString(size) + " 条 / 页 ", 1)]),
												_: 2
											}, 1032, ["value"]);
										}), 64))]),
										_: 1
									})];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div></div>`);
						} else _push(`<!---->`);
					} else return [
						createVNode("div", { class: "admin-stats" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(stats), (stat) => {
							return openBlock(), createBlock("div", {
								key: stat.label,
								class: "admin-stat-card"
							}, [createVNode("span", { class: ["admin-stat-icon", `tone-${stat.tone}`] }, [(openBlock(), createBlock(resolveDynamicComponent(stat.icon)))], 2), createVNode("div", { class: "admin-stat-meta" }, [createVNode("b", null, toDisplayString(stat.value), 1), createVNode("span", null, toDisplayString(stat.label), 1)])]);
						}), 128))]),
						createVNode("section", { class: "admin-risk" }, [createVNode("div", { class: "admin-risk-head" }, [createVNode("h2", null, "IP 风险概览"), createVNode("span", { class: "admin-risk-sub" }, "最近 " + toDisplayString(unref(riskStats)?.scans.length ?? 0) + " 次扫描 · 共 " + toDisplayString(unref(riskStats)?.summary.count ?? 0) + " 条", 1)]), createVNode("div", { class: "admin-risk-body" }, [createVNode("div", { class: "admin-risk-chips" }, [
							createVNode("span", { class: "admin-chip admin-chip-low" }, [createVNode("b", null, toDisplayString(unref(riskStats)?.summary.low ?? 0), 1), createTextVNode("低风险")]),
							createVNode("span", { class: "admin-chip admin-chip-medium" }, [createVNode("b", null, toDisplayString(unref(riskStats)?.summary.medium ?? 0), 1), createTextVNode("中风险")]),
							createVNode("span", { class: "admin-chip admin-chip-high" }, [createVNode("b", null, toDisplayString(unref(riskStats)?.summary.high ?? 0), 1), createTextVNode("高风险")]),
							createVNode("span", { class: "admin-chip admin-chip-avg" }, [createVNode("b", null, toDisplayString(Number(unref(riskStats)?.summary.avg ?? 0).toFixed(1)), 1), createTextVNode("平均分")])
						]), createVNode("div", { class: "admin-risk-chart" }, [(openBlock(), createBlock("svg", {
							viewBox: `0 0 ${CHART_W} ${CHART_H}`,
							preserveAspectRatio: "none",
							role: "img",
							"aria-label": "风险分走势"
						}, [
							createVNode("defs", null, [createVNode("linearGradient", {
								id: "riskAreaFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1"
							}, [createVNode("stop", {
								offset: "0%",
								"stop-color": "#12b84f",
								"stop-opacity": ".22"
							}), createVNode("stop", {
								offset: "100%",
								"stop-color": "#12b84f",
								"stop-opacity": "0"
							})])]),
							createVNode("line", {
								x1: "20",
								y1: 150,
								x2: 620,
								y2: 150,
								class: "risk-axis"
							}, null, 8, [
								"y1",
								"x2",
								"y2"
							]),
							createVNode("line", {
								x1: "20",
								y1: "20",
								x2: 620,
								y2: "20",
								class: "risk-axis risk-axis-dashed"
							}, null, 8, ["x2"]),
							unref(chartAreaPath) ? (openBlock(), createBlock("path", {
								key: 0,
								d: unref(chartAreaPath),
								fill: "url(#riskAreaFill)"
							}, null, 8, ["d"])) : createCommentVNode("", true),
							unref(chartPoints) ? (openBlock(), createBlock("polyline", {
								key: 1,
								points: unref(chartPoints),
								class: "risk-line"
							}, null, 8, ["points"])) : createCommentVNode("", true),
							(openBlock(true), createBlock(Fragment, null, renderList(unref(chartDots), (dot, i) => {
								return openBlock(), createBlock("circle", {
									key: i,
									cx: dot.x,
									cy: dot.y,
									r: "4",
									class: `risk-dot risk-dot-${dot.level}`
								}, [createVNode("title", null, toDisplayString(dot.ip) + " — 风险分 " + toDisplayString(Number(dot.score ?? 0).toFixed(1)), 1)], 10, ["cx", "cy"]);
							}), 128))
						], 8, ["viewBox"])), !unref(chartDots).length ? (openBlock(), createBlock("p", {
							key: 0,
							class: "admin-risk-empty"
						}, "暂无扫描记录——访客运行 IP 检测后,图表会自动填充。")) : createCommentVNode("", true)])])]),
						createVNode("div", { class: "admin-posts-head" }, [
							createVNode("h2", null, "全部文章"),
							unref(savingOrder) ? (openBlock(), createBlock("span", {
								key: 0,
								class: "admin-order-saving"
							}, "正在保存排序…")) : createCommentVNode("", true),
							createVNode("span", { class: "admin-drag-hint" }, toDisplayString(unref(isSorted) ? "按列排序中——点击排序图标取消后可恢复拖动排序。" : "拖动行即可排序——博客页面将按此顺序展示。"), 1)
						]),
						unref(loadingPosts) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "admin-loading"
						}, "文章加载中…")) : !unref(posts).length ? (openBlock(), createBlock("p", {
							key: 1,
							class: "admin-empty"
						}, "还没有文章,去创建第一篇吧。")) : (openBlock(), createBlock("div", {
							key: 2,
							class: "rounded-xl border border-zinc-200 bg-white overflow-hidden"
						}, [createVNode(unref(Table_default), null, {
							default: withCtx(() => [createVNode(unref(TableHeader_default), null, {
								default: withCtx(() => [createVNode(unref(TableRow_default), { class: "hover:bg-transparent" }, {
									default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups()[0]?.headers ?? [], (header) => {
										return openBlock(), createBlock(unref(TableHead_default), {
											key: header.id,
											class: "h-11 px-4 first:pl-4 last:pr-4"
										}, {
											default: withCtx(() => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
												key: 0,
												render: header.column.columnDef.header,
												props: header.getContext()
											}, null, 8, ["render", "props"])) : createCommentVNode("", true)]),
											_: 2
										}, 1024);
									}), 128))]),
									_: 1
								})]),
								_: 1
							}), createVNode(unref(TableBody_default), null, {
								default: withCtx(() => [unref(table).getRowModel().rows.length ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(table).getRowModel().rows, (row) => {
									return openBlock(), createBlock(unref(TableRow_default), {
										key: row.id,
										draggable: !unref(isSorted),
										class: {
											"opacity-40": unref(dragIndex) === row.index,
											"row-drag-over": unref(dragOverIndex) === row.index && unref(dragIndex) !== row.index
										},
										onDragstart: ($event) => !unref(isSorted) && onDragStart(row.index),
										onDragenter: withModifiers(($event) => !unref(isSorted) && onDragEnter(row.index), ["prevent"]),
										onDragover: withModifiers(() => {}, ["prevent"]),
										onDragleave: ($event) => unref(dragOverIndex) === row.index && (dragOverIndex.value = null),
										onDrop: withModifiers(($event) => onDrop(row.index), ["prevent"]),
										onDragend: ($event) => {
											dragIndex.value = null;
											dragOverIndex.value = null;
										}
									}, {
										default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
											return openBlock(), createBlock(unref(TableCell_default), {
												key: cell.id,
												class: "px-4 py-[18px] first:pl-4 last:pr-4"
											}, {
												default: withCtx(() => [createVNode(unref(FlexRender), {
													render: cell.column.columnDef.cell,
													props: cell.getContext()
												}, null, 8, ["render", "props"])]),
												_: 2
											}, 1024);
										}), 128))]),
										_: 2
									}, 1032, [
										"draggable",
										"class",
										"onDragstart",
										"onDragenter",
										"onDragover",
										"onDragleave",
										"onDrop",
										"onDragend"
									]);
								}), 128)) : (openBlock(), createBlock(unref(TableRow_default), { key: 1 }, {
									default: withCtx(() => [createVNode(unref(TableCell_default), {
										colspan: columnDefs.length,
										class: "h-24 text-center text-zinc-500"
									}, {
										default: withCtx(() => [createTextVNode("暂无文章。")]),
										_: 1
									}, 8, ["colspan"])]),
									_: 1
								}))]),
								_: 1
							})]),
							_: 1
						})])),
						unref(posts).length ? (openBlock(), createBlock("div", {
							key: 3,
							class: "flex flex-wrap items-center justify-between gap-4 mt-3 px-1"
						}, [createVNode("p", { class: "text-[13px] text-zinc-500" }, toDisplayString(unref(paginationRange)), 1), createVNode("div", { class: "flex flex-wrap items-center gap-5" }, [createVNode("div", { class: "flex items-center gap-1" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(visiblePages), (p, i) => {
							return openBlock(), createBlock(Fragment, { key: i }, [p === "…" ? (openBlock(), createBlock("span", {
								key: 0,
								class: "grid h-8 min-w-8 place-items-center text-[13px] text-zinc-400"
							}, "…")) : (openBlock(), createBlock("button", {
								key: 1,
								class: ["grid h-8 min-w-8 place-items-center rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors", p === unref(currentPage) ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"],
								type: "button",
								"aria-label": `第 ${p} 页`,
								"aria-current": p === unref(currentPage) ? "page" : void 0,
								onClick: ($event) => unref(table).setPageIndex(p - 1)
							}, toDisplayString(p), 11, [
								"aria-label",
								"aria-current",
								"onClick"
							]))], 64);
						}), 128))]), createVNode(unref(Select_default), {
							"model-value": String(unref(table).getState().pagination.pageSize),
							"onUpdate:modelValue": (v) => unref(table).setPageSize(Number(v))
						}, {
							default: withCtx(() => [createVNode(unref(SelectTrigger_default), { class: "h-8 w-[92px] text-[13px] text-zinc-600 shadow-none" }, {
								default: withCtx(() => [createVNode(unref(SelectValue_default))]),
								_: 1
							}), createVNode(unref(SelectContent_default), null, {
								default: withCtx(() => [(openBlock(), createBlock(Fragment, null, renderList([
									10,
									20,
									30,
									50
								], (size) => {
									return createVNode(unref(SelectItem_default), {
										key: size,
										value: String(size)
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(size) + " 条 / 页 ", 1)]),
										_: 2
									}, 1032, ["value"]);
								}), 64))]),
								_: 1
							})]),
							_: 1
						}, 8, ["model-value", "onUpdate:modelValue"])])])) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/admin/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var admin_default = index_vue_vue_type_script_setup_true_lang_default;

export { admin_default as default };
//# sourceMappingURL=admin-BzuN5PkU.mjs.map
