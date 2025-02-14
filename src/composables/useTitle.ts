import { watch, ref, onMounted } from 'vue';

export function useTitle(newTitle: string) {
  const title = ref(newTitle);

  watch(title, (val) => {
    document.title = val;
  });

  onMounted(() => {
    document.title = title.value;
  });

  return title;
}