import { c as useI18n } from '../virtual/entry.mjs';
import { ref, computed } from 'vue';

//#region app/composables/useRotatingPlaceholder.ts
function useRotatingPlaceholder(keys) {
	const { t } = useI18n();
	const index = ref(0);
	return computed(() => t(keys[index.value]));
}

export { useRotatingPlaceholder as u };
//# sourceMappingURL=useRotatingPlaceholder-hZeAfRvN.mjs.map
