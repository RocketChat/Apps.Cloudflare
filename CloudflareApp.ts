import {
    IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { CloudflareSlashCommand } from './slashcommands';

export class CloudflareApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configuration.slashCommands.provideSlashCommand(new CloudflareSlashCommand(this));

        configuration.settings.provideSetting({
            id: 'user_alias',
            type: SettingType.STRING,
            packageValue: 'Cloudflare',
            required: true,
            public: false,
            i18nLabel: 'user_alias_label',
            i18nDescription: 'user_alias_description',
        });

        configuration.settings.provideSetting({
            id: 'user_avatar',
            type: SettingType.STRING,
            packageValue: 'https://www.cloudflare.com/img/cf-facebook-card.png',
            required: true,
            public: false,
            i18nLabel: 'user_avatar_label',
            i18nDescription: 'user_avatar_description',
        });

        configuration.settings.provideSetting({
            id: 'auth_key',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'auth_key',
            i18nDescription: 'auth_key_description',
        });

        configuration.settings.provideSetting({
            id: 'auth_email',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'auth_email',
            i18nDescription: 'auth_email_description',
        });
    }
}
