import { defineComponent, h, nextTick as vueNextTick } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";
import waitFor from 'p-wait-for';

export interface RenderComposableResult<T> {
  result: T;
  waitFor: typeof waitFor;
  nextTick: typeof vueNextTick;
}

export type MountOptions = Parameters<typeof mount>[1]

export function renderComposable<T>(
  composable: () => T,
  options?: MountOptions
): RenderComposableResult<T> {
  const Child = defineComponent({
    setup() {
      const result = composable();
      const wrapper = () => result;
      return { wrapper };
    },
    render: () => null
  });

  const wrapper = mount({
    render: () => h(Child, { ref: 'child' }),
  }, options);

  return {
    result: (wrapper.vm.$refs.child as any).wrapper(),
    waitFor,
    nextTick: wrapper.vm.$nextTick,
  };
}
