import { P as PlatformLandingPage_default, l as landingPages } from './PlatformLandingPage-D1UY9nyw.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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
import './AppFooter-Bo_g4zYJ.mjs';
import './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import './InteractiveGlobe-DalcPMA7.mjs';
import '../_/platform-readiness.mjs';
import './_virtual_public-BD6c3a9J.mjs';
import '../_/ip-display.mjs';

//#region app/pages/amazon-ip-check.vue?vue&type=script&setup=true&lang.ts
var amazon_ip_check_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "amazon-ip-check",
	__ssrInlineRender: true,
	setup(__props) {
		const page = landingPages.amazon;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(PlatformLandingPage_default, mergeProps({ page: unref(page) }, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/pages/amazon-ip-check.vue
var _sfc_setup = amazon_ip_check_vue_vue_type_script_setup_true_lang_default.setup;
amazon_ip_check_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/amazon-ip-check.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var amazon_ip_check_default = amazon_ip_check_vue_vue_type_script_setup_true_lang_default;

export { amazon_ip_check_default as default };
//# sourceMappingURL=amazon-ip-check-C1XLnmJz.mjs.map
