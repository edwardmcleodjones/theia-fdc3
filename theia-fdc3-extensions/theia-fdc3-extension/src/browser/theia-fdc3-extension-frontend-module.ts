/**
 * Generated using theia-extension-generator
 */
import { TheiaFdc3ExtensionCommandContribution, TheiaFdc3ExtensionMenuContribution } from './theia-fdc3-extension-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(TheiaFdc3ExtensionCommandContribution);
    bind(MenuContribution).to(TheiaFdc3ExtensionMenuContribution);
});
