import { $ as $fetch$2 } from '../virtual/entry.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { r as renderMarkdown } from '../_/markdown.mjs';

//#region app/components/AdminPostForm.vue?vue&type=script&setup=true&lang.ts
var AdminPostForm_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminPostForm",
	__ssrInlineRender: true,
	props: { post: {} },
	emits: ["saved"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const english = props.post?.translations?.en;
		const chinese = props.post?.translations?.zh;
		const title = ref(english?.title ?? props.post?.title ?? "");
		const slug = ref(props.post?.slug ?? "");
		ref(Boolean(props.post));
		const author = ref(props.post?.author ?? "IP Ready Team");
		const readTime = ref(props.post?.readTime ?? "");
		const category = ref(props.post?.category ?? "resources");
		const status = ref(props.post?.status ?? "draft");
		const cover = ref(props.post?.cover ?? "window");
		const coverImage = ref(props.post?.coverImage ?? "");
		const excerpt = ref(english?.excerpt ?? props.post?.excerpt ?? "");
		const markdown = ref(english?.markdown ?? props.post?.markdown ?? "");
		const zhTitle = ref(chinese?.title ?? "");
		const zhExcerpt = ref(chinese?.excerpt ?? "");
		const zhMarkdown = ref(chinese?.markdown ?? "");
		const date = ref(props.post?.date ?? (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric"
		}));
		const previewLocale = ref("en");
		const isEdit = computed(() => Boolean(props.post));
		const slugPreview = computed(() => slug.value || slugifyLocal(title.value));
		const hasChineseContent = computed(() => [
			zhTitle.value,
			zhExcerpt.value,
			zhMarkdown.value
		].some((value) => value.trim()));
		const htmlPreview = computed(() => renderMarkdown(previewLocale.value === "zh" ? zhMarkdown.value : markdown.value));
		const saving = ref(false);
		const errorMessage = ref("");
		const savedMessage = ref("");
		const uploadingCover = ref(false);
		const uploadError = ref("");
		const uploadMessage = ref("");
		function slugifyLocal(value) {
			return value.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
		}
		async function save() {
			saving.value = true;
			errorMessage.value = "";
			savedMessage.value = "";
			try {
				const sharedReadTime = readTime.value.trim();
				const translations = { en: {
					title: title.value,
					excerpt: excerpt.value,
					markdown: markdown.value,
					author: author.value,
					readTime: sharedReadTime
				} };
				if (hasChineseContent.value) translations.zh = {
					title: zhTitle.value,
					excerpt: zhExcerpt.value,
					markdown: zhMarkdown.value,
					author: author.value,
					readTime: sharedReadTime
				};
				const payload = {
					slug: slug.value,
					title: title.value,
					date: date.value,
					author: author.value,
					readTime: sharedReadTime,
					category: category.value,
					status: status.value,
					cover: cover.value,
					coverImage: coverImage.value,
					excerpt: excerpt.value,
					markdown: markdown.value,
					translations
				};
				if (isEdit.value) await $fetch$2(`/api/admin/posts/${props.post.slug}`, {
					method: "PUT",
					body: payload
				});
				else await $fetch$2("/api/admin/posts", {
					method: "POST",
					body: payload
				});
				savedMessage.value = "已保存";
				emit("saved", slug.value);
			} catch (error) {
				const err = error;
				errorMessage.value = err.data?.statusMessage || err.message || "保存失败";
			} finally {
				saving.value = false;
			}
		}
		__expose({ save });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-editor" }, _attrs))}><div class="admin-editor-toolbar">`);
			if (unref(errorMessage)) _push(`<p class="admin-message admin-message-error">${ssrInterpolate(unref(errorMessage))}</p>`);
			else if (unref(savedMessage)) _push(`<p class="admin-message admin-message-ok">${ssrInterpolate(unref(savedMessage))}</p>`);
			else _push(`<span></span>`);
			_push(`<button class="admin-btn admin-btn-primary" type="button"${ssrIncludeBooleanAttr(unref(saving) || unref(uploadingCover)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "保存中…" : "保存")}</button></div><div class="admin-form"><div class="admin-form-main"><div class="admin-field-row"><label class="admin-field"><span>Slug</span><input${ssrRenderAttr("value", unref(slug))} type="text"></label><label class="admin-field"><span>作者</span><input${ssrRenderAttr("value", unref(author))} type="text"></label><label class="admin-field"><span>阅读时长</span><input${ssrRenderAttr("value", unref(readTime))} type="text" placeholder="自动计算"></label></div><div class="admin-field-row"><label class="admin-field"><span>分类</span><select><option value="resources"${ssrIncludeBooleanAttr(Array.isArray(unref(category)) ? ssrLooseContain(unref(category), "resources") : ssrLooseEqual(unref(category), "resources")) ? " selected" : ""}>资源(Resources)</option><option value="changelog"${ssrIncludeBooleanAttr(Array.isArray(unref(category)) ? ssrLooseContain(unref(category), "changelog") : ssrLooseEqual(unref(category), "changelog")) ? " selected" : ""}>更新日志(Changelog)</option><option value="news"${ssrIncludeBooleanAttr(Array.isArray(unref(category)) ? ssrLooseContain(unref(category), "news") : ssrLooseEqual(unref(category), "news")) ? " selected" : ""}>资讯(News)</option></select></label><label class="admin-field"><span>状态</span><select><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(status)) ? ssrLooseContain(unref(status), "draft") : ssrLooseEqual(unref(status), "draft")) ? " selected" : ""}>草稿</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(status)) ? ssrLooseContain(unref(status), "published") : ssrLooseEqual(unref(status), "published")) ? " selected" : ""}>已发布</option><option value="unpublished"${ssrIncludeBooleanAttr(Array.isArray(unref(status)) ? ssrLooseContain(unref(status), "unpublished") : ssrLooseEqual(unref(status), "unpublished")) ? " selected" : ""}>下架</option></select></label><label class="admin-field"><span>日期</span><input${ssrRenderAttr("value", unref(date))} type="text"></label></div><div class="admin-field-row"><label class="admin-field"><span>封面占位图案(无图时)</span><select><option value="window"${ssrIncludeBooleanAttr(Array.isArray(unref(cover)) ? ssrLooseContain(unref(cover), "window") : ssrLooseEqual(unref(cover), "window")) ? " selected" : ""}>Window</option><option value="steps"${ssrIncludeBooleanAttr(Array.isArray(unref(cover)) ? ssrLooseContain(unref(cover), "steps") : ssrLooseEqual(unref(cover), "steps")) ? " selected" : ""}>Steps</option><option value="orbit"${ssrIncludeBooleanAttr(Array.isArray(unref(cover)) ? ssrLooseContain(unref(cover), "orbit") : ssrLooseEqual(unref(cover), "orbit")) ? " selected" : ""}>Orbit</option><option value="tiles"${ssrIncludeBooleanAttr(Array.isArray(unref(cover)) ? ssrLooseContain(unref(cover), "tiles") : ssrLooseEqual(unref(cover), "tiles")) ? " selected" : ""}>Tiles</option></select></label><label class="admin-field"><span>封面图片路径(可选)</span><input${ssrRenderAttr("value", unref(coverImage))} type="text" placeholder="/landing/blog/我的封面.png"></label></div><label class="admin-field admin-cover-upload"><span>上传封面图片</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif"${ssrIncludeBooleanAttr(unref(uploadingCover)) ? " disabled" : ""}><small>支持 PNG、JPG、WebP、GIF，最大 8 MB。上传成功后自动回填上方路径。</small>`);
			if (unref(uploadError)) _push(`<p class="admin-message admin-message-error" role="alert">${ssrInterpolate(unref(uploadError))}</p>`);
			else if (unref(uploadMessage)) _push(`<p class="admin-message admin-message-ok" aria-live="polite">${ssrInterpolate(unref(uploadMessage))}</p>`);
			else if (unref(uploadingCover)) _push(`<p class="admin-message" aria-live="polite">正在上传…</p>`);
			else _push(`<!---->`);
			_push(`</label><section class="admin-language-section"><h2>英文版</h2><label class="admin-field"><span>英文标题</span><input${ssrRenderAttr("value", unref(title))} type="text"></label><label class="admin-field"><span>英文摘要</span><textarea rows="2">${ssrInterpolate(unref(excerpt))}</textarea></label><label class="admin-field"><span>英文正文 (Markdown)</span><textarea rows="22" class="admin-markdown">${ssrInterpolate(unref(markdown))}</textarea></label></section><section class="admin-language-section admin-language-section-zh"><h2>中文版</h2><label class="admin-field"><span>中文标题</span><input${ssrRenderAttr("value", unref(zhTitle))} type="text"></label><label class="admin-field"><span>中文摘要</span><textarea rows="2">${ssrInterpolate(unref(zhExcerpt))}</textarea></label><label class="admin-field"><span>中文正文 (Markdown)</span><textarea rows="22" class="admin-markdown">${ssrInterpolate(unref(zhMarkdown))}</textarea></label></section></div><aside class="admin-form-preview"><div class="admin-preview-heading"><p class="admin-preview-label">预览 · /blog/${ssrInterpolate(unref(slugPreview))}</p><div class="admin-preview-locale" aria-label="预览语言"><button type="button" class="${ssrRenderClass({ active: unref(previewLocale) === "en" })}">English</button><button type="button" class="${ssrRenderClass({ active: unref(previewLocale) === "zh" })}">中文</button></div></div><div class="blog-article-body admin-preview-body">${unref(htmlPreview) ?? ""}</div></aside></div></div>`);
		};
	}
});
//#endregion
//#region app/components/AdminPostForm.vue
var _sfc_setup = AdminPostForm_vue_vue_type_script_setup_true_lang_default.setup;
AdminPostForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminPostForm.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AdminPostForm_default = Object.assign(AdminPostForm_vue_vue_type_script_setup_true_lang_default, { __name: "AdminPostForm" });

export { AdminPostForm_default as A };
//# sourceMappingURL=AdminPostForm-DL20Q56v.mjs.map
