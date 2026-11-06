import { defineComponent, mergeProps, unref, useSSRContext, withCtx, createVNode, renderSlot } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { reactiveOmit } from '@vueuse/core';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

//#region app/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region app/components/ui/table/Table.vue?vue&type=script&setup=true&lang.ts
var Table_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Table",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				"data-slot": "table-container",
				class: "relative w-full overflow-auto"
			}, _attrs))}><table data-slot="table" class="${ssrRenderClass(unref(cn)("w-full caption-bottom text-sm", props.class))}">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</table></div>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/Table.vue
var _sfc_setup$8 = Table_vue_vue_type_script_setup_true_lang_default.setup;
Table_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/Table.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var Table_default = Object.assign(Table_vue_vue_type_script_setup_true_lang_default, { __name: "UiTable" });
//#endregion
//#region app/components/ui/table/TableBody.vue?vue&type=script&setup=true&lang.ts
var TableBody_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableBody",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<tbody${ssrRenderAttrs(mergeProps({
				"data-slot": "table-body",
				class: unref(cn)("[&_tr:last-child]:border-0", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</tbody>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableBody.vue
var _sfc_setup$7 = TableBody_vue_vue_type_script_setup_true_lang_default.setup;
TableBody_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableBody.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var TableBody_default = Object.assign(TableBody_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableBody" });
//#endregion
//#region app/components/ui/table/TableCaption.vue?vue&type=script&setup=true&lang.ts
var TableCaption_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableCaption",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<caption${ssrRenderAttrs(mergeProps({
				"data-slot": "table-caption",
				class: unref(cn)("text-muted-foreground mt-4 text-sm", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</caption>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableCaption.vue
var _sfc_setup$6 = TableCaption_vue_vue_type_script_setup_true_lang_default.setup;
TableCaption_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableCaption.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
Object.assign(TableCaption_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableCaption" });
//#endregion
//#region app/components/ui/table/TableCell.vue?vue&type=script&setup=true&lang.ts
var TableCell_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableCell",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<td${ssrRenderAttrs(mergeProps({
				"data-slot": "table-cell",
				class: unref(cn)("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</td>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableCell.vue
var _sfc_setup$5 = TableCell_vue_vue_type_script_setup_true_lang_default.setup;
TableCell_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableCell.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var TableCell_default = Object.assign(TableCell_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableCell" });
//#endregion
//#region app/components/ui/table/TableRow.vue?vue&type=script&setup=true&lang.ts
var TableRow_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableRow",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<tr${ssrRenderAttrs(mergeProps({
				"data-slot": "table-row",
				class: unref(cn)("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</tr>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableRow.vue
var _sfc_setup$4 = TableRow_vue_vue_type_script_setup_true_lang_default.setup;
TableRow_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableRow.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var TableRow_default = Object.assign(TableRow_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableRow" });
//#endregion
//#region app/components/ui/table/TableEmpty.vue?vue&type=script&setup=true&lang.ts
var TableEmpty_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableEmpty",
	__ssrInlineRender: true,
	props: {
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		colspan: { default: 1 }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(TableRow_default, _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(TableCell_default, mergeProps({ class: unref(cn)("p-4 whitespace-nowrap align-middle text-sm text-foreground", props.class) }, unref(delegatedProps)), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex items-center justify-center py-10"${_scopeId}>`);
								ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex items-center justify-center py-10" }, [renderSlot(_ctx.$slots, "default")])];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [createVNode(TableCell_default, mergeProps({ class: unref(cn)("p-4 whitespace-nowrap align-middle text-sm text-foreground", props.class) }, unref(delegatedProps)), {
						default: withCtx(() => [createVNode("div", { class: "flex items-center justify-center py-10" }, [renderSlot(_ctx.$slots, "default")])]),
						_: 3
					}, 16, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/ui/table/TableEmpty.vue
var _sfc_setup$3 = TableEmpty_vue_vue_type_script_setup_true_lang_default.setup;
TableEmpty_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableEmpty.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
Object.assign(TableEmpty_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableEmpty" });
//#endregion
//#region app/components/ui/table/TableFooter.vue?vue&type=script&setup=true&lang.ts
var TableFooter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableFooter",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<tfoot${ssrRenderAttrs(mergeProps({
				"data-slot": "table-footer",
				class: unref(cn)("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</tfoot>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableFooter.vue
var _sfc_setup$2 = TableFooter_vue_vue_type_script_setup_true_lang_default.setup;
TableFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableFooter.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
Object.assign(TableFooter_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableFooter" });
//#endregion
//#region app/components/ui/table/TableHead.vue?vue&type=script&setup=true&lang.ts
var TableHead_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableHead",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<th${ssrRenderAttrs(mergeProps({
				"data-slot": "table-head",
				class: unref(cn)("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</th>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableHead.vue
var _sfc_setup$1 = TableHead_vue_vue_type_script_setup_true_lang_default.setup;
TableHead_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableHead.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var TableHead_default = Object.assign(TableHead_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableHead" });
//#endregion
//#region app/components/ui/table/TableHeader.vue?vue&type=script&setup=true&lang.ts
var TableHeader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableHeader",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<thead${ssrRenderAttrs(mergeProps({
				"data-slot": "table-header",
				class: unref(cn)("[&_tr]:border-b", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</thead>`);
		};
	}
});
//#endregion
//#region app/components/ui/table/TableHeader.vue
var _sfc_setup = TableHeader_vue_vue_type_script_setup_true_lang_default.setup;
TableHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableHeader.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TableHeader_default = Object.assign(TableHeader_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableHeader" });

export { Table_default as T, TableHeader_default as a, TableRow_default as b, TableHead_default as c, TableBody_default as d, TableCell_default as e, cn as f };
//# sourceMappingURL=table-C5wIZS21.mjs.map
