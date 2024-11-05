import Component from '@glimmer/component';
import type SelectedService from '../services/kolay/selected.ts';
import type { ComponentLike } from '@glint/template';
export declare class Page extends Component<{
    Blocks: {
        /**
         * If there was a compilation error, the `<:error>` block
         * will be active and pass the caller the error text from the compiler.
         *
         * Example:
         *
         * ```gjs
         * import { Page } from 'kolay/components';
         *
         * <template>
         *   <Page>
         *     <:error as |errorText|>
         *
         *       {{errorText}}
         *
         *     </:error>
         *     <:success></:success>
         *   </Page>
         * </template>
         * ```
         */
        error: [error: string];
        /**
         * If compilation of the active page was successful, the `<:success>` black
         * will be active, and will pass the component reference to the caller.
         *
         * Example:
         * ```gjs
         * import { Page } from 'kolay/components';
         *
         * <template>
         *   <Page>
         *     <:error></:error>
         *     <:success as |prose|>
         *
         *       <prose />
         *
         *     </:success>
         *   </Page>
         * </template>
         * ```
         */
        success: [prose: ComponentLike<{}>];
    };
}> {
    selected: SelectedService;
}
export default Page;
//# sourceMappingURL=page.d.ts.map