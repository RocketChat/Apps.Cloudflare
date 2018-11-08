import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { IHttp, IHttpRequest, IMessageBuilder, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import { App } from '@rocket.chat/apps-engine/definition/App';
import { startNewMessageWithDefaultSenderConfig } from './helpers';
import { sdk } from './sdk';

export class CloudflareSlashCommand implements ISlashCommand {
    public command = 'cloudflare';
    public i18nParamsExample = 'slashcommand_params';
    public i18nDescription = 'command_description';
    public providesPreview = false;

    constructor(private readonly app: App) { }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [command] = context.getArguments();

        if (!command) {
            return this.processHelpCommand(context, read, modify);
        }

        switch (command) {
            case 'ssldetails':
                this.processSSLDetails(context, read, modify, http, persis);
                break;

            default:
                return this.processHelpCommand(context, read, modify);
        }

    }

    private async processHelpCommand(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        const sender = await read.getUserReader().getById('rocket.cat');
        const room = context.getRoom();

        const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);
        const text =
            `These are the commands I can understand:
            \`/cloudflare ssldetails\` show details of...
            \`/cloudflare help\` Shows this message`;

        msg.setText(text);

        modify.getNotifier().notifyUser(context.getSender(), msg.getMessage());
    }

    private async processSSLDetails(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const sender = await read.getUserReader().getById('rocket.cat');
        const room = context.getRoom();

        const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);

        if (!await sdk.hasAuthInfo(read)) {
            msg.setText('Configure os dados de autenticação na area administrativa');
            modify.getCreator().finish(msg);
            return;
        }

        const data = await sdk.getSslVerification(http, read);

        if (data.result[0].certificate_status) {
            msg.setText('Certificado ativo');
        } else {
            msg.setText('Certificado inativo');
        }

        modify.getCreator().finish(msg);
    }
}
